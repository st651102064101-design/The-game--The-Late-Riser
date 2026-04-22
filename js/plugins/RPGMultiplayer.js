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
    this.currentX = 0;
    this.currentY = 0;
    this.currentDirection = 2;
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

        // Connection timeout - resolve with offline mode if timeout
        const connectionTimeout = setTimeout(() => {
          if (this.socket && !this.isConnected) {
            console.warn('⚠️ Multiplayer: Connection timeout - running in offline mode');
            this.socket.disconnect();
            this.isConnected = false;
            resolve({ offlineMode: true, message: 'Playing in offline mode' });
          }
        }, 5000);

        // Create socket connection with error suppression
        this.socket = io(this.serverUrl, {
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 3,
          reconnection: false // Disable auto-reconnect to prevent spam
        });

        // Connection events
        this.socket.on('connect', () => {
          clearTimeout(connectionTimeout);
          console.log('✅ Connected to multiplayer server');
          this.isConnected = true;
          if (this.onConnectionChange) this.onConnectionChange(true);
          
          // Emit player join
          const playerCharacterName = $gamePlayer.characterName ? $gamePlayer.characterName() : '';
        const playerCharacterIndex = $gamePlayer.characterIndex ? $gamePlayer.characterIndex() : 0;
        const defaultDirection = $gamePlayer.direction ? $gamePlayer.direction() : 2;
        this.currentX = $gamePlayer._x || 0;
        this.currentY = $gamePlayer._y || 0;
        this.currentDirection = defaultDirection;

        this.socket.emit('player:join', {
            playerId: this.playerId,
            name: this.playerName,
            x: this.currentX,
            y: this.currentY,
            direction: defaultDirection,
            characterName: playerCharacterName,
            characterIndex: playerCharacterIndex,
            mapId: this.currentMapId,
            level: 1,
            hp: 100,
            maxHp: 100,
            exp: 0
          });
        });

        this.socket.on('player:joined', (data) => {
          clearTimeout(connectionTimeout);
          console.log('✅ Player joined multiplayer');
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

        this.socket.on('player:direction', (data) => {
          const player = this.activePlayers.get(data.playerId);
          if (player) {
            player.direction = data.direction;
            if (player.character) {
              player.character.setDirection(data.direction);
            }
            if (this.onPlayerDirectionChanged) {
              this.onPlayerDirectionChanged(data);
            }
          }
        });

        this.socket.on('player:moved', (moveData) => {
          const { playerId, x, y, direction } = moveData;
          if (this.activePlayers.has(playerId)) {
            const player = this.activePlayers.get(playerId);
            const oldX = player.x;
            const oldY = player.y;
            player.x = x;
            player.y = y;
            player.direction = direction || player.direction;

            if (this.onPlayerMoved) this.onPlayerMoved(moveData);

            if (player.character) {
              const dx = x - oldX;
              const dy = y - oldY;
              const moveDir = dx === 1 ? 6 : dx === -1 ? 4 : dy === 1 ? 2 : dy === -1 ? 8 : direction;
              if (Math.abs(dx) + Math.abs(dy) === 1) {
                player.character.moveStraight(moveDir);
                if (!player.character.isMoving()) {
                  player.character.setDirection(direction);
                  player.character.setPosition(x, y);
                }
              } else {
                player.character.setDirection(direction);
                player.character.setPosition(x, y);
              }
            }
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
          console.log('ℹ️ Disconnected from multiplayer');
          this.isConnected = false;
          if (this.onConnectionChange) this.onConnectionChange(false);
        });

        // Handle connection errors gracefully
        this.socket.on('connect_error', (error) => {
          console.warn('⚠️ Multiplayer connection error - continuing in offline mode');
          clearTimeout(connectionTimeout);
          this.isConnected = false;
          resolve({ offlineMode: true, message: 'Playing in offline mode' });
        });

        this.socket.on('error', (error) => {
          console.warn('⚠️ Multiplayer error - offline mode enabled');
          clearTimeout(connectionTimeout);
          this.isConnected = false;
          resolve({ offlineMode: true, message: 'Playing in offline mode' });
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
    const dx = x - this.currentX;
    const dy = y - this.currentY;
    let direction = this.currentDirection;

    if (dx === 1 && dy === 0) direction = 6;
    else if (dx === -1 && dy === 0) direction = 4;
    else if (dy === 1 && dx === 0) direction = 2;
    else if (dy === -1 && dx === 0) direction = 8;

    this.currentX = x;
    this.currentY = y;
    this.currentDirection = direction;

    this.socket.emit('player:move', {
      playerId: this.playerId,
      x,
      y,
      direction,
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

// Make class globally available in browser
if (typeof window !== 'undefined') {
  window.RPGMultiplayer = RPGMultiplayer;
}

// Also export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RPGMultiplayer;
}
