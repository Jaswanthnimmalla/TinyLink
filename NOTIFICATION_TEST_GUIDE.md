# 🔔 NOTIFICATION SYSTEM - TESTING GUIDE

## ✅ NOW WORKING: Polling-Based Notifications

I've implemented a **polling-based notification system** that checks for new clicks every 10
seconds. This works without needing a custom server!

---

## 🎯 HOW IT WORKS

```
1. You open the dashboard/home page
   ↓
2. System polls /api/notifications every 10 seconds
   ↓
3. API checks for new clicks in last 5 minutes
   ↓
4. New clicks are shown as notifications
   ↓
5. Toast popup appears + Bell shows badge
```

---

## 🧪 STEP-BY-STEP TESTING

### **Step 1: Open Your Dashboard**

Open your TinyLink app in **Browser Window 1** (Chrome):

```
http://localhost:3000
```

Look for the 🔔 bell icon in the top navbar.

---

### **Step 2: Create a Test Link**

In **Browser Window 1**, create a link using the home page form or console:

```javascript
// Open Console (F12) and run:
fetch('/api/links', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://google.com',
    customCode: 'notif-test'
  })
}).then(r => r.json()).then(data => {
  console.log('✅ Link created:', data);
  console.log('🔗 Test link:', window.location.origin + '/' + data.code);
});
```

---

### **Step 3: Click the Link (Different Browser/Tab)**

Open **Browser Window 2** (Firefox or Incognito Chrome) and visit:

```
http://localhost:3000/notif-test
```

This will:

- Redirect you to Google
- Create a click record in the database
- Trigger notification system

---

### **Step 4: Wait & Watch Window 1**

Go back to **Browser Window 1** and wait up to **10 seconds**.

**You should see:**

1. 🔔 **Bell icon gets a red badge** (showing "1")
2. 🎉 **Toast notification appears** (bottom-right corner)
3. 📝 **Notification says:** "New Click! Your link /notif-test was just clicked"
4. 📍 **Shows location and device** info

---

## 🎨 WHAT YOU'LL SEE

### **Notification Bell:**

```
Before: 🔔
After:  🔔 1  (red badge with count)
```

### **Toast Notification:**

```
┌─────────────────────────────────────────┐
│ 🔔 New Click!                           │
│ Your link /notif-test was just clicked  │
│ 📍 Local, Unknown (or actual location)  │
│ 📱 Desktop - Chrome                     │
│ Just now                          [×]   │
└─────────────────────────────────────────┘
```

### **Notification Panel (Click Bell):**

```
┌──────────────────────────────────────────┐
│ Notifications                      [×]   │
│ [Mark all read] [Clear all]             │
├──────────────────────────────────────────┤
│                                          │
│ 🔔 New Click!                     [NEW]  │
│ /notif-test was clicked                 │
│ 📍 Local • 💻 Desktop - Chrome          │
│ Just now                           [🗑]  │
│                                          │
└──────────────────────────────────────────┘
```

---

## ⚡ QUICK TEST (One Window)

If you don't want to use two browsers:

```javascript
// In Console (F12):

// 1. Create link
await fetch('/api/links', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com',
    customCode: 'quick-test'
  })
}).then(r => r.json());

// 2. Click it (opens in new tab, creates click record)
window.open('/quick-test', '_blank');

// 3. Wait 10 seconds and watch for notification!
setTimeout(() => {
  console.log('Check for notification now! 🔔');
}, 10000);
```

---

## 🔍 DEBUGGING

### **Check if polling is working:**

Open Console (F12) and you should see:

```
🔔 New notifications: 1
```

When a click is detected.

### **Manually check notifications API:**

```javascript
fetch('/api/notifications?since=' + new Date(Date.now() - 300000).toISOString())
  .then(r => r.json())
  .then(data => {
    console.log('📊 Notifications:', data);
    console.log('Count:', data.count);
    console.log('List:', data.notifications);
  });
```

### **Check recent clicks:**

```javascript
fetch('/api/analytics/notif-test')
  .then(r => r.json())
  .then(data => {
    console.log('📊 Analytics:', data);
    console.log('Total clicks:', data.link.totalClicks);
  });
```

---

## ⏱️ TIMING

- **Polling Interval:** Every 10 seconds
- **Detection Window:** Last 5 minutes of clicks
- **Max Notifications:** 20 per poll
- **Auto-refresh:** Continuous while page is open

**Note:** Maximum delay is 10 seconds between click and notification. If you click a link, you'll
see the notification within 10 seconds!

---

## 🎯 ADVANCED TESTING

### **Test Multiple Clicks:**

```javascript
// Create multiple test links
for (let i = 1; i <= 3; i++) {
  await fetch('/api/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://example.com',
      customCode: `multi-test-${i}`
    })
  }).then(r => r.json());
}

// Click all of them
for (let i = 1; i <= 3; i++) {
  window.open(`/multi-test-${i}`, '_blank');
  await new Promise(r => setTimeout(r, 1000)); // Wait 1 second between clicks
}

// Wait 10 seconds for notifications
// You should see 3 separate notifications!
```

---

## 🔔 NOTIFICATION FEATURES

### **What Works:**

- ✅ Real-time polling (every 10 seconds)
- ✅ Toast notifications with auto-dismiss
- ✅ Bell badge with unread count
- ✅ Notification center panel
- ✅ Mark as read/unread
- ✅ Delete individual notifications
- ✅ Clear all notifications
- ✅ Location and device info
- ✅ Relative timestamps ("2 minutes ago")

### **Interactions:**

- Click **bell icon** → Opens notification panel
- Click **notification** → Marks as read (optional: go to analytics)
- Click **trash icon** → Deletes notification
- Click **Mark all read** → Marks all as read
- Click **Clear all** → Removes all notifications
- Click **X on toast** → Dismisses toast early

---

## 💡 TIPS

### **Test with Real Devices:**

1. Get your computer's IP address:
   ```powershell
   ipconfig
   # Look for IPv4: e.g., 192.168.1.100
   ```

2. On desktop: Open `http://localhost:3000`

3. On mobile: Open `http://YOUR_IP:3000`

4. Create link on desktop, click on mobile

5. Desktop shows notification with **actual mobile device info**!

---

## 🎉 SUCCESS CRITERIA

✅ Bell icon shows in navbar  
✅ Badge appears with number when clicks happen  
✅ Toast notification pops up (bottom-right)  
✅ Clicking bell opens notification panel  
✅ Notifications show correct link code  
✅ Location and device info displayed  
✅ Timestamps update ("just now", "2 min ago")  
✅ Mark as read works  
✅ Delete works  
✅ Clear all works

---

## 🚀 YOU'RE DONE!

Your notification system is now **fully functional** using a polling-based approach!

**Advantages:**

- ✅ No custom server needed
- ✅ Works with Next.js dev server
- ✅ Simple and reliable
- ✅ Easy to deploy

**Performance:**

- Checks every 10 seconds
- Only fetches last 5 minutes
- Efficient database queries
- No duplicate notifications

---

**Test it now and see your notifications in action!** 🎉🔔