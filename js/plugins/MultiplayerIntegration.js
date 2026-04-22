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

class Sprite_NameTag extends Sprite_Base {
  constructor(name) {
    super();
    const width = 128;
    const height = 24;
    this.bitmap = new Bitmap(width, height);
    this.bitmap.fontSize = 16;
    this.bitmap.textColor = '#ffffff';
    this.bitmap.outlineColor = '#000000';
    this.bitmap.outlineWidth = 4;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.y = -48;
    this.setName(name);
  }

  setName(name) {
    if (this._name === name) {
      return;
    }
    this._name = name;
    this.bitmap.clear();
    this.bitmap.drawText(name, 0, 0, this.bitmap.width, this.bitmap.height, 'center');
  }
}

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

      // Derive display name from saved data first
      let displayName = localStorage.getItem('playerDisplayName') || '';
      if (!displayName && typeof DataManager !== 'undefined') {
        const savefileId = typeof DataManager.lastAccessedSavefileId === 'function' ? DataManager.lastAccessedSavefileId() : null;
        if (savefileId !== null && savefileId >= 0) {
          const saveInfo = DataManager.loadSavefileInfo(savefileId);
          displayName = saveInfo && saveInfo.title ? saveInfo.title : '';
        }
      }
      displayName = displayName || playerName || 'Player';

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
      $multiplayer.connect(playerId, displayName, $gameMap._mapId)
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
 * Utility for player display names
 */
function getPlayerDisplayName(playerData) {
  return (playerData.displayName && playerData.displayName.trim()) ||
         (playerData.savefileTitle && playerData.savefileTitle.trim()) ||
         (playerData.name && playerData.name.trim()) ||
         'Player';
}

function getDirectionFromDelta(dx, dy) {
  if (dx === 1 && dy === 0) return 6;
  if (dx === -1 && dy === 0) return 4;
  if (dx === 0 && dy === 1) return 2;
  if (dx === 0 && dy === -1) return 8;
  return 2;
}

function updateOtherPlayerPosition(playerSprite, x, y, direction) {
  const dx = x - playerSprite.data.x;
  const dy = y - playerSprite.data.y;
  if (dx === 0 && dy === 0) {
    if (direction) {
      playerSprite.character.setDirection(direction);
    }
  } else if (Math.abs(dx) + Math.abs(dy) === 1) {
    playerSprite.character.enqueueMove(x, y, direction);
  } else {
    playerSprite.character._moveQueue = [];
    playerSprite.character.setDirection(direction || playerSprite.character.direction());
    playerSprite.character.setPosition(x, y);
  }
  playerSprite.data.x = x;
  playerSprite.data.y = y;
}

/**
 * When other player spawns
 */
