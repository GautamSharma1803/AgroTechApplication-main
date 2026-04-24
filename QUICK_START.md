# ⚡ Quick Start - Get Running in 5 Minutes

## 🎯 Absolute Fastest Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173
# That's it! App is running! 🎉
```

## 🧪 Test the App

1. **Navigate through onboarding** screens (or skip)
2. **Create an account**:
   - Email: test@example.com
   - Password: password123
   - Name: Test User
3. **Explore the app**:
   - Home dashboard
   - Upload a plant photo for diagnosis
   - Enter soil test data
   - Browse the marketplace
   - View crops

## 🌐 Deploy in 10 Minutes

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main

# 2. Go to vercel.com
# 3. Click "New Project"
# 4. Import your GitHub repo
# 5. Click "Deploy"

# Done! Your app is live! 🚀
```

## 🔑 Add API Keys (Optional)

### For Real Plant Disease Detection:

1. Get API key: https://web.plant.id/
2. Add to Supabase:
   - Dashboard → Edge Functions → Environment Variables
   - Name: `PLANT_ID_API_KEY`
   - Value: your-api-key

### For Real Weather Data:

1. Get API key: https://openweathermap.org/api
2. Add to Supabase:
   - Dashboard → Edge Functions → Environment Variables
   - Name: `OPENWEATHER_API_KEY`
   - Value: your-api-key

## ✅ What Works Out of the Box

- ✅ User registration & login
- ✅ All 11 screens
- ✅ Image uploads
- ✅ Soil health tracking
- ✅ Crop management
- ✅ Marketplace
- ✅ Mock disease detection
- ✅ Mock weather data
- ✅ PWA installation

## 🎨 Customize Your App

### Change Colors:
Edit `/src/styles/theme.css`:
```css
:root {
  --color-primary: #16a34a; /* Change to your brand color */
}
```

### Change App Name:
Edit `/public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "YourApp"
}
```

### Add Logo:
Replace `/public/leaf-icon.svg` with your logo

## 📱 Test as Mobile App

### On Phone:
1. Open deployed URL in mobile browser
2. Tap "Add to Home Screen"
3. App installs like native app!

### On Desktop:
1. Open in Chrome/Edge
2. Click install icon in address bar
3. App opens in its own window!

## 🐛 Troubleshooting

### Port Already in Use?
```bash
npm run dev -- --port 3000
```

### Dependencies Won't Install?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Fails?
```bash
npm run build
# Check console for specific errors
```

## 📚 Learn More

- **Full Documentation**: See README.md
- **Deployment Guide**: See DEPLOYMENT.md
- **User Guide**: See USER_GUIDE.md
- **Implementation Details**: See IMPLEMENTATION_SUMMARY.md

## 🎯 Common Tasks

### Create Production Build:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run build
npx serve dist
```

### Check for Updates:
```bash
npm outdated
npm update
```

## 💡 Pro Tips

1. **Development**: Keep console open to see errors
2. **Testing**: Try on different browsers
3. **Mobile**: Test on real device
4. **PWA**: Test offline mode
5. **API Keys**: Not needed for basic testing

## 🚀 Your Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Start dev server (`npm run dev`)
- [ ] Create test account
- [ ] Navigate all screens
- [ ] Upload test images
- [ ] Enter soil data
- [ ] Browse marketplace
- [ ] Install as PWA
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Test deployed version
- [ ] Share with users!

## 🎉 You're Ready!

The app is complete and ready to use. Everything works out of the box with mock data. Add API keys when you're ready for real integrations.

**Need help?** Check the documentation files or console logs.

---

**Happy coding! 🌱 Happy farming! 🚜**
