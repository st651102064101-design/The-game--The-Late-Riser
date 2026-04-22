/**
 * RPG Multiplayer Client
 * Handle socket.io communication with backend server
 */

class RPGMultiplayer {
  constructor(serverUrl = 'http://localhost:3000') {
    this.serverUrl = serverUrl;
    this.socket = null;
    this.playerId = null;
    this.playerName = null;
    this.currentMapId = 'Map001';
    this.activePlayers = new Map();
    this.isConnected = false;

    // Callbacks for game integration
    this.onPlayerJoined = null;
    this.onPlayerSpawned = null;
    this.onPlayerMoved = null;
    this.onPlayerDespawned = null;
    this.onPlayersUpdate = null;
    this.onChatMessage = null;
    this.onPlayerStatsChanged = null;
    this.onConnectionChange = null;
  }

  /**
   * Initialize connection
   */
  connect(playerId, playerName, initialMapId = 'Map001') {
    return new Promise((resolve, reject) => {
      try {
        // Import socket.io client
        if (typeof io === 'undefined') {
          console.error('Socket.io client not loaded. Add <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>');
          reject(new Error('Socket.io not available'));
          return;
        }

        this.playerId = playerId;
        this.playerName = playerName;
        this.currentMapId = initialMapId;

        // Create socket connection
        this.socket = io(this.serverUrl, {
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5
        });

        // Connection events
        this.socket.on('connect', () => {
          console.log('✅ Connected to server');
          this.isConnected = true;
          if (this.onConnectionChange) this.onConnectionChange(true);
          
          // Emit player join
          this.socket.emit('player:join', {
            playerId: this.playerId,
            name: this.playerName,
            x: 0,
            y: 0,
            mapId: this.currentMapId,
            level: 1,
            hp: 100,
            maxHp: 100,
            exp: 0
          });
        });

        this.socket.on('player:joined', (data) => {
          console.log('✅ Player joined:', data.name);
          if (this.onPlayerJoined) this.onPlayerJoined(data);
          resolve(data);
        });

        this.socket.on('players:update', (players) => {
          players.forEach(p => {
            this.activePlayers.set(p.playerId, p);
          });
          if (this.onPlayersUpdate) this.onPlayersUpdate(players);
        });

        this.socket.on('player:spawn', (playerData) => {
          console.log('👤 Player spawned:', playerData.name);
          this.activePlayers.set(playerData.playerId, playerData);
          if (this.onPlayerSpawned) this.onPlayerSpawned(playerData);
        });

        this.socket.on('player:moved', (moveData) => {
          const { playerId, x, y } = moveData;
          if (this.activePlayers.has(playerId)) {
            const player = this.activePlayers.get(playerId);
            player.x = x;
            player.y = y;
            if (this.onPlayerMoved) this.onPlayerMoved(moveData);
          }
        });

        this.socket.on('player:despawn', (data) => {
          console.log('👤 Player despawned:', data.playerId);
          this.activePlayers.delete(data.playerId);
          if (this.onPlayerDespawned) this.onPlayerDespawned(data);
        });

        this.socket.on('player:stats-changed', (statsData) => {
          const { playerId, hp, level } = statsData;
          if (this.activePlayers.has(playerId)) {
            const player = this.activePlayers.get(playerId);
            player.hp = hp;
            player.level = level;
          }
          if (this.onPlayerStatsChanged) this.onPlayerStatsChanged(statsData);
        });

        this.socket.on('chat:receive', (chatData) => {
          console.log(`💬 [${chatData.playerName}]: ${chatData.message}`);
          if (this.onChatMessage) this.onChatMessage(chatData);
        });

        this.socket.on('disconnect', () => {
          console.log('❌ Disconnected from server');
          this.isConnected = false;
          if (this.onConnectionChange) this.onConnectionChange(false);
        });

        this.socket.on('error', (error) => {
          console.error('⚠️ Socket error:', error);
          reject(error);
        });

      } catch (error) {
        console.error('Connection error:', error);
        reject(error);
      }
    });
  }

  /**
   * Move player
   */
  movePlayer(x, y, mapId = null) {
    if (!this.isConnected) return;
    
    const map = mapId || this.currentMapId;
    this.socket.emit('player:move', {
      playerId: this.playerId,
      x,
      y,
      mapId: map
    });
  }

  /**
   * Update player stats
   */
  updateStats(hp, level, exp) {
    if (!this.isConnected) return;
    
    this.socket.emit('player:update-stats', {
      playerId: this.playerId,
      hp,
      level,
      exp
    });
  }

  /**
   * Change map
   */
  changeMap(newMapId, x = 0, y = 0) {
    if (!this.isConnected) return;
    
    this.currentMapId = newMapId;
    this.socket.emit('player:change-map', {
      playerId: this.playerId,
      newMapId,
      x,
      y
    });
  }

  /**
   * Send chat message
   */
  sendChat(message) {
    if (!this.isConnected) return;
    
    this.socket.emit('chat:send', {
      playerId: this.playerId,
      playerName: this.playerName,
      message,
      mapId: this.currentMapId
    });
  }

  /**
   * Get active players on current map
   */
  getActivePlayers() {
    return Array.from(this.activePlayers.values());
  }

  /**
   * Get specific player
   */
  getPlayer(playerId) {
    return this.activePlayers.get(playerId);
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }
}

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RPGMultiplayer;
}
