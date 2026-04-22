# 🚀 Railway Deployment - Visual Step-by-Step

## Your Configuration ✅

```
🗄️  MongoDB URI:
mongodb+srv://st651102064101_db_user:RRBYEZWyEXsKtPPa@cluster0.ny7w3dh.mongodb.net/?appName=Cluster0

🎮 Game URL:
https://tranquil-melba-77872b.netlify.app

📦 Repository:
st651102064101-design/The-game--The-Late-Riser
```

---

## 🎯 3 Steps to Complete

### Step 1️⃣: Go to Railway.app (5 minutes)

```
1. Open browser: https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway
4. Click "+ New Project"
5. Select "Deploy from GitHub repo"
6. Search for and select: st651102064101-design/The-game--The-Late-Riser
7. Click "Deploy"
8. Wait: Building... → Deploying... → Success ✅
```

**Status**: Wait for this to finish (2-3 minutes)

---

### Step 2️⃣: Add Environment Variables (3 minutes)

Once deployment shows ✅ **Success**, go to **Variables** tab and add:

```
Variable 1:
Name: PORT
Value: 3000

Variable 2:
Name: NODE_ENV
Value: production

Variable 3:
Name: MONGODB_URI
Value: mongodb+srv://st651102064101_db_user:RRBYEZWyEXsKtPPa@cluster0.ny7w3dh.mongodb.net/?appName=Cluster0

Variable 4:
Name: CLIENT_ORIGIN
Value: https://tranquil-melba-77872b.netlify.app
```

**Then**: Click Save (Railway redeploys automatically)

**Status**: Wait for ✅ **Success** again

---

### Step 3️⃣: Get Your Server URL (2 minutes)

```
1. In Railway Dashboard, go to: Deployments tab
2. Click on the ✅ successful deployment
3. Look for: "Railway URL" or "Domains"
4. Copy the URL (looks like: https://rpg-multiplayer-production-xxx.railway.app)
5. Open Terminal and run:

   bash update_server_url.sh

6. Paste the Railway URL when asked
7. Script will update frontend automatically
```

**Status**: Netlify will redeploy (1-2 minutes)

---

## ✅ After Setup Complete

```
1. Go to: https://tranquil-melba-77872b.netlify.app
2. Open in 2 browsers (or 2 devices)
3. Both should load the game
4. When one player moves, the other sees them move ✅
5. Chat messages should sync ✅
```

---

## 📊 Files Ready for You

| File | Purpose |
|------|---------|
| `RAILWAY_SETUP_INFO.txt` | Configuration reference |
| `RAILWAY_FINAL_SETUP.sh` | Setup instructions script |
| `update_server_url.sh` | Auto-update frontend URL |
| Backend code (server/) | Ready for Railway |
| Frontend code (www/) | Ready for Netlify |

---

## 🆘 Troubleshooting

### "Deployment failed on Railway"
- Check: server/package.json exists ✓
- Check: server/server.js exists ✓
- Try: Redeploy manually from Railway dashboard

### "Cannot connect to server"
- Check: MONGODB_URI is correct in Railway variables
- Check: CLIENT_ORIGIN is https://tranquil-melba-77872b.netlify.app
- Check: Browser console for errors (F12)

### "Players can't see each other"
- Check: Railway Server URL in MultiplayerIntegration.js is correct
- Check: Netlify redeploy finished (check dashboard)
- Try: Hard refresh browser (Ctrl+Shift+R)

### "Slow/Lagging"
- Check: MongoDB connection in Railway logs
- Check: Network latency

---

## 🎮 Once Working ✅

### Your multiplayer RPG will have:
- ✅ Real-time player sync
- ✅ Worldwide access (anyone can play)
- ✅ Chat between players
- ✅ Persistent data in MongoDB
- ✅ Auto-deploy on git push

### To update the game:
```bash
# Make changes to game files
# Then:
git add .
git commit -m "Update description"
git push origin main
# → Netlify redeploys automatically
# → Backend updates on next Railway sync
```

---

**Status: 80% Complete! Just need to do Railway deployment ✨**
