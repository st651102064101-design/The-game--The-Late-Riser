# 🚀 Railway Deployment - Quick Reference

## URLs You'll Need

### MongoDB Atlas
- **Website:** https://www.mongodb.com/cloud/atlas
- **Your Cluster:** Cluster0
- **Connection String Format:**
  ```
  mongodb+srv://rpguser:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```

### Railway.app
- **Website:** https://railway.app
- **Your Project:** The-game--The-Late-Riser
- **Server URL Will Be:** https://rpg-multiplayer-production-xxx.railway.app

### Netlify
- **Your Game:** https://tranquil-melba-77872b.netlify.app
- **GitHub Repo:** st651102064101-design/The-game--The-Late-Riser

---

## Environment Variables for Railway

Copy these into Railway **Variables** tab:

```
PORT=3000

NODE_ENV=production

MONGODB_URI=mongodb+srv://rpguser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

CLIENT_ORIGIN=https://tranquil-melba-77872b.netlify.app
```

---

## 3 Environment Files

### 1. MongoDB Connection String
From: MongoDB Atlas → Databases → Connect → Drivers → Node.js
```
mongodb+srv://rpguser:PASSWORD@...
```

### 2. Railway Server URL  
From: Railway → Your Project → Deployments → Domains
```
https://rpg-multiplayer-production-xxx.railway.app
```

### 3. Netlify Frontend URL
Already have:
```
https://tranquil-melba-77872b.netlify.app
```

---

## Setup Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created
- [ ] Database user added (rpguser)
- [ ] Network access allowed (0.0.0.0/0)
- [ ] MongoDB connection string copied

- [ ] Railway account created
- [ ] GitHub repo connected
- [ ] Deployment started
- [ ] Environment variables added
- [ ] Deployment shows ✅ Success
- [ ] Railway server URL copied

- [ ] MultiplayerIntegration.js updated with Railway URL
- [ ] Changes pushed to GitHub
- [ ] Netlify redeploy finished

- [ ] Game loads in browser
- [ ] Multiple players test passed
- [ ] Chat works
- [ ] Movement syncs

---

## Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Can't find MongoDB connection string | Go to Clusters → Connect → Drivers → Node.js |
| Railway deployment failed | Check server/package.json exists |
| "Cannot connect to server" | Verify MONGODB_URI and CLIENT_ORIGIN in Railway |
| Players can't see each other | Check Railway SERVER_URL in MultiplayerIntegration.js |
| Slow response | Check MongoDB connection in Railway logs |

---

## Files Modified

- `www/js/plugins/MultiplayerIntegration.js` - Server URL added
- `server/.env.example` - Environment template
- `server/server.js` - Backend with Socket.io

---

## Testing Commands

```bash
# Check if files exist
ls -la server/package.json
ls -la www/js/plugins/MultiplayerIntegration.js

# Git status
git status

# Push changes
git push origin main
```

---

## Success Indicators ✅

- [ ] Netlify shows "Published"
- [ ] Railway shows "Success"
- [ ] Browser loads game without errors
- [ ] Console shows "✅ Connected to server"
- [ ] 2 players can see each other
- [ ] Chat messages sync
- [ ] Movement syncs in real-time

---

**Once all ✅ are checked: MULTIPLAYER IS WORKING! 🎮**
