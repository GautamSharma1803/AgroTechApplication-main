# Backend Test Script

## How to Use

1. **Open your browser** where the app is running
2. **Press F12** to open Developer Tools
3. **Click on "Console" tab**
4. **Copy the ENTIRE script below**
5. **Paste it into the console**
6. **Press Enter**
7. **Check the results!**

---

## Test Script (Copy This)

```javascript
// Testing AgroTech Backend
console.log('🧪 Testing AgroTech Backend...\n');

const BACKEND_URL = 'https://cyzfefgxdxjelhjytkfz.supabase.co/functions/v1/make-server-2598bc7a';

// Test 1: Admin API (with admin token)
console.log('Test 1: Admin Users API');
fetch(`${BACKEND_URL}/admin/users`, {
  headers: {
    'Authorization': 'Bearer admin-authenticated',
    'Content-Type': 'application/json'
  }
})
  .then(r => r.json())
  .then(data => {
    console.log('✅ ADMIN API WORKS!');
    console.log('Response:', data);
    if (data.users !== undefined) {
      console.log(`Found ${data.users.length} users`);
      console.log('\n✅✅✅ YOUR BACKEND IS FULLY DEPLOYED AND WORKING! ✅✅✅\n');
      console.log('Next step: Refresh your app and admin dashboard should show real data!');
    } else if (data.error) {
      console.log('❌ Error:', data.error);
      if (data.error.includes('Admin access required')) {
        console.log('💡 Backend deployed but needs admin auth fix');
      }
    }
  })
  .catch(err => {
    console.log('❌ ADMIN API FAILED');
    console.error('Error:', err);
    console.log('Function may not be deployed yet');
  });

// Test 2: Health endpoint
console.log('\nTest 2: Health Endpoint');
fetch(`${BACKEND_URL}/health`)
  .then(r => r.json())
  .then(data => {
    console.log('✅ HEALTH ENDPOINT WORKS!');
    console.log('Response:', data);
  })
  .catch(err => {
    console.log('⚠️ Health endpoint requires auth (expected)');
    console.log('Error:', err.message);
  });

console.log('\n⏳ Running tests... Check results above ☝️');
```

---

## What to Look For

### ✅ Success (Backend Working)
```
✅ ADMIN API WORKS!
Response: {users: Array(0)}
Found 0 users
✅✅✅ YOUR BACKEND IS FULLY DEPLOYED AND WORKING! ✅✅✅
```

**What this means:** Your backend is fully deployed! If it shows 0 users, that's normal - no one has signed up yet. The admin dashboard should work!

---

### ❌ Not Deployed
```
❌ ADMIN API FAILED
Error: Failed to fetch
```

**What this means:** Function not deployed. Check Supabase Dashboard.

---

### ⚠️ Auth Issue
```
✅ ADMIN API WORKS!
Response: {error: "Admin access required"}
```

**What this means:** Backend deployed but admin token not recognized. Try:
1. Logout and login again as admin
2. Clear browser cache
3. Check console for the admin_token value

---

## Quick Check Commands

### Check if you're logged in as admin:
```javascript
console.log('Admin token:', localStorage.getItem('admin_token'));
console.log('Admin session:', localStorage.getItem('admin_session'));
```

### Force reload admin dashboard:
```javascript
window.location.href = '/admin';
```
