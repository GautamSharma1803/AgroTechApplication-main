import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize storage buckets
const BUCKET_NAME = "make-2598bc7a-agro-images";

async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      console.log(`Created bucket: ${BUCKET_NAME}`);
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
}

// Initialize on startup
initializeStorage();

// Helper to verify authentication
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// ============= AUTHENTICATION ROUTES =============

// Sign up
app.post("/make-server-2598bc7a/auth/signup", async (c) => {
  try {
    const { email, password, fullName, phone } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { fullName, phone },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.error("Sign up error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.error("Sign up error:", error);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// Sign in
app.post("/make-server-2598bc7a/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return c.json({ error: error.message }, 401);
    }

    return c.json({ 
      user: data.user,
      session: data.session 
    });
  } catch (error) {
    console.error("Sign in error:", error);
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

// Get current session
app.get("/make-server-2598bc7a/auth/session", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    return c.json({ user });
  } catch (error) {
    console.error("Session error:", error);
    return c.json({ error: "Failed to get session" }, 500);
  }
});

// ============= CROP MANAGEMENT ROUTES =============

app.get("/make-server-2598bc7a/crops", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const crops = await kv.getByPrefix(`crops:${user.id}:`);
    return c.json({ crops: crops || [] });
  } catch (error) {
    console.error("Get crops error:", error);
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
    console.error("Create crop error:", error);
    return c.json({ error: "Failed to create crop" }, 500);
  }
});

app.put("/make-server-2598bc7a/crops/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const cropId = c.req.param("id");
    const updates = await c.req.json();
    
    const existing = await kv.get(`crops:${user.id}:${cropId}`);
    if (!existing) {
      return c.json({ error: "Crop not found" }, 404);
    }

    const crop = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`crops:${user.id}:${cropId}`, crop);
    return c.json({ crop });
  } catch (error) {
    console.error("Update crop error:", error);
    return c.json({ error: "Failed to update crop" }, 500);
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
    console.error("Delete crop error:", error);
    return c.json({ error: "Failed to delete crop" }, 500);
  }
});

// ============= DIAGNOSIS ROUTES =============

app.post("/make-server-2598bc7a/diagnose", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const { image, cropType } = await c.req.json();
    
    // Call Plant.id API for disease detection
    const PLANT_ID_API_KEY = Deno.env.get("PLANT_ID_API_KEY");
    
    if (!PLANT_ID_API_KEY) {
      // Mock response if API key not configured
      const diagnosisId = crypto.randomUUID();
      const diagnosis = {
        id: diagnosisId,
        userId: user.id,
        disease: "Tomato Late Blight",
        confidence: 92,
        severity: "High",
        treatments: [
          "Remove and destroy affected leaves immediately",
          "Apply copper-based fungicide spray",
          "Improve air circulation around plants",
          "Avoid overhead watering",
          "Monitor plants daily for new symptoms"
        ],
        preventions: [
          "Plant resistant varieties",
          "Ensure proper spacing between plants",
          "Water at soil level, not on leaves",
          "Remove plant debris regularly"
        ],
        imageUrl: image,
        createdAt: new Date().toISOString(),
      };

      await kv.set(`diagnosis:${user.id}:${diagnosisId}`, diagnosis);
      return c.json({ diagnosis });
    }

    // Real Plant.id API call
    const response = await fetch("https://api.plant.id/v2/health_assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": PLANT_ID_API_KEY,
      },
      body: JSON.stringify({
        images: [image],
        modifiers: ["crops_fast", "similar_images"],
        disease_details: ["cause", "common_names", "classification", "description", "treatment", "url"],
      }),
    });

    const result = await response.json();
    
    const diagnosisId = crypto.randomUUID();
    const diagnosis = {
      id: diagnosisId,
      userId: user.id,
      disease: result.health_assessment?.diseases?.[0]?.name || "Unknown",
      confidence: Math.round((result.health_assessment?.diseases?.[0]?.probability || 0) * 100),
      severity: result.health_assessment?.diseases?.[0]?.probability > 0.7 ? "High" : "Medium",
      treatments: result.health_assessment?.diseases?.[0]?.disease_details?.treatment?.chemical || [],
      preventions: result.health_assessment?.diseases?.[0]?.disease_details?.treatment?.prevention || [],
      imageUrl: image,
      rawData: result,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`diagnosis:${user.id}:${diagnosisId}`, diagnosis);
    return c.json({ diagnosis });
  } catch (error) {
    console.error("Diagnosis error:", error);
    return c.json({ error: "Failed to analyze plant" }, 500);
  }
});

