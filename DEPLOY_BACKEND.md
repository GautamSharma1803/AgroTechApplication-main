# 🔧 Deploy Backend to Supabase - Step by Step

## The Problem:
Your frontend is trying to reach:
https://cyzfefgxdxjelhjytkfz.supabase.co/functions/v1/make-server-2598bc7a

But this Edge Function doesn't exist yet on Supabase!

## The Solution: Deploy the Edge Function

### METHOD 1: Using Supabase CLI (Recommended)

#### Step 1: Install Supabase CLI

**On Mac:**
```bash
brew install supabase/tap/supabase
```

**On Windows:**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**On Linux:**
```bash
brew install supabase/tap/supabase
```

**Alternative (Any OS):**
```bash
npm install -g supabase
```

#### Step 2: Login to Supabase

```bash
supabase login
```

- This will open a browser window
- Login with your Supabase account
- Copy the access token and paste it back in terminal

#### Step 3: Link Your Project

```bash
cd /workspaces/default/code
supabase link --project-ref cyzfefgxdxjelhjytkfz
```

When prompted for the database password, find it in Supabase Dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → Database → Connection String
4. Copy the password

#### Step 4: Deploy Edge Function

```bash
supabase functions deploy make-server-2598bc7a --no-verify-jwt
```

Wait for deployment to complete (30-60 seconds).

#### Step 5: Verify Deployment

```bash
# Test the health endpoint
curl https://cyzfefgxdxjelhjytkfz.supabase.co/functions/v1/make-server-2598bc7a/health
```

You should see: `{"status":"ok","timestamp":"..."}`

---

### METHOD 2: Manual Deployment via Dashboard

If CLI doesn't work, use the Supabase Dashboard:

#### Step 1: Prepare the Function File

The server code is already in: `/workspaces/default/code/supabase/functions/server/index.tsx`

#### Step 2: Go to Supabase Dashboard

1. Visit: https://supabase.com/dashboard
2. Select your project: `cyzfefgxdxjelhjytkfz`
3. Click "Edge Functions" in the left menu

#### Step 3: Create New Function

1. Click "Create a new function"
2. Name: `make-server-2598bc7a`
3. Copy and paste the ENTIRE content from:
   `/workspaces/default/code/supabase/functions/server/index.tsx`

#### Step 4: Deploy

1. Click "Deploy Function"
2. Wait for deployment to complete

---

### METHOD 3: Quick Test (Temporary)

If you just want to test the app quickly without deploying:

Create a mock server response by modifying the frontend to use mock data only.

But this is NOT recommended - you should deploy the real backend!

---

## After Deployment: Set Environment Variables

### Step 1: Add SUPABASE_ANON_KEY

1. Go to Supabase Dashboard
2. Edge Functions → Environment Variables
3. Add variable:
   - Name: `SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5emZlZmd4ZHhqZWxoanl0a2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5Mzk0NzEsImV4cCI6MjA5MDUxNTQ3MX0.kHhctJweJPwv3LEb0YxvffbsxeRWDx8nb5k4McKyWdo`

### Step 2: Add Service Role Key

1. Go to Settings → API
2. Copy "service_role" key (NOT anon key)
3. Edge Functions → Environment Variables
4. Add variable:
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: (paste service_role key)

### Step 3: Add Supabase URL

1. Edge Functions → Environment Variables
2. Add variable:
   - Name: `SUPABASE_URL`
   - Value: `https://cyzfefgxdxjelhjytkfz.supabase.co`

### Step 4: (Optional) Add API Keys

Add these if you have them:
- `PLANT_ID_API_KEY`
- `OPENWEATHER_API_KEY`

### Step 5: Redeploy Function

After adding environment variables:
1. Go to Edge Functions
2. Find `make-server-2598bc7a`
3. Click menu (•••) → Redeploy

---

## Verify Everything Works

### Test 1: Health Check

```bash
curl https://cyzfefgxdxjelhjytkfz.supabase.co/functions/v1/make-server-2598bc7a/health
```

Expected: `{"status":"ok",...}`

### Test 2: Sign Up in Browser

1. Open your app
2. Go to Sign Up page
3. Fill in the form
4. Click "Sign Up"
5. Should work now! ✅

---

## Still Getting Errors?

### Check Edge Function Logs

1. Supabase Dashboard → Edge Functions
2. Click `make-server-2598bc7a`
3. Click "Logs" tab
4. Try signing up again
5. Watch for error messages in real-time

### Common Issues:

**Error: "SUPABASE_URL is not defined"**
- Solution: Add environment variables (see above)

**Error: "CORS policy"**
- Solution: Already fixed in the server code

**Error: "Function not found"**
- Solution: Function name must be exactly `make-server-2598bc7a`

**Error: "Invalid JWT"**
- Solution: Deploy with `--no-verify-jwt` flag

---

## Quick Reference

| What | Value |
|------|-------|
| Project ID | `cyzfefgxdxjelhjytkfz` |
| Function Name | `make-server-2598bc7a` |
| API Base URL | `https://cyzfefgxdxjelhjytkfz.supabase.co/functions/v1/make-server-2598bc7a` |
| Health Check | `{BASE_URL}/health` |

