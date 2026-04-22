# 🎮 Multiplayer Setup Guide

## Overview
ระบบ Multiplayer ของคุณทำงานแบบ **Shared World Co-op** ซึ่งหมายความว่า:
- ✅ หลายคนเล่นในแมพเดียวกัน
- ✅ เห็นกันได้ในระบบ real-time
- ✅ Chat ระหว่าง players
- ✅ Shared game state (HP, Level, Position)

---

## 🛠️ Architecture

### Frontend (www/)
```
www/
├── js/plugins/
│   ├── RPGMultiplayer.js           # Socket.io client
│   └── MultiplayerIntegration.js   # RPG Maker integration
└── index.html                       # Loads socket.io & plugins
```

### Backend (server/)
```
server/
├── server.js                  # Express + Socket.io server
├── package.json               # Dependencies
├── .env.example              # Environment template
├── Procfile                  # For Heroku/Railway deployment
└── railway.json             # Railway deployment config
```

---

## 🚀 Deployment Steps

### Step 1: MongoDB Setup (Database)
1. สมัครที่ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. สร้าง **Free Tier** Cluster
3. สร้าง Database User (username & password)
4. Get Connection String: `mongodb+srv://username:password@cluster.mongodb.net/rpg-game`

### Step 2: Deploy Backend on Railway

**A. Setup Railway Account**
1. ไปที่ [railway.app](https://railway.app)
2. Sign up ด้วย GitHub account
3. Create new project

**B. Deploy Server**
```bash
cd server
npm install
# Set environment variables in Railway dashboard
# PORT=3000
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rpg-game
# CLIENT_ORIGIN=https://www.your-netlify-domain.netlify.app
```

**C. Get Server URL**
Railway จะให้ URL เช่น: `https://your-server.railway.app`

### Step 3: Update Frontend

**แก้ไข www/js/plugins/MultiplayerIntegration.js:**
```javascript
// Change this line:
const serverUrl = window.MULTIPLAYER_SERVER_URL || 'http://localhost:3000';

// To:
const serverUrl = 'https://your-server.railway.app'; // Your Railway URL
```

### Step 4: Deploy to Netlify
```bash
git add .
git commit -m "Add multiplayer support"
git push origin main
```
→ Netlify จะ deploy ใหม่อัตโนมัติ

---

## 📝 How to Use in Game

### 1. Initialize Multiplayer
เพิ่มในโปรแกรม `Scene_Map` initialization หรือใน Main.js:

```javascript
// After scene setup
if (SceneManager._scene instanceof Scene_Map) {
  initializeMultiplayer('YourPlayerName').catch(err => {
    console.warn('Multiplayer failed:', err);
    // Game continues without multiplayer
  });
}
```

### 2. Sync Player Movement
ในหลังจาก player move:

```javascript
// After $gamePlayer.moveTo(x, y)
syncPlayerMovement($gamePlayer.x, $gamePlayer.y);
```

### 3. Sync Player Stats
เมื่อ HP หรือ Level เปลี่ยน:

```javascript
syncPlayerStats($gameParty.leader().hp, $gameParty.leader().level(), $gameParty.leader().exp);
```

### 4. Send Chat
ตัวอย่าง Plugin Command:

```javascript
// In Plugin Command Handler
sendChatMessage(args[0]); // args[0] = message text
```

### 5. Change Map
เมื่อเข้า Transfer:

```javascript
// Before map transfer
changeMapMultiplayer(destination_map_id, destination_x, destination_y);
```

---

## 🔌 API Reference

### RPGMultiplayer Methods

```javascript
// Connect to server
$multiplayer.connect(playerId, playerName, mapId)

// Move player
$multiplayer.movePlayer(x, y, mapId)

// Update stats
$multiplayer.updateStats(hp, level, exp)

// Change map
$multiplayer.changeMap(newMapId, x, y)

// Send chat
$multiplayer.sendChat(message)

// Get all players on map
$multiplayer.getActivePlayers()

// Get specific player
$multiplayer.getPlayer(playerId)

// Disconnect
$multiplayer.disconnect()
```

### Events (Callbacks)

```javascript
$multiplayer.onPlayerSpawned = (playerData) => {
  // When other player enters map
};

$multiplayer.onPlayerMoved = (moveData) => {
  // When other player moves
};

$multiplayer.onPlayerDespawned = (data) => {
  // When other player leaves map
};

$multiplayer.onChatMessage = (chatData) => {
  // When chat message received
};

$multiplayer.onConnectionChange = (isConnected) => {
  // When connection status changes
};
```

---

## 🐛 Troubleshooting

### Issue: Players can't see each other
**Solution:**
1. Check SERVER_URL is correct in MultiplayerIntegration.js
2. Check CORS settings in server.js
3. Ensure Railway server is running: visit `https://your-server.railway.app/api/health`

### Issue: Chat not working
**Solution:**
1. Check Socket.io is loaded: `console.log(typeof io)`
2. Check server logs in Railway dashboard
3. Verify CLIENT_ORIGIN in Railway environment variables

### Issue: Database not saving
**Solution:**
1. Check MONGODB_URI is correct
2. Check MongoDB connection in server logs
3. Game works without database (in-memory mode)

### Issue: Slow/Lagging
**Solution:**
1. Reduce sync frequency
2. Use compression in Socket.io
3. Optimize database queries

---

## 📊 Server Monitoring

### Railway Dashboard
- View logs in real-time
- Monitor CPU/Memory usage
- Check deployment status
- Restart server if needed

### Database Monitoring
- MongoDB Atlas Dashboard
- View connections
- Monitor storage usage
- Check query performance

---

## 🔐 Security Considerations

1. **Client Validation**: Server ต้องตรวจสอบ player moves (prevent cheating)
2. **Rate Limiting**: Add rate limits to prevent spam
3. **Authentication**: Consider adding login system
4. **Data Encryption**: Use SSL/HTTPS (automatic on Railway)

---

## 🚀 Next Steps

### Level Up Multiplayer:
1. ✅ Co-op (current)
2. ➡️ PvP (battles between players)
3. ➡️ Guilds/Teams
4. ➡️ Shared Quests
5. ➡️ Economy System (shops, trading)
6. ➡️ Leaderboards

---

## 📞 Support

หากต้องการความช่วยเหลือ:
1. ตรวจสอบ Server logs ใน Railway
2. ดู Browser console สำหรับ errors
3. ดู Database เว็บว่ามี data เสมอหรือไม่

**Happy multiplayer gaming! 🎮✨**
