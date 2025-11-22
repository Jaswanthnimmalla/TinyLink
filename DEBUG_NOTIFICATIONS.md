# 🔍 DEBUG NOTIFICATIONS - Step by Step

## Issue: Link created but notifications not appearing

Let's debug this step by step:

---

## **STEP 1: Test if Notifications API Works**

Open your browser console (F12) and run:

```javascript
// Test 1: Check if API endpoint exists
fetch('/api/notifications?since=' + new Date(Date.now() - 300000).toISOString())
  .then(r => r.json())
  .then(data => {
    console.log('✅ Notifications API Response:', data);
    console.log('Count:', data.count);
    console.log('Notifications:', data.notifications);
  })
  .catch(err => {
    console.error('❌ API Error:', err);
  });
```

**Expected Result:**

```javascript
{
  notifications: [...],
  count: 0 or more,
  since: "2025-11-22T..."
}
```

---

## **STEP 2: Verify Clicks Are Being Recorded**

```javascript
// Test 2: Check if clicks exist in database
fetch('/api/links')
  .then(r => r.json())
  .then(links => {
    console.log('📊 All Links:', links);
    links.forEach(link => {
      console.log(`Link: /${link.code} - Clicks: ${link.clicks || 0}`);
    });
  });
```

**Expected:** You should see your test links with click counts.

---

## **STEP 3: Test Click Recording**

```javascript
// Test 3: Create a link and click it
async function testClickRecording() {
  console.log('1️⃣ Creating link...');
  
  // Create link
  const createResponse = await fetch('/api/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://google.com',
      customCode: 'debug' + Date.now()
    })
  });
  
  const link = await createResponse.json();
  console.log('✅ Link created:', link);
  
  console.log('2️⃣ Clicking link...');
  window.open('/' + link.code, '_blank');
  
  console.log('3️⃣ Waiting 2 seconds...');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('4️⃣ Checking if click was recorded...');
  const analyticsResponse = await fetch('/api/analytics/' + link.code);
  const analytics = await analyticsResponse.json();
  
  console.log('📊 Analytics:', analytics);
  console.log('Total Clicks:', analytics.link?.totalClicks || 0);
  
  if (analytics.link?.totalClicks > 0) {
    console.log('✅ Click recorded successfully!');
  } else {
    console.log('❌ Click NOT recorded!');
  }
}

testClickRecording();
```

---

## **STEP 4: Check Console for Polling**

After the page loads, look in console for:

```
🔔 New notifications: X
```

This message appears when the polling detects new clicks.

If you DON'T see this message every 10 seconds, the polling might not be running.

---

## **STEP 5: Manual Notification Trigger Test**

Test if the NotificationContext is working:

```javascript
// Get the notification context manually
// This should work if context is set up correctly

console.log('Testing notification context...');

// Check if bell icon exists
const bellIcon = document.querySelector('[data-testid="notification-bell"]') || 
                 document.querySelector('button[aria-label*="notification"]') ||
                 document.querySelector('svg.lucide-bell')?.closest('button');

if (bellIcon) {
  console.log('✅ Bell icon found');
} else {
  console.log('❌ Bell icon NOT found');
}
```

---

## **STEP 6: Check Network Tab**

1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by "notifications"
4. You should see requests to `/api/notifications?since=...` every 10 seconds

**If you DON'T see requests:**

- Context polling is not running
- Component might not be mounted

**If you see requests with errors:**

- API endpoint has issues

---

## **STEP 7: Force Notification Test**

Manually trigger a notification to test the UI:

```javascript
// This won't work directly, but we can test by clicking a link
// and then immediately checking the notifications API

async function forceNotificationTest() {
  console.log('🧪 Force Notification Test');
  
  // Create and click link
  const link = await fetch('/api/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://google.com',
      customCode: 'force' + Date.now()
    })
  }).then(r => r.json());
  
  console.log('Link created:', link.code);
  
  // Click it
  window.open('/' + link.code, '_blank');
  
  // Wait for click to be recorded
  await new Promise(r => setTimeout(r, 3000));
  
  // Check notifications API
  const notifs = await fetch('/api/notifications?since=' + new Date(Date.now() - 60000).toISOString())
    .then(r => r.json());
  
  console.log('📊 Notifications from API:', notifs);
  
  if (notifs.count > 0) {
    console.log('✅ Notification exists in API!');
    console.log('🔔 Should appear in UI within 10 seconds...');
  } else {
    console.log('❌ No notifications in API - click might not be recorded');
  }
}

forceNotificationTest();
```