function onOtherPlayerSpawned(playerData) {
  const character = new Game_OtherPlayer(playerData);
  const sprite = new Sprite_Character(character);
  const nameText = getPlayerDisplayName(playerData);
  const nameTag = new Sprite_NameTag(nameText);
  sprite.addChild(nameTag);

  if (SceneManager._scene && SceneManager._scene._spriteset && SceneManager._scene._spriteset._characterSprites) {
    SceneManager._scene._spriteset._characterSprites.push(sprite);
    SceneManager._scene._spriteset.addChild(sprite);
  }

  character.setDirection(playerData.direction || 2);
  playerData.character = character;
  playerData.sprite = sprite;
  playerData.nameTag = nameTag;

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
    updateOtherPlayerPosition(playerSprite, moveData.x, moveData.y, moveData.direction);
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
      entry.character.setImage(player.characterName || entry.character.characterName(), player.characterIndex || entry.character.characterIndex());
      updateOtherPlayerPosition(entry, player.x, player.y, player.direction);
      if (entry.nameTag) {
        entry.nameTag.setName(getPlayerDisplayName(player));
      }
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
    const entry = $otherPlayersSprites[statsData.playerId];
    const playerData = entry.data;
    const character = entry.character;
    
    const previousHp = playerData.hp;
    playerData.hp = statsData.hp;
    playerData.level = statsData.level;
    
    if (character) {
      character._hp = statsData.hp;
      character._level = statsData.level;
      if (statsData.hp <= 0 && previousHp > 0) {
        character.setOtherPlayerDeath(true);
      } else if (statsData.hp > 0 && previousHp <= 0) {
        character.setOtherPlayerDeath(false);
      }
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
    this._otherPlayerDeathTimer = 0;
    this._otherPlayerDead = false;
    this._deathYOffset = 0;
    this._moveQueue = [];
  }

  enqueueMove(x, y, direction) {
    const dx = x - this._x;
    const dy = y - this._y;
    const moveDirection = direction || getDirectionFromDelta(dx, dy);
    if (!this.isMoving() && Math.abs(dx) + Math.abs(dy) === 1) {
      this.setDirection(moveDirection);
      this.moveStraight(moveDirection);
    } else {
      this._moveQueue.push({ x, y, direction: moveDirection });
    }
  }

  update() {
    super.update();
    if (!this.isMoving() && this._moveQueue.length > 0) {
      const nextMove = this._moveQueue.shift();
      const dx = nextMove.x - this._x;
      const dy = nextMove.y - this._y;
      const moveDirection = nextMove.direction || getDirectionFromDelta(dx, dy);
      if (Math.abs(dx) + Math.abs(dy) === 1) {
        this.setDirection(moveDirection);
        this.moveStraight(moveDirection);
      } else {
        this.setDirection(moveDirection);
        this.setPosition(nextMove.x, nextMove.y);
      }
    }
    if (this._otherPlayerDeathTimer > 0) {
      var progress = (30 - this._otherPlayerDeathTimer) / 30;
      this.opacity = 255 - Math.round(progress * 200);
      this._deathYOffset = Math.round(progress * 12);
      this._otherPlayerDeathTimer--;
      if (this._otherPlayerDeathTimer === 0) {
        this._otherPlayerDead = true;
      }
    }
  }

  setOtherPlayerDeath(isDead) {
    if (isDead) {
      if (!this._otherPlayerDead && this._otherPlayerDeathTimer <= 0) {
        this._otherPlayerDeathTimer = 30;
        this._deathYOffset = 0;
        if (typeof this.requestAnimation === 'function') {
          this.requestAnimation(1);
        }
      }
    } else {
      this._otherPlayerDeathTimer = 0;
      this._otherPlayerDead = false;
      this.opacity = 255;
      this._deathYOffset = 0;
    }
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
  
  // Reinitialize after loading a save/restart if needed
  if ($gameTemp && $gameTemp._multiplayerReinit) {
    if ($multiplayer && $multiplayer.isConnected) {
      $multiplayer.disconnect();
    }
    $multiplayer = null;
    $gameTemp._multiplayerReinit = false;
  }

  // Initialize multiplayer when entering map
  if (!$multiplayer || !$multiplayer.isConnected) {
    initializeMultiplayer($gameParty.leader().name() || 'Player')
      .catch(error => console.error('Multiplayer init error:', error));
  } else {
    refreshOtherPlayersOnMap();
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

function refreshOtherPlayersOnMap() {
  if ($multiplayer && $multiplayer.isConnected) {
    clearOtherPlayers();
    setTimeout(() => {
      if ($multiplayer && $multiplayer.isConnected) {
        $multiplayer.refreshPlayers($gameMap._mapId);
      }
    }, 1);
  }
}

const _Sprite_Character_updatePosition = Sprite_Character.prototype.updatePosition;
Sprite_Character.prototype.updatePosition = function() {
  _Sprite_Character_updatePosition.call(this);
  if (this._character && typeof this._character._deathYOffset === 'number' && this._character._deathYOffset > 0) {
    this.y -= this._character._deathYOffset;
  }
};

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

const _Game_BattlerBase_setHp = Game_BattlerBase.prototype.setHp;
Game_BattlerBase.prototype.setHp = function(hp) {
  const previousHp = this.hp;
  _Game_BattlerBase_setHp.call(this, hp);
  if ($multiplayer && $multiplayer.isConnected && this.isActor() && $gameParty && $gameParty.leader()) {
    const leader = $gameParty.leader();
    if (this.actorId && leader.actorId && this.actorId() === leader.actorId()) {
      const newHp = this.hp;
      const newLevel = typeof this.level === 'function' ? this.level() : this.level;
      const newExp = typeof this.currentExp === 'function' ? this.currentExp() : 0;
      if (newHp !== previousHp) {
        syncPlayerStats(newHp, newLevel || 1, newExp || 0);
      }
    }
  }
};

// Sync player teleport/respawn
const _Game_Player_locate = Game_Player.prototype.locate;
Game_Player.prototype.locate = function(x, y) {
  _Game_Player_locate.call(this, x, y);
  if ($multiplayer && $multiplayer.isConnected) {
    $multiplayer.movePlayer(this._x, this._y, $gameMap._mapId);
    refreshOtherPlayersOnMap();
  }
};

// Sync map transfers
const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function() {
  const transferMapId = this._newMapId;
  const transferX = this._newX;
  const transferY = this._newY;
  const wasTransferring = this.isTransferring();
  const fromMapId = $gameMap ? $gameMap.mapId() : null;

  _Game_Player_performTransfer.call(this);

  if (wasTransferring && $multiplayer && $multiplayer.isConnected) {
    if (transferMapId !== fromMapId) {
      $multiplayer.changeMap(transferMapId, transferX, transferY);
    } else {
      $multiplayer.movePlayer(this._x, this._y, transferMapId);
    }
  }
};
