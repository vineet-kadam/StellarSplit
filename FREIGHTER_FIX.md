# How to Fix Freighter Extension Issues

## The Problem
Freighter is installed but not working - popups don't appear and you see errors like:
- `MaxListenersExceededWarning`
- `ObjectMultiplex - orphaned data`

## Complete Fix - Follow EXACTLY:

### Step 1: Complete Removal
1. Open Chrome
2. Go to `chrome://extensions/`
3. Find **Freighter**
4. Click **Remove**
5. **Close Chrome completely** (close ALL windows)

### Step 2: Clean Chrome Data
1. Press `Windows Key + R`
2. Type: `%LOCALAPPDATA%\Google\Chrome\User Data\Default\Extensions`
3. Press Enter
4. Find folder named `bcacfldlkkdogcmkkibnjlakofdplcbk`
5. **Delete this folder** if it exists
6. Close File Explorer

### Step 3: Restart Computer
Yes, seriously. **Restart your computer**.

### Step 4: Fresh Install
1. Open Chrome
2. Go to: https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk
3. Click **Add to Chrome**
4. Click **Add extension**
5. Wait for install to complete
6. Click the Freighter icon
7. Set up your wallet
8. **Make sure you're on TESTNET**

### Step 5: Verify
1. Go to `chrome://extensions/`
2. Freighter should show:
   - ✅ Enabled (blue toggle)
   - ✅ Site access: On all sites
3. Click Freighter icon - should open without errors

### Step 6: Test
1. Open http://localhost:3000
2. Open console (F12)
3. Type:
```javascript
import('@stellar/freighter-api').then(api => api.getPublicKey().then(console.log));
```
4. **Popup SHOULD appear**

## If It STILL Doesn't Work:

Your Chrome installation has issues. Try:
1. **Use Firefox** instead
2. **Use Brave browser** instead
3. Or use the **Demo Mode** button in the app
