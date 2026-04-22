//=============================================================================
// MultiplayerIntegration.js
// Integration layer between RPG Maker and Socket.io
//=============================================================================

if (typeof RPGMultiplayer === 'undefined') {
  throw new Error('RPGMultiplayer.js must be loaded before this plugin');
}

// Server configuration
const SERVER_URL = 'https://the-game-the-late-riser-production.up.railway.app';

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
      // Get server URL from config
      const serverUrl = SERVER_URL;
      
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
          console.warn('ℹ️ Multiplayer unavailable:', error?.message || error);
          resolve({ offlineMode: true, message: 'Playing in offline mode' });
        });

    } catch (error) {
      console.warn('ℹ️ Multiplayer error:', error?.message || error);
      resolve({ offlineMode: true, message: 'Playing in offline mode' });
    }
  });
}

/**
 * When other player spawns
 */
function onOtherPlayerSpawned(playerData) {
  // Create character and sprite for other player
  const character = new Game_OtherPlayer(playerData);
  const sprite = new Sprite_Character(character);
  
  // Add to scene's spriteset
  if (SceneManager._scene._spriteset && SceneManager._scene._spriteset._characterSprites) {
    SceneManager._scene._spriteset._characterSprites.push(sprite);
    SceneManager._scene._spriteset.addChild(sprite);
  }

  character.setDirection(playerData.direction || 2);
  playerData.character = character;
  playerData.sprite = sprite;

  $otherPlayersSprites[playerData.playerId] = {
    sprite: sprite,
    character: character,
    data: playerData
  };
  
  console.log(`👤 Other player spawned: ${playerData.name}`);
}

/**
 * When other player moves
 */
function onOtherPlayerMoved(moveData) {
  if ($otherPlayersSprites[moveData.playerId]) {
    const playerSprite = $otherPlayersSprites[moveData.playerId];
    playerSprite.data.x = moveData.x;
    playerSprite.data.y = moveData.y;
    if (moveData.direction) {
      playerSprite.character.setDirection(moveData.direction);
    }
    if (!playerSprite.character.isMoving()) {
      playerSprite.character.setPosition(moveData.x, moveData.y);
    }
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
        SceneManager._scene._spriteset.removeChild(playerSprite.sprite);
      }
    }
    delete $otherPlayersSprites[data.playerId];
    console.log(`👤 Other player despawned: ${data.name}`);
  }
}

/**
 * Update all players on map
 */
function onPlayersUpdate(players) {
  players.forEach(player => {
    if ($otherPlayersSprites[player.playerId]) {
      const entry = $otherPlayersSprites[player.playerId];
      entry.data = player;
      entry.character.setDirection(player.direction || 2);
      entry.character.setImage(player.characterName || entry.character.characterName(), player.characterIndex || entry.character.characterIndex());
      entry.character.setPosition(player.x, player.y);
    } else {
      onOtherPlayerSpawned(player);
    }
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
    const character = $otherPlayersSprites[statsData.playerId].character;
    
    playerData.hp = statsData.hp;
    playerData.level = statsData.level;
    
    if (character) {
      character._hp = statsData.hp;
      character._level = statsData.level;
    }
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
    const characterName = playerData.characterName || ($gamePlayer ? $gamePlayer.characterName() : '');
    const characterIndex = playerData.characterIndex || ($gamePlayer ? $gamePlayer.characterIndex() : 0);
    this.setImage(characterName, characterIndex);
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

// Hook into Scene_Map to initialize multiplayer
const _Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
  _Scene_Map_start.call(this);
  
  // Initialize multiplayer when entering map
  if (!$multiplayer || !$multiplayer.isConnected) {
    initializeMultiplayer($gameParty.leader().name() || 'Player')
      .catch(error => console.error('Multiplayer init error:', error));
  } else {
    clearOtherPlayers();
    $multiplayer.refreshPlayers($gameMap._mapId);
  }
};

function clearOtherPlayers() {
  Object.values($otherPlayersSprites).forEach(entry => {
    if (SceneManager._scene && SceneManager._scene._spriteset && SceneManager._scene._spriteset._characterSprites) {
      const index = SceneManager._scene._spriteset._characterSprites.indexOf(entry.sprite);
      if (index > -1) {
        SceneManager._scene._spriteset._characterSprites.splice(index, 1);
      }
      if (entry.sprite && entry.sprite.parent) {
        entry.sprite.parent.removeChild(entry.sprite);
      }
    }
  });
  $otherPlayersSprites = {};
}

// Sync player movement
const _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function(d) {
  _Game_Player_moveStraight.call(this, d);
  if ($multiplayer && $multiplayer.isConnected) {
    $multiplayer.movePlayer(this._x, this._y, $gameMap._mapId);
  }
};

// Sync player direction changes
const _Game_Player_setDirection = Game_Player.prototype.setDirection;
Game_Player.prototype.setDirection = function(d) {
  _Game_Player_setDirection.call(this, d);
  if ($multiplayer && $multiplayer.isConnected) {
    $multiplayer.sendDirection(d, $gameMap._mapId);
  }
};

// Sync player teleport/respawn
const _Game_Player_locate = Game_Player.prototype.locate;
Game_Player.prototype.locate = function(x, y) {
  _Game_Player_locate.call(this, x, y);
  if ($multiplayer && $multiplayer.isConnected) {
    $multiplayer.movePlayer(this._x, this._y, $gameMap._mapId);
  }
};
