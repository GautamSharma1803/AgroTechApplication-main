# 🚀 Deployment Guide - AgroTech

## Prerequisites
- GitHub account
- Vercel/Netlify account (for frontend)
- Supabase project (backend is already configured)

## Quick Deploy

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
   - Click "Deploy"

3. **Done!** ✅
   - Your app will be live at `https://your-app.vercel.app`
   - Auto-deploys on every push to main branch

### Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Configure:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click "Deploy site"

3. **Done!** ✅
   - Your app will be live at `https://your-app.netlify.app`

## Enable Optional Features

### 1. Plant Disease Detection API

To enable real AI-powered plant disease detection:

1. **Get API Key**
   - Go to [plant.id](https://web.plant.id/)
   - Sign up for an account
   - Get your API key from the dashboard

2. **Add to Supabase**
   - Go to your Supabase project dashboard
   - Navigate to: **Project Settings** → **Edge Functions** → **Environment Variables**
   - Add variable:
     - **Name**: `PLANT_ID_API_KEY`
     - **Value**: Your Plant.id API key
   - Click "Save"

3. **Redeploy Edge Functions**
   - The change will take effect immediately
   - Test by uploading a plant image in the app

### 2. Weather API

To enable real weather data:

1. **Get API Key**
   - Go to [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for free account
   - Copy your API key

2. **Add to Supabase**
   - Go to Supabase dashboard → **Edge Functions** → **Environment Variables**
   - Add variable:
     - **Name**: `OPENWEATHER_API_KEY`
     - **Value**: Your OpenWeather API key
   - Click "Save"

3. **Test**
   - Refresh the home page
   - Weather data should now show real information

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL is automatic ✅

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS
4. SSL is automatic ✅

## PWA Installation

After deployment, users can install the app:

### On Mobile (iOS/Android)
1. Open the app in browser
2. Tap "Add to Home Screen"
3. Confirm installation
4. App icon appears on home screen

### On Desktop
1. Open the app in Chrome/Edge
2. Click install icon in address bar
3. Confirm installation
4. App opens in its own window

## Environment Variables Summary

| Variable | Required | Purpose | Get From |
|----------|----------|---------|----------|
| `SUPABASE_URL` | ✅ Yes | Backend URL | Auto-configured |
| `SUPABASE_ANON_KEY` | ✅ Yes | Public API key | Auto-configured |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes | Admin key | Auto-configured |
| `PLANT_ID_API_KEY` | ❌ No | Plant disease detection | https://web.plant.id/ |
| `OPENWEATHER_API_KEY` | ❌ No | Weather data | https://openweathermap.org/api |

## Post-Deployment Checklist

- [ ] App is accessible at public URL
- [ ] Users can sign up and login
- [ ] PWA can be installed on mobile
- [ ] Service worker is registered
- [ ] Images load correctly
- [ ] All navigation works
- [ ] Forms submit successfully
- [ ] (Optional) Plant diagnosis works
- [ ] (Optional) Weather shows real data

## Monitoring

### Vercel
- Analytics: Built-in (free tier includes basic analytics)
- Logs: Available in deployment logs
- Performance: Web Vitals automatically tracked

### Netlify  
- Analytics: Available in higher tiers
- Logs: Function logs available
- Performance: Built-in performance metrics

### Supabase
- Database: Monitor in Supabase dashboard
- Edge Functions: View logs in Functions section
- Storage: Check usage in Storage section

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Images Don't Load
- Check if images are in `/public` folder
- Verify Unsplash URLs are accessible
- Check browser console for errors

### API Errors
- Verify Supabase environment variables
- Check Edge Function logs in Supabase
- Ensure user is authenticated

### PWA Not Installing
- Verify `manifest.json` is in `/public`
- Check service worker is registered
- Ensure site is served over HTTPS

## Performance Optimization

### Already Included
- ✅ Code splitting with React Router
- ✅ Lazy loading of routes
- ✅ Optimized images
- ✅ Service Worker caching
- ✅ Minified production build

### Optional Enhancements
- Enable Vercel/Netlify Edge Functions for caching
- Add CDN for images
- Enable compression
- Add performance monitoring

## Security Checklist

- ✅ HTTPS only
- ✅ Service role key server-side only
- ✅ Input validation
- ✅ Authentication required for sensitive routes
- ✅ Secure image uploads
- ✅ CORS properly configured

## Scaling

The current architecture scales automatically:
- **Frontend**: Vercel/Netlify scales automatically
- **Backend**: Supabase handles millions of requests
- **Storage**: Supabase storage scales with usage
- **Database**: PostgreSQL with automatic backups

## Cost Estimate

### Free Tier (Perfect for Testing)
- Vercel: Free (hobby)
- Netlify: Free (starter)
- Supabase: Free (includes 500MB database, 1GB storage)
- Total: **$0/month**

### Production (With APIs)
- Vercel Pro: $20/month (optional)
- Supabase Pro: $25/month
- Plant.id: $30/month (500 identifications)
- OpenWeather: Free (1000 calls/day)
- Total: **~$75/month** or **$0 with free tiers**

## Support

If you encounter issues:
1. Check browser console for errors
2. Review Supabase Edge Function logs
3. Verify all environment variables are set
4. Test API endpoints manually
5. Check network tab for failed requests

## Next Steps

After successful deployment:
1. ✅ Test all features
2. ✅ Install as PWA on your phone
3. ✅ Share with test users
4. ✅ Collect feedback
5. ✅ Monitor usage and errors
6. ✅ Add custom domain
7. ✅ Enable API integrations
8. ✅ Set up monitoring

---

**Congratulations! Your agricultural app is now live! ** 🎉🌱