app.get("/make-server-2598bc7a/diagnoses", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const diagnoses = await kv.getByPrefix(`diagnosis:${user.id}:`);
    return c.json({ diagnoses: diagnoses || [] });
  } catch (error) {
    console.error("Get diagnoses error:", error);
    return c.json({ error: "Failed to fetch diagnoses" }, 500);
  }
});

// ============= SOIL HEALTH ROUTES =============

app.post("/make-server-2598bc7a/soil-tests", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const testData = await c.req.json();
    const testId = crypto.randomUUID();
    
    // Calculate overall score
    const score = calculateSoilScore(testData);
    const recommendations = generateSoilRecommendations(testData);
    
    const soilTest = {
      id: testId,
      userId: user.id,
      ...testData,
      score,
      recommendations,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`soiltest:${user.id}:${testId}`, soilTest);
    return c.json({ soilTest });
  } catch (error) {
    console.error("Soil test error:", error);
    return c.json({ error: "Failed to save soil test" }, 500);
  }
});

app.get("/make-server-2598bc7a/soil-tests", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const tests = await kv.getByPrefix(`soiltest:${user.id}:`);
    return c.json({ tests: tests || [] });
  } catch (error) {
    console.error("Get soil tests error:", error);
    return c.json({ error: "Failed to fetch soil tests" }, 500);
  }
});

// ============= MARKETPLACE ROUTES =============

