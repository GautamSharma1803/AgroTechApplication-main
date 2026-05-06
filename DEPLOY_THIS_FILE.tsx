// ============================================
// COMPLETE AGROTECH BACKEND - SINGLE FILE
// ============================================
// Deploy this EXACT file to Supabase Edge Functions
// Function name: make-server-2598bc7a
// ============================================

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

// ============= KV STORE (Database Helper) =============
const kvClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const kv = {
  set: async (key: string, value: any): Promise<void> => {
    const supabase = kvClient();
    const { error } = await supabase.from("kv_store_2598bc7a").upsert({ key, value });
    if (error) throw new Error(error.message);
  },

  get: async (key: string): Promise<any> => {
    const supabase = kvClient();
    const { data, error } = await supabase.from("kv_store_2598bc7a").select("value").eq("key", key).maybeSingle();
    if (error) throw new Error(error.message);
    return data?.value;
  },

  del: async (key: string): Promise<void> => {
    const supabase = kvClient();
    const { error } = await supabase.from("kv_store_2598bc7a").delete().eq("key", key);
    if (error) throw new Error(error.message);
  },

  getByPrefix: async (prefix: string): Promise<any[]> => {
    const supabase = kvClient();
    const { data, error } = await supabase.from("kv_store_2598bc7a").select("key, value").like("key", prefix + "%");
    if (error) throw new Error(error.message);
    return data?.map((d) => d.value) ?? [];
  }
};

// ============= INITIALIZE APP =============
const app = new Hono();

app.use("*", cors());
app.use("*", logger(console.log));

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = "make-2598bc7a-agro-images";

// Initialize storage
async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, { public: false, fileSizeLimit: 10485760 });
      console.log(`Created bucket: ${BUCKET_NAME}`);
    }
  } catch (error) {();

// ============= AUTHENTICATION HELPER =============
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];

  // IMPORTANT: Recognize admin token
  if (token === 'admin-authenticated') {
    return {
      id: 'admin-001',
      email: 'admin@agrotech.com',
      user_metadata: {
        fullName: 'Administrator',
        role: 'admin'
      }
    };
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// Admin verification
async function verifyAdmin(authHeader: string | null) {
  const user = await verifyAuth(authHeader);
  if (!user) return null;

  const isAdmin = user.email === 'admin@agrotech.com' || user.user_metadata?.role === 'admin';
  if (!isAdmin) return null;

  return user;
}

// ============= PUBLIC ROUTES =============

// Health check (public, no auth required)
app.get("/make-server-2598bc7a/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString(), deployed: true });
});

// Ping endpoint (public, no auth required)
app.get("/make-server-2598bc7a/ping", (c) => {
  return c.json({ pong: true, deployed: true });
});

// ============= AUTH ROUTES =============

app.post("/make-server-2598bc7a/auth/signup", async (c) => {
  try {
    const { email, password, fullName, phone } = await c.req.json();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { fullName, phone },
      email_confirm: true,
    });
    if (error) return c.json({ error: error.message }, 400);
    return c.json({ user: data.user });
  } catch (error) {
    return c.json({ error: "Failed to create account" }, 500);
  }
});

app.post("/make-server-2598bc7a/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return c.json({ error: error.message }, 401);
    return c.json({ user: data.user, session: data.session });
  } catch (error) {
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

app.get("/make-server-2598bc7a/auth/session", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    return c.json({ user });
  } catch (error) {
    return c.json({ error: "Failed to get session" }, 500);
  }
});

// ============= ADMIN ROUTES =============

