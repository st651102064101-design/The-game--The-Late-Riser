//=============================================================================
// MultiplayerIntegration.js
// Integration layer between RPG Maker and Socket.io
//=============================================================================

if (typeof RPGMultiplayer === 'undefined') {
  throw new Error('RPGMultiplayer.js must be loaded before this plugin');
}

// Initialize multiplayer
let $multiplayer = null;

// Create window to hold other players' sprites
let $otherPlayersSprites = {};

/**
 * Initialize multiplayer system
 */
function initializeMultiplayer(playerName = 'Player') {
  return new Promise((resolve, reject) => {
    try {
      // Get server URL (use Netlify environment variable if available)
      const serverUrl = window.MULTIPLAYER_SERVER_URL || 'http://localhost:3000';
      
      // Generate unique player ID
      const playerId = localStorage.getItem('playerId') || generateUUID();
      localStorage.setItem('playerId', playerId);

      // Create multiplayer instance
      $multiplayer = new RPGMultiplayer(serverUrl);

      // Setup callbacks
      $multiplayer.onPlayerSpawned = onOtherPlayerSpawned;
      $multiplayer.onPlayerMoved = onOtherPlayerMoved;
      $multiplayer.onPlayerDespawned = onOtherPlayerDespawned;
      $multiplayer.onPlayersUpdate = onPlayersUpdate;
      $multiplayer.onChatMessage = onChatMessageReceived;
      $multiplayer.onPlayerStatsChanged = onOtherPlayerStatsChanged;
      $multiplayer.onConnectionChange = onConnectionChange;

      // Connect to server
      $multiplayer.connect(playerId, playerName, $gameMap._mapId)
        .then(data => {
          console.log('✅ Multiplayer initialized');
          resolve(data);
        })
        .catch(error => {
          console.error('❌ Failed to initialize multiplayer:', error);
          reject(error);
        });

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * When other player spawns
 */
function onOtherPlayerSpawned(playerData) {
  // Create sprite for other player
  const sprite = new Sprite_Character(new Game_OtherPlayer(playerData));
  sprite.setFrame(0, 0, ImageManager.iconWidth, ImageManager.iconHeight);
  
  if ($gameMap._displayObjects) {
    $gameMap._displayObjects.push(sprite);
  }
  
  $otherPlayersSprites[playerData.playerId] = {
    sprite: sprite,
    data: playerData
  };
}

/**
 * When other player moves
 */
function onOtherPlayerMoved(moveData) {
  if ($otherPlayersSprites[moveData.playerId]) {
    const playerSprite = $otherPlayersSprites[moveData.playerId];
    playerSprite.data.x = moveData.x;
    playerSprite.data.y = moveData.y;
    playerSprite.sprite._character._x = moveData.x;
    playerSprite.sprite._character._y = moveData.y;
  }
}

/**
 * When other player despawns
 */
function onOtherPlayerDespawned(data) {
  if ($otherPlayersSprites[data.playerId]) {
    const playerSprite = $otherPlayersSprites[data.playerId];
    // Remove sprite from display
    if (SceneManager._scene._spriteset && SceneManager._scene._spriteset._characterSprites) {
      const index = SceneManager._scene._spriteset._characterSprites.indexOf(playerSprite.sprite);
      if (index > -1) {
        SceneManager._scene._spriteset._characterSprites.splice(index, 1);
      }
    }
    delete $otherPlayersSprites[data.playerId];
  }
}

/**
 * Update all players on map
 */
function onPlayersUpdate(players) {
  players.forEach(player => {
    onOtherPlayerSpawned(player);
  });
}

/**
 * Handle incoming chat message
 */
function onChatMessageReceived(chatData) {
  $gameMessage.setBackground(1);
  $gameMessage.setPositionType(2);
  $gameMessage.add(`${chatData.playerName}: ${chatData.message}`);
}

/**
 * Handle other player stats change
 */
function onOtherPlayerStatsChanged(statsData) {
  if ($otherPlayersSprites[statsData.playerId]) {
    const playerData = $otherPlayersSprites[statsData.playerId].data;
    playerData.hp = statsData.hp;
    playerData.level = statsData.level;
  }
}

/**
 * Handle connection change
 */
function onConnectionChange(isConnected) {
  const status = isConnected ? '✅ Connected' : '❌ Disconnected';
  console.log(`Multiplayer status: ${status}`);
}

/**
 * Send player movement to server
 */
function syncPlayerMovement(x, y) {
  if ($multiplayer && $multiplayer.isConnected) {
    $multiplayer.movePlayer(x, y);
  }
}

/**
 * Send player stats to server
 */
function syncPlayerStats(hp, level, exp) {
  if ($multiplayer && $multiplayer.isConnected) {
    $multiplayer.updateStats(hp, level, exp);
  }
}

/**
 * Change map and notify server
 */
function changeMapMultiplayer(mapId, x, y) {
  if ($multiplayer && $multiplayer.isConnected) {
    $multiplayer.changeMap(mapId, x, y);
  }
}

/**
 * Send chat message
 */
function sendChatMessage(message) {
  if ($multiplayer && $multiplayer.isConnected) {
    $multiplayer.sendChat(message);
  }
}

/**
 * Generate UUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Game_OtherPlayer - Character object for other players
 */
class Game_OtherPlayer extends Game_CharacterBase {
  constructor(playerData) {
    super();
    this._playerId = playerData.playerId;
    this._playerName = playerData.name;
    this._x = playerData.x;
    this._y = playerData.y;
    this._level = playerData.level;
    this._hp = playerData.hp;
    this._maxHp = playerData.maxHp;
    this.setImage('', 0);
  }

  update() {
    super.update();
  }

  screenX() {
    const tw = $gameMap.tileWidth();
    return Math.round($gameMap.adjustX(this._x) * tw + tw / 2);
  }

  screenY() {
    const th = $gameMap.tileHeight();
    return Math.round($gameMap.adjustY(this._y) * th + th / 2);
  }
}