---

## **COMMON ISSUES & FIXES:**

### **Issue 1: Clicks Not Being Recorded**

**Symptom:** `/api/notifications` returns empty array  
**Cause:** Click tracking not working

**Fix:** Check if database migration was run:

```javascript
fetch('/api/links')
  .then(r => r.json())
  .then(data => {
    if (Array.isArray(data)) {
      console.log('✅ Links API working');
    } else {
      console.log('❌ Links API error:', data);
    }
  });
```

### **Issue 2: Polling Not Running**

**Symptom:** No network requests to `/api/notifications`  
**Cause:** NotificationContext not mounted or useEffect not running

**Fix:** Check if page is using NotificationProvider:

```javascript
// Look in React DevTools -> Components
// Search for "NotificationProvider"
```

### **Issue 3: Notifications Exist But Not Showing**

**Symptom:** API returns notifications but UI doesn't show them  
**Cause:** State not updating or component not rendering

**Fix:** Check console for React errors

---

## **STEP 8: Check Database Directly**

If you have database access, check if clicks are being stored:

```sql
-- Check recent clicks
SELECT * FROM clicks 
ORDER BY clicked_at DESC 
LIMIT 10;

-- Check if clicks table exists
SELECT COUNT(*) FROM clicks;
```

---

## **QUICK FIX: Reduce Polling Interval**

If everything seems to work but notifications are "slow", reduce the polling interval:

1. Open `src/context/NotificationContext.tsx`
2. Find: `setInterval(fetchNotifications, 10000)`
3. Change to: `setInterval(fetchNotifications, 3000)` (3 seconds)
4. Save and refresh page

Now notifications appear within 3 seconds!

---

## **FINAL TEST SCRIPT**

Run this complete diagnostic:

```javascript
async function fullDiagnostic() {
  console.log('🔍 FULL NOTIFICATION DIAGNOSTIC');
  console.log('================================\n');
  
  // Test 1: API Endpoint
  console.log('1️⃣ Testing Notifications API...');
  try {
    const apiTest = await fetch('/api/notifications?since=' + new Date(Date.now() - 3600000).toISOString())
      .then(r => r.json());
    console.log('✅ API Response:', apiTest);
    console.log('   Count:', apiTest.count);
  } catch (err) {
    console.error('❌ API Error:', err);
  }
  
  // Test 2: Create Link
  console.log('\n2️⃣ Creating test link...');
  const testLink = await fetch('/api/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://example.com',
      customCode: 'diag' + Date.now()
    })
  }).then(r => r.json());
  console.log('✅ Link created:', testLink.code);
  
  // Test 3: Click Link
  console.log('\n3️⃣ Clicking link...');
  window.open('/' + testLink.code, '_blank');
  console.log('✅ Link opened in new tab');
  
  // Test 4: Wait and Check
  console.log('\n4️⃣ Waiting 3 seconds for click to be recorded...');
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('5️⃣ Checking analytics...');
  const analytics = await fetch('/api/analytics/' + testLink.code).then(r => r.json());
  console.log('📊 Click count:', analytics.link?.totalClicks || 0);
  
  if (analytics.link?.totalClicks > 0) {
    console.log('✅ Click was recorded!');
    
    console.log('\n6️⃣ Checking notifications API...');
    const notifs = await fetch('/api/notifications?since=' + new Date(Date.now() - 60000).toISOString())
      .then(r => r.json());
    console.log('📊 Notifications:', notifs);
    
    if (notifs.count > 0) {
      console.log('✅✅ NOTIFICATIONS WORKING!');
      console.log('🔔 Should appear in UI within 10 seconds (next poll cycle)');
      
      setTimeout(() => {
        console.log('\n⏰ Check the bell icon now! 🔔');
      }, 10000);
    } else {
      console.log('❌ No notifications found in API');
      console.log('💡 Check if clicks table has the data');
    }
  } else {
    console.log('❌ Click was NOT recorded!');
    console.log('💡 Issue with click tracking - check redirect API');
  }
  
  console.log('\n================================');
  console.log('Diagnostic complete!');
}

fullDiagnostic();
```

---

## **IMMEDIATE FIX TO TRY:**

The most likely issue is the polling interval is too slow. Do this NOW:

**Refresh your page** and watch the console. Within 10 seconds of clicking a link, you should see
the notification.

If not, run the `fullDiagnostic()` function above and share the output with me!

---

**Run the diagnostic script above and let me know what you see!** 🔍