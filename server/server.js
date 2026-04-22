const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Parse allowed origins
const clientOrigins = process.env.CLIENT_ORIGIN 
  ? process.env.CLIENT_ORIGIN.split(',').map(url => url.trim())
  : [
      "https://tranquil-melba-77872b.netlify.app",
      "http://localhost:5000",
      "http://localhost:3000"
    ];

const io = socketIo(server, {
  cors: {
    origin: clientOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middleware
app.use(cors());
app.use(express.json());

// ==================== DATABASE ====================
// Player Schema
const playerSchema = new mongoose.Schema({
  playerId: String,
  name: String,
  x: Number,
  y: Number,
  mapId: String,
  level: Number,
  hp: Number,
  maxHp: Number,
  exp: Number,
  inventory: Array,
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

const Player = mongoose.model('Player', playerSchema);

// Chat Message Schema
const chatSchema = new mongoose.Schema({
  playerId: String,
  playerName: String,
  message: String,
  mapId: String,
  createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

// ==================== GAME STATE ====================
// Store active players in memory for real-time sync
const activePlayers = new Map();
const playerSockets = new Map();

// ==================== ROUTES ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.get('/api/players/:mapId', async (req, res) => {
  try {
    const { mapId } = req.params;
    const players = await Player.find({ mapId });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/chat/:mapId', async (req, res) => {
  try {
    const { mapId } = req.params;
    const messages = await Chat.find({ mapId }).limit(50).sort({ createdAt: -1 });
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SOCKET.IO ====================
io.on('connection', (socket) => {
  console.log(`[${socket.id}] Player connected`);

  // ===== PLAYER JOIN =====
  socket.on('player:join', async (playerData) => {
    try {
      const playerId = playerData.playerId || uuidv4();
      const playerName = playerData.name || `Player_${playerId.slice(0, 8)}`;

      // Save to database
      let player = await Player.findOneAndUpdate(
        { playerId },
        {
          playerId,
          name: playerName,
          x: playerData.x || 0,
          y: playerData.y || 0,
          mapId: playerData.mapId || 'Map001',
          level: playerData.level || 1,
          hp: playerData.hp || 100,
          maxHp: playerData.maxHp || 100,
          exp: playerData.exp || 0,
          lastActive: new Date()
        },
        { upsert: true, new: true }
      );

      // Store in memory
      activePlayers.set(playerId, {
        playerId,
        name: playerName,
        x: player.x,
        y: player.y,
        mapId: player.mapId,
        level: player.level,
        hp: player.hp,
        maxHp: player.maxHp
      });

      playerSockets.set(playerId, socket.id);

      // Join room for map-based sync
      socket.join(`map:${player.mapId}`);
      socket.playerId = playerId;
      socket.mapId = player.mapId;

      // Notify client of join success
      socket.emit('player:joined', {
        playerId,
        name: playerName,
        data: player
      });

      // Broadcast to other players on same map
      socket.to(`map:${player.mapId}`).emit('player:spawn', {
        playerId,
        name: playerName,
        x: player.x,
        y: player.y,
        level: player.level
      });

      // Send all players on this map to the new player
      const mapPlayers = Array.from(activePlayers.values())
        .filter(p => p.mapId === player.mapId && p.playerId !== playerId);
      
      socket.emit('players:update', mapPlayers);

      console.log(`[${playerId}] Joined map: ${player.mapId}`);

    } catch (error) {
      socket.emit('error', { message: error.message });
      console.error('Error on player:join:', error);
    }
  });

  // ===== PLAYER MOVEMENT =====
  socket.on('player:move', async (moveData) => {
    try {
      const { playerId, x, y, mapId } = moveData;

      if (activePlayers.has(playerId)) {
        const player = activePlayers.get(playerId);
        player.x = x;
        player.y = y;

        // Update database
        await Player.updateOne(
          { playerId },
          { x, y, lastActive: new Date() }
        );

        // Broadcast to other players on same map
        io.to(`map:${mapId}`).emit('player:moved', {
          playerId,
          x,
          y
        });
      }
    } catch (error) {
      console.error('Error on player:move:', error);
    }
  });

  // ===== PLAYER STATS UPDATE =====
  socket.on('player:update-stats', async (statsData) => {
    try {
      const { playerId, hp, level, exp } = statsData;

      if (activePlayers.has(playerId)) {
        const player = activePlayers.get(playerId);
        player.hp = hp;
        player.level = level;

        // Update database
        await Player.updateOne(
          { playerId },
          { hp, level, exp, lastActive: new Date() }
        );

        // Broadcast to other players
        io.to(`map:${socket.mapId}`).emit('player:stats-changed', {
          playerId,
          hp,
          level
        });
      }
    } catch (error) {
      console.error('Error on player:update-stats:', error);
    }
  });

  // ===== MAP CHANGE =====
  socket.on('player:change-map', async (mapData) => {
    try {
      const { playerId, newMapId, x, y } = mapData;

      if (activePlayers.has(playerId)) {
        const player = activePlayers.get(playerId);
        const oldMapId = socket.mapId;

        // Leave old map room
        socket.leave(`map:${oldMapId}`);

        // Update player
        player.mapId = newMapId;
        player.x = x;
        player.y = y;

        // Update database
        await Player.updateOne(
          { playerId },
          { mapId: newMapId, x, y }
        );

        // Join new map room
        socket.join(`map:${newMapId}`);
        socket.mapId = newMapId;

        // Notify other players on old map
        io.to(`map:${oldMapId}`).emit('player:despawn', { playerId });

        // Notify players on new map
        socket.to(`map:${newMapId}`).emit('player:spawn', {
          playerId,
          name: player.name,
          x,
          y,
          level: player.level
        });

        // Send all players on new map to this player
        const mapPlayers = Array.from(activePlayers.values())
          .filter(p => p.mapId === newMapId && p.playerId !== playerId);
        
        socket.emit('players:update', mapPlayers);

        console.log(`[${playerId}] Changed map: ${oldMapId} -> ${newMapId}`);
      }
    } catch (error) {
      console.error('Error on player:change-map:', error);
    }
  });

  // ===== CHAT MESSAGE =====
  socket.on('chat:send', async (chatData) => {
    try {
      const { playerId, playerName, message, mapId } = chatData;

      // Save to database
      const chat = new Chat({
        playerId,
        playerName,
        message,
        mapId
      });
      await chat.save();

      // Broadcast to players on same map
      io.to(`map:${mapId}`).emit('chat:receive', {
        playerId,
        playerName,
        message,
        timestamp: new Date()
      });

      console.log(`[${playerId}] Chat: ${message}`);
    } catch (error) {
      console.error('Error on chat:send:', error);
    }
  });

  // ===== DISCONNECT =====
  socket.on('disconnect', async () => {
    try {
      const playerId = socket.playerId;
      
      if (playerId && activePlayers.has(playerId)) {
        const player = activePlayers.get(playerId);

        // Notify other players
        io.to(`map:${socket.mapId}`).emit('player:despawn', { playerId });

        // Update database - mark as inactive
        await Player.updateOne(
          { playerId },
          { lastActive: new Date() }
        );

        // Remove from memory
        activePlayers.delete(playerId);
        playerSockets.delete(playerId);

        console.log(`[${playerId}] Disconnected`);
      }
    } catch (error) {
      console.error('Error on disconnect:', error);
    }
  });
});

// ==================== DATABASE CONNECTION ====================
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    } else {
      console.log('⚠️  MONGODB_URI not set - running without database persistence');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Continue running even if DB fails (in-memory mode)
  }
};

// ==================== START SERVER ====================
const PORT = process.env.PORT || 3000;

connectDB();

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🎮 RPG Multiplayer Server Running    ║
║  Port: ${PORT}                             ║
║  Env: ${process.env.NODE_ENV || 'development'}               ║
╚════════════════════════════════════════╝
  `);
});

module.exports = server;
