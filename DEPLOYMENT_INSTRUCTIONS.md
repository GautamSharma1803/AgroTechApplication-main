# Backend Deployment Instructions

## Current Status
✅ **Frontend**: Successfully deployed to Vercel  
❌ **Backend**: Edge Function NOT yet deployed to Supabase

## Why You're Seeing Errors

The errors you're experiencing ("Failed to load crops", "Failed to load products", "Add new crops button not working") are happening because the **backend Edge Function hasn't been deployed to Supabase yet**. The frontend is trying to make API calls to:

```
https://{projectId}.supabase.co/functions/v1/make-server-2598bc7a/*
```

But since the Edge Function isn't deployed, these calls are failing with "failed to fetch" errors.

## Temporary Workaround (Already Implemented)

I've updated the app to use **fallback mock data** when the backend is unavailable. This means:
- ✅ You can still browse crops and products (using sample data)
- ✅ Better error messages explaining the backend needs deployment
- ✅ Add Crop button now works (opens a modal)
- ⚠️ Data won't persist until backend is deployed

## How to Deploy the Backend

### Step 1: Access Your Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** in the left sidebar

### Step 2: Create the Edge Function
1. Click **"Deploy a new function"**
2. Function name: `make-server-2598bc7a`
3. Copy the **entire contents** from `/supabase/functions/server/index.tsx`
4. Paste into the function editor
5. Click **Deploy**

### Step 3: Verify Environment Variables
Make sure these secrets are set in your Supabase project:
- `SUPABASE_URL` ✅ (already provided)
- `SUPABASE_ANON_KEY` ✅ (already provided)
- `SUPABASE_SERVICE_ROLE_KEY` ✅ (already provided)
- `PLANT_ID_API_KEY` ✅ (already provided)
- `OPENWEATHER_API_KEY` ✅ (already provided)

### Step 4: Test the Deployment
After deployment, test by:
1. Sign up or log in to your app
2. Try adding a new crop
3. Navigate to the marketplace
4. The data should now persist!

## Alternative: Deploy via Supabase CLI

If you prefer using the CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref {your-project-ref}

# Deploy the function
supabase functions deploy make-server-2598bc7a --no-verify-jwt
```

## Current Features (Working with Mock Data)

While the backend is being deployed, the app currently supports:
- ✅ Browse crops (3 sample crops shown)
- ✅ Filter crops by health status
- ✅ Add crop modal (UI only, won't persist)
- ✅ View marketplace products (4 sample products)
- ✅ Search products
- ✅ All other screens and navigation

## After Backend Deployment

Once the backend is deployed, you'll have access to:
- ✅ Real user authentication
- ✅ Persistent crop management
- ✅ AI-powered plant disease detection (Plant.id API)
- ✅ Real-time weather data (OpenWeather API)
- ✅ Marketplace functionality
- ✅ Soil health tracking
- ✅ Image uploads to Supabase Storage

## Need Help?

If you encounter issues during deployment:
1. Check the Supabase Edge Function logs for errors
2. Verify all environment variables are set
3. Ensure the function is deployed with the correct name: `make-server-2598bc7a`
4. Check that CORS is enabled (already configured in the code)

## Files Updated

I've fixed the following issues:
1. ✅ Added onClick handler to "Add New Crop" button
2. ✅ Created a proper modal for adding crops
3. ✅ Improved error messages to explain backend deployment needed
4. ✅ Added fallback mock data for crops and products
5. ✅ Better user experience while backend is being set up