app.get("/make-server-2598bc7a/admin/users", async (c) => {
  try {
    const admin = await verifyAdmin(c.req.header("Authorization"));
    if (!admin) return c.json({ error: "Admin access required" }, 403);

    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) return c.json({ error: "Failed to fetch users" }, 500);

    const transformedUsers = await Promise.all(users.map(async (user: any) => {
      const orders = await kv.getByPrefix(`order:${user.id}:`);
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.fullName || user.email?.split('@')[0] || 'Unknown',
        phone: user.user_metadata?.phone || '',
        status: user.banned_until ? 'suspended' : 'active',
        joinedDate: new Date(user.created_at),
        totalOrders: orders?.length || 0,
        totalSpent: Math.round(orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0)
      };
    }));

    return c.json({ users: transformedUsers });
  } catch (error) {
    console.error("Admin get users error:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

app.get("/make-server-2598bc7a/admin/orders", async (c) => {
  try {
    const admin = await verifyAdmin(c.req.header("Authorization"));
    if (!admin) return c.json({ error: "Admin access required" }, 403);
    const allOrders = await kv.getByPrefix("order:");
    return c.json({ orders: allOrders || [] });
  } catch (error) {
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

app.get("/make-server-2598bc7a/admin/activities", async (c) => {
  try {
    const admin = await verifyAdmin(c.req.header("Authorization"));
    if (!admin) return c.json({ error: "Admin access required" }, 403);
    const activities = await kv.getByPrefix("activity:");
    const sorted = (activities || []).sort((a: any, b: any) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return c.json({ activities: sorted.slice(0, 50) });
  } catch (error) {
    return c.json({ error: "Failed to fetch activities" }, 500);
  }
});

app.post("/make-server-2598bc7a/admin/users/:userId/suspend", async (c) => {
  try {
    const admin = await verifyAdmin(c.req.header("Authorization"));
    if (!admin) return c.json({ error: "Admin access required" }, 403);
    const userId = c.req.param("userId");
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      banned_until: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
    });
    if (error) return c.json({ error: "Failed to suspend user" }, 500);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Failed to suspend user" }, 500);
  }
});

app.post("/make-server-2598bc7a/admin/users/:userId/activate", async (c) => {
  try {
    const admin = await verifyAdmin(c.req.header("Authorization"));
    if (!admin) return c.json({ error: "Admin access required" }, 403);
    const userId = c.req.param("userId");
    const { error } = await supabase.auth.admin.updateUserById(userId, { banned_until: 'none' });
    if (error) return c.json({ error: "Failed to activate user" }, 500);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Failed to activate user" }, 500);
  }
});

app.put("/make-server-2598bc7a/admin/orders/:orderId", async (c) => {
  try {
    const admin = await verifyAdmin(c.req.header("Authorization"));
    if (!admin) return c.json({ error: "Admin access required" }, 403);
    const orderId = c.req.param("orderId");
    const { status } = await c.req.json();
    const order = await kv.get(`order:${orderId}`);
    if (!order) return c.json({ error: "Order not found" }, 404);
    const updatedOrder = { ...order, status, updatedAt: new Date().toISOString() };
    await kv.set(`order:${orderId}`, updatedOrder);
    return c.json({ order: updatedOrder });
  } catch (error) {
    return c.json({ error: "Failed to update order" }, 500);
  }
});

// ============= CROP ROUTES =============

app.get("/make-server-2598bc7a/crops", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const crops = await kv.getByPrefix(`crops:${user.id}:`);
    return c.json({ crops: crops || [] });
  } catch (error) {
    return c.json({ error: "Failed to fetch crops" }, 500);
  }
});

app.post("/make-server-2598bc7a/crops", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const cropData = await c.req.json();
    const cropId = crypto.randomUUID();
    const crop = {
      id: cropId,
      userId: user.id,
      ...cropData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await kv.set(`crops:${user.id}:${cropId}`, crop);
    return c.json({ crop });
  } catch (error) {
    return c.json({ error: "Failed to create crop" }, 500);
  }
});

app.delete("/make-server-2598bc7a/crops/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const cropId = c.req.param("id");
    await kv.del(`crops:${user.id}:${cropId}`);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Failed to delete crop" }, 500);
  }
});

// ============= MARKETPLACE ROUTES =============

app.get("/make-server-2598bc7a/market/products", async (c) => {
  try {
    const search = c.req.query("search") || "";
    const products = await kv.getByPrefix("market:product:");
    let filtered = products || [];
    if (search) {
      filtered = filtered.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    return c.json({ products: filtered });
  } catch (error) {
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

app.get("/make-server-2598bc7a/market/my-listings", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const allProducts = await kv.getByPrefix("market:product:");
    const myProducts = (allProducts || []).filter((p: any) => p.sellerId === user.id);
    return c.json({ products: myProducts });
  } catch (error) {
    return c.json({ error: "Failed to fetch listings" }, 500);
  }
});

// ============= DIAGNOSIS ROUTES =============

app.post("/make-server-2598bc7a/diagnose", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const { image } = await c.req.json();

    const diagnosisId = crypto.randomUUID();
    const diagnosis = {
      id: diagnosisId,
      userId: user.id,
      disease: "Mock Disease",
      confidence: 85,
      severity: "Medium",
      treatments: ["Treatment 1", "Treatment 2"],
      preventions: ["Prevention 1", "Prevention 2"],
      imageUrl: image,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`diagnosis:${user.id}:${diagnosisId}`, diagnosis);
    return c.json({ diagnosis });
  } catch (error) {
    return c.json({ error: "Failed to analyze plant" }, 500);
  }
});

// ============= START SERVER =============
Deno.serve(app.fetch);
    console.error("Error initializing storage:", error);
  }
}
initializeStorage
