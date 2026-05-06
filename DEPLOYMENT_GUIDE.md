# AgroTech Backend Deployment Guide

## 🚀 Deploy to Supabase

Your backend Edge Functions need to be deployed to Supabase for the app to work with real data. Follow these steps:

### Prerequisites
- Supabase account (sign up at https://supabase.com)
- Your project is already connected to Supabase

### Method 1: Deploy via Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**
   - Open https://supabase.com/dashboard
   - Select your project

2. **Navigate to Edge Functions**
   - Click on "Edge Functions" in the left sidebar

3. **Create New Function**
   - Click "Create a new function"
   - Name it: `make-server-2598bc7a`

4. **Copy the Code**
   - Open `/supabase/functions/server/index.tsx`
   - Copy ALL the code from this file

5. **Paste & Deploy**
   - Paste the code into the function editor
   - Click "Deploy function"

6. **Verify Deployment**
   - Check the function URL (should be similar to):
     ```
     https://[your-project-id].supabase.co/functions/v1/make-server-2598bc7a
     ```
   - Test the health endpoint:
     ```
     https://[your-project-id].supabase.co/functions/v1/make-server-2598bc7a/health
     ```

### Method 2: Deploy via Supabase CLI (Advanced)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link Your Project**
   ```bash
   supabase link --project-ref [your-project-id]
   ```

4. **Deploy the Function**
   ```bash
   supabase functions deploy make-server-2598bc7a
   ```

### After Deployment

1. **Test Admin Dashboard**
   - Login with admin credentials:
     - Email: `admin@agrotech.com`
     - Password: `admin123`
   - Navigate to Admin Dashboard
   - Should show "Admin dashboard loaded successfully" instead of "deploy backend"

2. **Test Regular Features**
   - Add a crop
   - Run plant diagnosis
   - Create a marketplace listing
   - All should now save to the database

### Environment Variables (Already Configured)

These are automatically available in your Supabase Edge Function:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `PLANT_ID_API_KEY` (for crop detection & disease diagnosis)
- ✅ `OPENWEATHER_API_KEY` (for weather data)

### Troubleshooting

**Issue: Still showing "Backend not connected"**
- Solution: Refresh the page after deployment
- Clear browser cache and reload

**Issue: HTTP 401 Unauthorized**
- Solution: Make sure you're logged in
- For admin features, use admin credentials
- Try logging out and logging back in

**Issue: Function not responding**
- Check function logs in Supabase Dashboard
- Verify the function is deployed and active
- Check that the function name matches exactly: `make-server-2598bc7a`

### Database Setup (Automatic)

The KV store table is automatically created. No manual database setup required!

### Need Help?

- Check Supabase documentation: https://supabase.com/docs/guides/functions
- View function logs in Supabase Dashboard → Edge Functions → Select your function → Logs

---

## 📊 Features After Deployment

Once deployed, you'll have:
- ✅ Real-time crop management
- ✅ AI-powered plant disease detection
- ✅ Soil health monitoring with persistent reports
- ✅ Live marketplace with actual listings
- ✅ Admin dashboard with real user analytics
- ✅ Weather data from your actual location
- ✅ Order history and tracking
