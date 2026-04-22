# 🎮 Complete Multiplayer Setup Guide

**⏱️ Total time: ~20 minutes**

---

## 📋 Checklist

- [ ] MongoDB Setup (5 min)
- [ ] Railway Deploy (10 min)  
- [ ] Update Server URL (2 min)
- [ ] Git Push (1 min)
- [ ] Test Multiplayer (2 min)

---

## 1️⃣ MongoDB Setup (5 minutes)

### Option A: Automatic (If you have the instructions)

```bash
bash SETUP_MONGODB.sh
```

### Option B: Manual Steps

1. **Go to MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up with GitHub (easiest)

2. **Create Free Cluster**
   - Click "Build a Database" or "Create"
   - Select "Shared" (Free tier)
   - Choose your region
   - Wait for cluster creation (~5 min)

3. **Add Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `rpguser`
   - Password: Create a strong one (save it!)
   - Click "Add User"

4. **Allow Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Databases"
   - Click "Connect" button on your cluster
   - Select "Connect your application"
   - Copy the connection string (should contain `mongodb+srv://`)
   - Replace `<password>` with your database password
   - **Save this! You need it for Railway**

   Example:
   ```
   mongodb+srv://rpguser:YOUR_PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

✅ **Done! Keep your MongoDB URL safe**

---

## 2️⃣ Deploy Backend on Railway (10 minutes)

### Step 1: Create Railway Account
- Go to https://railway.app
- Click "Login with GitHub"
- Authorize Railway

### Step 2: Create New Project
- Click "+ New Project"
- Select "Deploy from GitHub repo"
- Choose your repo: `st651102064101-design/The-game--The-Late-Riser`

### Step 3: Configure Server Folder
- Railway might ask which folder to deploy
- Select `/server` folder
- Click "Deploy"

### Step 4: Wait for Initial Deploy
- Status should show "Building..." → "Deploying..." → "Success ✅"
- This takes 2-3 minutes

### Step 5: Add Environment Variables
Once deployed, go to **Variables** tab and add:

```
PORT
3000

NODE_ENV
production

MONGODB_URI
mongodb+srv://rpguser:YOUR_PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority

CLIENT_ORIGIN
https://your-netlify-domain.netlify.app
```

Replace:
- `YOUR_PASSWORD` = Your MongoDB password
- `your-netlify-domain` = Your Netlify URL (e.g., `tranquil-melba-77872b`)

### Step 6: Get Your Server URL
- Go to "Deployments" tab
- Click on the successful deployment
- Look for **"Railway URL"** or **"Domains"**
- Should look like: `https://rpg-multiplayer-production-xxx.railway.app`
- **Copy and save this URL!**

✅ **Done! Keep your Railway URL**

---

## 3️⃣ Update Frontend with Server URL (2 minutes)

You have two options:

### Option A: Using Script

```bash
chmod +x update_server_url.sh
bash update_server_url.sh
```

Then enter your Railway URL when prompted.

### Option B: Manual Edit

**File to edit:** `www/js/plugins/MultiplayerIntegration.js`

**Find this line (around line 13):**
```javascript
const serverUrl = window.MULTIPLAYER_SERVER_URL || 'http://localhost:3000';
```

**Replace with:**
```javascript
const serverUrl = 'https://your-railway-url.railway.app';
```

Replace `your-railway-url` with your actual Railway domain.

**Save the file.**

✅ **Done! Server URL updated**

---

## 4️⃣ Git Push to Trigger Redeploy (1 minute)

```bash
cd /Users/kriang/Downloads/Output/Project

git add www/js/plugins/MultiplayerIntegration.js
git commit -m "Update multiplayer server URL for production"
git push origin main
```

**What happens:**
- GitHub receives the update
- Netlify automatically redeploys your frontend (1-2 min)
- Your game now has the correct server URL

✅ **Done! Waiting for Netlify to redeploy**

---

## 5️⃣ Test Multiplayer (2 minutes)

### Wait for Redeploy
- Check Netlify Dashboard
- Status should show "✅ Published"

### Test with Multiple Browsers/Devices

**Option A: Local Testing**
1. Open in Browser 1: `https://your-netlify-domain.netlify.app`
2. Open in Browser 2: `https://your-netlify-domain.netlify.app` (or different device)
3. Both should load the game

**Option B: Share with Friends**
1. Send URL to friend: `https://your-netlify-domain.netlify.app`
2. Both open in browser
3. Both enter the game

### What to Look For
- ✅ Game loads without errors
- ✅ When Player A moves, Player B sees them move
- ✅ Chat messages appear for both
- ✅ Player list updates
- ✅ Stats sync correctly

### Troubleshooting

**Problem: "Server connection failed"**
- Check Railway URL is correct in MultiplayerIntegration.js
- Verify Railway deployment is ✅ Success
- Check MongoDB connection in Railway logs

**Problem: "Players can't see each other"**
- Check CLIENT_ORIGIN in Railway variables
- Should be your full Netlify URL
- Verify Socket.io connected in browser console

**Problem: "Game won't load"**
- Check Netlify deployment is ✅ Published
- Verify www/index.html loads Socket.io
- Check browser console for errors

---

## 📊 Monitoring

### Check Railway Logs
- Go to Railway Dashboard
- Click on your deployment
- View real-time logs
- Look for errors or connection issues

### Check Netlify
- Go to Netlify Dashboard
- Check deployment status
- Review build logs if there are issues

### Check Browser Console
- Open game in browser
- Press F12 (Dev Tools)
- Go to Console tab
- Look for connection messages and errors

---

## 🎮 Once Everything Works

### You can now:
- ✅ Play multiplayer with friends worldwide
- ✅ See other players in real-time
- ✅ Chat with other players
- ✅ Share progress automatically
- ✅ Deploy updates with `git push`

### To update the game:
1. Make changes to game files
2. `git add .`
3. `git commit -m "Your message"`
4. `git push origin main`
5. Netlify redeploys automatically! ✨

---

## 📝 Environment Variables Needed

Keep track of these (don't share publicly):
- MongoDB username: `rpguser`
- MongoDB password: `<your strong password>`
- MongoDB URI: `mongodb+srv://rpguser:password@...`
- Railway URL: `https://your-server.railway.app`
- Netlify URL: `https://your-game.netlify.app`

---

## 🆘 Quick Troubleshooting

| Issue | Check |
|-------|-------|
| Game loads but no multiplayer | Check SERVER_URL in MultiplayerIntegration.js |
| Railway deployment failed | Check package.json is in server/ folder |
| MongoDB connection error | Verify MONGODB_URI in Railway variables |
| Players can't see each other | Check CLIENT_ORIGIN in Railway environment |
| Chat not working | Check Socket.io is loaded in index.html |
| Slow/Lagging | Check server logs for errors |

---

## ✨ Success!

Once you see:
- ✅ Railway deployment: Success
- ✅ Netlify deployment: Published
- ✅ Multiple players visible in game
- ✅ Chat working between players

**Your multiplayer RPG is LIVE! 🎮🚀**

---

## 💡 Next Steps

1. **Test thoroughly** with multiple players
2. **Fix any bugs** in game code
3. **Add more features** (see MULTIPLAYER_SETUP.md)
4. **Optimize performance** if needed
5. **Scale up** when you have more players

---

**Questions? Check the logs and console for clues!**