app.get("/make-server-2598bc7a/market/products", async (c) => {
  try {
    const search = c.req.query("search") || "";
    const products = await kv.getByPrefix("market:product:");
    
    let filtered = products || [];
    if (search) {
      filtered = filtered.filter((p: any) => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return c.json({ products: filtered });
  } catch (error) {
    console.error("Get products error:", error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

app.post("/make-server-2598bc7a/market/products", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const productData = await c.req.json();
    const productId = crypto.randomUUID();
    
    const product = {
      id: productId,
      sellerId: user.id,
      sellerName: user.user_metadata?.fullName || "Anonymous",
      ...productData,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    await kv.set(`market:product:${productId}`, product);
    return c.json({ product });
  } catch (error) {
    console.error("Create product error:", error);
    return c.json({ error: "Failed to create product" }, 500);
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
    console.error("Get my listings error:", error);
    return c.json({ error: "Failed to fetch listings" }, 500);
  }
});

// ============= WEATHER ROUTE =============

app.get("/make-server-2598bc7a/weather", async (c) => {
  try {
    const lat = c.req.query("lat") || "37.7749";
    const lon = c.req.query("lon") || "-122.4194";
    
    const WEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
    
    if (!WEATHER_API_KEY) {
      // Mock weather data
      return c.json({
        weather: {
          temp: 28,
          humidity: 65,
          description: "Partly Cloudy",
          icon: "02d",
        }
      });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    const data = await response.json();
    
    return c.json({
      weather: {
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].main,
        icon: data.weather[0].icon,
      }
    });
  } catch (error) {
    console.error("Weather error:", error);
    return c.json({ error: "Failed to fetch weather" }, 500);
  }
});

// ============= IMAGE UPLOAD ROUTE =============

app.post("/make-server-2598bc7a/upload", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const { image, type } = await c.req.json();
    
    // Extract base64 data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `${user.id}/${type}/${crypto.randomUUID()}.jpg`;
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: "image/jpeg",
      });

    if (error) {
      console.error("Upload error:", error);
      return c.json({ error: "Failed to upload image" }, 500);
    }

    // Get signed URL
    const { data: signedUrl } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 31536000); // 1 year

    return c.json({ url: signedUrl?.signedUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

// ============= HELPER FUNCTIONS =============

function calculateSoilScore(testData: any): number {
  let score = 100;
  
  // pH scoring
  const pH = parseFloat(testData.pH);
  if (pH < 5.5 || pH > 7.5) score -= 15;
  else if (pH < 6.0 || pH > 7.0) score -= 5;
  
  // NPK scoring
  const n = parseFloat(testData.nitrogen);
  const p = parseFloat(testData.phosphorus);
  const k = parseFloat(testData.potassium);
  
  if (n < 40 || n > 60) score -= 10;
  if (p < 30 || p > 50) score -= 10;
  if (k < 100 || k > 150) score -= 10;
  
  return Math.max(0, score);
}

function generateSoilRecommendations(testData: any): any[] {
  const recommendations = [];
  
  const pH = parseFloat(testData.pH);
  const p = parseFloat(testData.phosphorus);
  const n = parseFloat(testData.nitrogen);
  
  if (p < 30) {
    recommendations.push({
      title: "Add Phosphorus",
      description: "Apply bone meal or rock phosphate to increase phosphorus levels",
      priority: "high"
    });
  }
  
  if (pH >= 6.0 && pH <= 7.0) {
    recommendations.push({
      title: "Maintain pH",
      description: "Current pH is optimal, continue regular monitoring",
      priority: "medium"
    });
  } else {
    recommendations.push({
      title: "Adjust pH",
      description: pH < 6.0 ? "Add lime to increase pH" : "Add sulfur to decrease pH",
      priority: "high"
    });
  }
  
  if (n < 40) {
    recommendations.push({
      title: "Increase Nitrogen",
      description: "Add nitrogen-rich fertilizer or compost",
      priority: "high"
    });
  }
  
  return recommendations;
}

// ============= ADMIN ROUTES =============

// Admin middleware - check if user is admin
async function verifyAdmin(authHeader: string | null) {
  const user = await verifyAuth(authHeader);
  if (!user) return null;

  // Check if admin (hardcoded admin email or role metadata)
  const isAdmin = user.email === 'admin@agrotech.com' || user.user_metadata?.role === 'admin';
  if (!isAdmin) return null;

  return user;
}

app.get("/make-server-2598bc7a/admin/users", async (c) => {
  try {
    const admin = await verifyAdmin(c.req.header("Authorization"));
    if (!admin) return c.json({ error: "Admin access required" }, 403);

    // Fetch all users from Supabase Auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Failed to fetch users:", error);
      return c.json({ error: "Failed to fetch users" }, 500);
    }

    // Transform users to match frontend interface
    const transformedUsers = await Promise.all(users.map(async (user: any) => {
      // Get user's order history
      const orders = await kv.getByPrefix(`order:${user.id}:`);
      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;

      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.fullName || user.email?.split('@')[0] || 'Unknown',
        phone: user.user_metadata?.phone || '',
        status: user.banned_until ? 'suspended' : 'active',
        joinedDate: new Date(user.created_at),
        totalOrders,
        totalSpent: Math.round(totalSpent)
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

    // Fetch all orders from all users
    const allOrders = await kv.getByPrefix("order:");

    return c.json({ orders: allOrders || [] });
  } catch (error) {
    console.error("Admin get orders error:", error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

app.get("/make-server-2598bc7a/admin/activities", async (c) => {
  try {
    const admin = await verifyAdmin(c.req.header("Authorization"));
    if (!admin) return c.json({ error: "Admin access required" }, 403);

    // Fetch recent user activities
    const activities = await kv.getByPrefix("activity:");

    // Sort by timestamp (most recent first)
    const sorted = (activities || []).sort((a: any, b: any) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return c.json({ activities: sorted.slice(0, 50) }); // Return last 50 activities
  } catch (error) {
    console.error("Admin get activities error:", error);
    return c.json({ error: "Failed to fetch activities" }, 500);
  }
});

app.post("/make-server-2598bc7a/admin/users/:userId/suspend", async (c) => {
  try {
    const admin = await verifyAdmin(c.req.header("Authorization"));
    if (!admin) return c.json({ error: "Admin access required" }, 403);

    const userId = c.req.param("userId");

    // Ban user for 100 years (effectively permanent until manually lifted)
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      banned_until: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
    });

    if (error) {
      console.error("Failed to suspend user:", error);
      return c.json({ error: "Failed to suspend user" }, 500);
    }

    // Log activity
    const activityId = crypto.randomUUID();
    await kv.set(`activity:${activityId}`, {
      id: activityId,
      userId: admin.id,
      userName: 'Admin',
      email: admin.email,
      activity: `Suspended user ${userId}`,
      timestamp: new Date(),
      type: 'admin'
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Suspend user error:", error);
    return c.json({ error: "Failed to suspend user" }, 500);
  }
});

app.post("/make-server-2598bc7a/admin/users/:userId/activate", async (c) => {
  try {
    const admin = await verifyAdmin(c.req.header("Authorization"));
    if (!admin) return c.json({ error: "Admin access required" }, 403);

    const userId = c.req.param("userId");

    // Remove ban
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      banned_until: 'none'
    });

    if (error) {
      console.error("Failed to activate user:", error);
      return c.json({ error: "Failed to activate user" }, 500);
    }

    // Log activity
    const activityId = crypto.randomUUID();
    await kv.set(`activity:${activityId}`, {
      id: activityId,
      userId: admin.id,
      userName: 'Admin',
      email: admin.email,
      activity: `Activated user ${userId}`,
      timestamp: new Date(),
      type: 'admin'
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Activate user error:", error);
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
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`order:${orderId}`, updatedOrder);

    // Log activity
    const activityId = crypto.randomUUID();
    await kv.set(`activity:${activityId}`, {
      id: activityId,
      userId: admin.id,
      userName: 'Admin',
      email: admin.email,
      activity: `Updated order ${orderId} to ${status}`,
      timestamp: new Date(),
      type: 'admin'
    });

    return c.json({ order: updatedOrder });
  } catch (error) {
    console.error("Update order error:", error);
    return c.json({ error: "Failed to update order" }, 500);
  }
});

// ============= CROP DETECTION WITH VALIDATION =============

app.post("/make-server-2598bc7a/crops/detect", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const { image } = await c.req.json();

    const PLANT_ID_API_KEY = Deno.env.get("PLANT_ID_API_KEY");

    if (!PLANT_ID_API_KEY) {
      return c.json({ error: "Plant.id API key not configured" }, 500);
    }

    // Use Plant.id identification endpoint to detect crop type
    const response = await fetch("https://api.plant.id/v2/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": PLANT_ID_API_KEY,
      },
      body: JSON.stringify({
        images: [image],
        modifiers: ["crops_fast", "similar_images"],
        plant_details: ["common_names", "edible_parts", "watering"],
      }),
    });

    const result = await response.json();

    // Check if it's actually a plant
    const isPlant = result.is_plant?.binary || false;
    const probability = result.is_plant?.probability || 0;

    if (!isPlant || probability < 0.5) {
      return c.json({
        error: "Not a plant detected",
        isPlant: false,
        message: "Please upload a clear image of a crop or plant"
      }, 400);
    }

    const topSuggestion = result.suggestions?.[0];

    const cropInfo = {
      cropType: topSuggestion?.plant_name || "Unknown Crop",
      variety: topSuggestion?.plant_details?.common_names?.[0] || "",
      confidence: Math.round((topSuggestion?.probability || 0) * 100),
      plantedDaysAgo: 10,
      harvestDays: 60,
      health: "good",
      tasks: [
        "Water regularly",
        "Check for pests",
        "Monitor growth"
      ],
      isPlant: true
    };

    return c.json({ cropInfo });
  } catch (error) {
    console.error("Crop detection error:", error);
    return c.json({ error: "Failed to detect crop" }, 500);
  }
});

app.post("/make-server-2598bc7a/diagnose/validate", async (c) => {
  try {
    const user = await verifyAuth(c.req.header("Authorization"));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const { image } = await c.req.json();

    const PLANT_ID_API_KEY = Deno.env.get("PLANT_ID_API_KEY");

    if (!PLANT_ID_API_KEY) {
      return c.json({ isPlant: true, confidence: 0 }); // Allow through if API not configured
    }

    // Use Plant.id to check if image contains a plant
    const response = await fetch("https://api.plant.id/v2/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": PLANT_ID_API_KEY,
      },
      body: JSON.stringify({
        images: [image],
        modifiers: ["crops_fast"],
      }),
    });

    const result = await response.json();

    const isPlant = result.is_plant?.binary || false;
    const probability = result.is_plant?.probability || 0;

    return c.json({
      isPlant,
      confidence: Math.round(probability * 100)
    });
  } catch (error) {
    console.error("Plant validation error:", error);
    return c.json({ isPlant: true, confidence: 0 }); // Allow through on error
  }
});

// Health check
app.get("/make-server-2598bc7a/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
