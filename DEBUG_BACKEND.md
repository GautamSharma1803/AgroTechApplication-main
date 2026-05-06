# Backend Connection Debug Guide

## Your Backend URL

Your Edge Function should be deployed at:
```
https://cyzfefgxdxjelhjytkfz.supabase.co/functions/v1/make-server-2598bc7a
```

## Quick Test Steps

### 1. Test if Function Exists

Open this URL in your browser:
```
https://cyzfefgxdxjelhjytkfz.supabase.co/functions/v1/make-server-2598bc7a/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2026-05-06T..."}
```

**If you see this:** ✅ Function is deployed correctly!
**If you see 404:** ❌ Function not deployed or wrong name

---

### 2. Verify Function Name

Go to Supabase Dashboard → Edge Functions

**IMPORTANT:** The function name MUST be exactly:
```
make-server-2598bc7a
```

Not:
- ❌ `server`
- ❌ `make-server`
- ❌ `agrotech-server`

---

### 3. Check Function Code

In Supabase Dashboard → Edge Functions → Select your function → Code

**Verify you have these routes:**
- `/make-server-2598bc7a/health`
- `/make-server-2598bc7a/auth/signup`
- `/make-server-2598bc7a/auth/signin`
- `/make-server-2598bc7a/admin/users`
- `/make-server-2598bc7a/admin/orders`
- `/make-server-2598bc7a/crops`
- `/make-server-2598bc7a/market/products`

**Make sure the last line is:**
```javascript
Deno.serve(app.fetch);
```

---

### 4. Deploy Dependencies

In Supabase Dashboard → Edge Functions → Your function → Dependencies tab

Add import map if needed:
```json
{
  "imports": {
    "hono": "https://deno.land/x/hono@v3.11.7/mod.ts",
    "@supabase/supabase-js": "https://esm.sh/@supabase/supabase-js@2"
  }
}
```

---

### 5. Check Function Logs

In Supabase Dashboard → Edge Functions → Select function → Logs

Look for errors when you try to access admin dashboard.

**Common errors:**
- "Module not found" → Dependencies not installed
- "Unauthorized" → Auth issue
- No logs at all → Function not receiving requests

---

### 6. Force Redeploy

Sometimes you need to redeploy:

1. Go to Edge Functions
2. Select your function
3. Make a small change (add a comment)
4. Click "Deploy"
5. Wait for deployment to complete
6. Test the health endpoint again

---

### 7. Alternative: Use Supabase CLI

If dashboard deployment doesn't work:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref cyzfefgxdxjelhjytkfz

# Deploy function
cd /workspaces/default/code
supabase functions deploy make-server-2598bc7a --no-verify-jwt

# Test
curl https://cyzfefgxdxjelhjytkfz.supabase.co/functions/v1/make-server-2598bc7a/health
```

---

## Still Not Working?

### Check if kv_store.tsx is uploaded

The function needs `/supabase/functions/server/kv_store.tsx`

In Supabase Dashboard:
1. Create folder structure: `server/`
2. Upload both files:
   - `server/index.tsx` (main function code)
   - `server/kv_store.tsx` (database helper)

### Alternative: Combine Files

If you can't upload multiple files, combine them:

1. Copy ALL content from `kv_store.tsx`
2. Paste it at the TOP of `index.tsx` (before `const app = new Hono()`)
3. Remove the line `import * as kv from "./kv_store.tsx";`
4. Redeploy

---

## Quick Browser Test

Open browser console (F12) and run:

```javascript
// Test health endpoint
fetch('https://cyzfefgxdxjelhjytkfz.supabase.co/functions/v1/make-server-2598bc7a/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// Test admin endpoint (with admin token)
fetch('https://cyzfefgxdxjelhjytkfz.supabase.co/functions/v1/make-server-2598bc7a/admin/users', {
  headers: {
    'Authorization': 'Bearer admin-authenticated'
  }
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

If first test works but second fails → Function deployed, but admin routes have issues
If both fail → Function not deployed or wrong URL

---

## Contact Support

If still not working, share:
1. Screenshot of Supabase Edge Functions page
2. Function logs from Supabase Dashboard
3. Browser console errors (F12 → Console tab)
