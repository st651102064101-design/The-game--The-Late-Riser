//============================================================================
// EliMZ_Switches.js
//============================================================================

/*:
@target MZ

@plugindesc ♦5.0.1♦ Adds extra features for the default switches.
@author Hakuen Studio 
@url https://hakuenstudio.itch.io/eli-devswitches-rpg-maker-mv

@help
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
If you like my work, please consider supporting me on Patreon!
Patreon      → https://www.patreon.com/hakuenstudio
Terms of Use → https://www.hakuenstudio.com/terms-of-use-5-0-0
Facebook     → https://www.facebook.com/hakuenstudio
Instagram    → https://www.instagram.com/hakuenstudio
Twitter      → https://twitter.com/hakuen_studio
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
============================================================================
Requirements
============================================================================

Nedd Eli Book.
Order After Eli Book.

============================================================================
Features
============================================================================

● Advanced plugin command to manage switches.
● Global switches that have his values working across save files.
● Optionally, automatically turns the specified switches on and off 
according to the conditions below:

• Is in Test mode (Whether in battle, event, or normal).
• If the game is running on a mobile device.
• If the game is running from a Desktop.
• If the game is running on an android.
• If the game is running on an iPhone.
• If the game has any save file.
• If the player is in any vehicle.
• If the player is on an airship.
• If the player is in a boat.
• If the player is on a ship.
• If there is any change in the weather.
• If it is raining.
• If it is snowing.
• If it is raining heavily (storm).
• If the player is on a tile that inflicts damage.¹
• If the player is running.
• If the player is in a bush.¹
• If the player is on a ladder.¹
• If the player is in motion.
• If the message window is open.
• If the choice window is open.
• If the number entry window is open.
• If the item selection window is open (from the map).
• If the timer is active.²
¹ It is necessary to configure the tileset.
² When it reaches zero, the switch turns off.

============================================================================
How to use
============================================================================

https://docs.google.com/document/d/1msZdUWK4JDpRwxgzeFhGXjK5HWWe_VjQyo4S4y7sFCI/edit?usp=sharing

============================================================================
Global Switches
============================================================================

• You can set regular switches to have their values persistent across 
save files.
To do that, you just need to insert "GD:", without quotes, not 
case-sensitive, on the switch name.
GD means GLOBAL DATA.

============================================================================
Plugin parameters
============================================================================

● Update Method → There are two ways for the plugin to work:

• Update as needed → The switches are turned on and off automatically only 
when something related to them happens. For example, when entering a 
vehicle the plugin will identify which vehicle it is and activate the 
switch for that vehicle. And when you leave it, the switch will turn off.

• Always update → At each time interval (frames) specified in the 
"Update interval" parameter, the plugin will check all switches and turn 
on or off each one depending on the condition of each one.
For example, regardless of whether the player enters or exits the vehicle, 
the plugin will be updating the corresponding switches at each time 
interval.

• None → It will do nothing. Will not auto-update the switches in any way.

If you happen to experience any incompatibility with other plugins, try 
switching between versions.

============================================================================
Plugin Commands MV
============================================================================

ChangeSw Id Operation Delay TimeUnit Script
• ID → Replace with the switch ID.
• Operation → Replace with true, false, or toggle.
• Delay → Replace with a number. It will delay that amount of times, 
according to the Time Unit.
• TimeUnit → Replace with frames, seconds, or minutes.
• Script → A script call that will be used to change the switch value.

============================================================================
Plugin Commands MZ
============================================================================

Operations → Let you manage switches in a more advanced way.
You can toggle values, change more than one switch, or even a range of 
switches ids.
Can set a delay to change the value of switches.
Can also change the switch values based on a script call.

============================================================================
Multiple operators
============================================================================

You can also set multiple entries separating them by comma(,) or double 
trace(--) when you want to get a range of numbers(without any blank space).

Exemple: Selecting multiple ids:
● 1,2,\v[3],4--8,9

The command will be applied for IDs 1, and 2, the value of the 
variables 3, and 4,5,6,7,8,9.

As you can see the "--" is like a range operator. It will get all numbers 
between(and including) the 4 and 8.

============================================================================
Script Calls
============================================================================

Let you manage switches in a more advanced way.

const args = {
    id: 25,
    value: "false",
    script: "",
    delay: 0,
    unit: "frames",
}
Eli.Switches.cmd_operation(args)

• value → Put one of the following: "true", "false", "toggle".
• script → Put a script call here, or leave it as "" to not use.
• delay → Put a number.
• unit → Replace with the following: "frames", "seconds", "minutes".
• id → Put a single number or multiple ones.

NOTE¹: The script has priority over the value.

============================================================================
Update Log
============================================================================

https://tinyurl.com/switchesLog

============================================================================

@command cmd_operation
@text Operations
@desc Operate switches

    @arg id
    @text Switch
    @type switch
    @desc For multiple ones, go to the text tab and separate each one with a comma. For a range, separate by trace "-".
    @default 0

    @arg value
    @text Default Value
    @type select
    @option true
    @option false
    @option toggle
    @desc Choose either false, true or toogle.
    @default true

    @arg script
    @text Script Value
    @type note
    @desc Change the value of a switch based on script call. Leave empty to use default value. "this" refers to the event.
    @default
    @parent value

    @arg delay
    @text Delay value
    @type text
    @desc Set a time delay for the switch to change. Leave at zero for instant.
    @default 0

    @arg unit
    @text Delay Unit
    @type select
    @option frames
    @option seconds
    @option minutes
    @desc Choose the unit that will be applied to the delay.
    @default frames
    @parent delay

@param updateMethod
@text Update method
@type select
@desc Select how do you want the plugin to work. None, it will do nothing.
@option Always update
@option Update as needed
@option None
@default Update as needed

@param wait
@text Time for update
@type number
@desc Choose the time interval for the switches to update. Only work with the Always update version.
@default 60

@param player
@text Player Switches
@type struct<gamePlayer>
@desc Player-related switches.
@default {"boat":"0","ship":"0","airship":"0","vehicle":"0","dashing":"0","moving":"0","damageFloor":"0","ladder":"0","bush":"0"}

@param system
@text System Switches
@type struct<gameSystem>
@desc System-related switches.
@default {"playtest":"0","mobile":"0","desktop":"0","android":"0","iphone":"0","hasSave":"0"}

@param screen
@text Screen Switches
@type struct<gameScreen>
@desc Screen related switches.
@default {"raining":"0","storming":"0","snowing":"0","weather":"0","timer":"0"}

@param windows
@text Windows Switches
@type struct<gameWindows>
@desc Window-related switches.
@default {"message":"0","choice":"0","numberInput":"0","itemChoice":"0"}

*/

/* ----------------------------- PLAYER SWITCHES ---------------------------- */
{
/*~struct~gamePlayer:

@param boat
@text Is in Boat
@type switch
@desc Select a switch from the database list.
@default 0

@param ship
@text Is inShip
@type switch
@desc Select a switch from the database list.
@default 0

@param airship
@text Is in Airship
@type switch
@desc Select a switch from the database list.
@default 0

@param vehicle
@text Any vehicle
@type switch
@desc Select a switch from the database list.
@default 0

@param dashing
@text Is Dashing
@type switch
@desc Select a switch from the database list.
@default 0

@param moving
@text Is Moving
@type switch
@desc Select a switch from the database list.
@default 0

@param damageFloor
@text Is on Damage floor
@type switch
@desc Select a switch from the database list.
@default 0

@param ladder
@text IS on Ladder
@type switch
@desc Select a switch from the database list.
@default 0

@param bush
@text Is on bush
@type switch
@desc Select a switch from the database list.
@default 0

*/
}

/* ----------------------------- SYSTEM SWITCHES ---------------------------- */
{
/*~struct~gameSystem:

@param playtest
@text Is Playtest
@type switch
@desc Select a switch from the database list.
@default 0

@param mobile
@text Is any mobile
@type switch
@desc Select a switch from the database list.
@default 0

@param desktop
@text Is desktop
@type switch
@desc Select a switch from the database list.
@default 0

@param android
@text Is Android
@type switch
@desc Select a switch from the database list.
@default 0

@param iphone
@text Is Iphone
@type switch
@desc Select a switch from the database list.
@default 0

@param hasSave
@text Has save file
@type switch
@desc This switch will be on if exists a save file.
@default 0

*/
}

/* ----------------------------- SCREEN SWITCHES ---------------------------- */
{
/*~struct~gameScreen:

@param raining
@text Is raining
@type switch
@desc Select a switch from the database list.
@default 0

@param storming
@text Is storming
@type switch
@desc Select a switch from the database list.
@default 0

@param snowing
@text Is Snowing
@type switch
@desc Select a switch from the database list.
@default 0

@param weather
@text Is any weather
@type switch
@desc Select a switch from the database list.
@default 0

@param timer
@text Is timer working
@type switch
@desc Select a switch from the database list.
@default 0

*/
}

/* ---------------------------- WINDOWS SWITCHES ---------------------------- */
{
/*~struct~gameWindows:

@param message
@text Is msg open
@type switch
@desc Select a switch from the database list.
@default 0

@param choice
@text Is choice open
@type switch
@desc Select a switch from the database list.
@default 0

@param numberInput
@text Is number input open
@type switch
@desc Select a switch from the database list.
@default 0

@param itemChoice
@text Is select item open
@type switch
@desc Select a switch from the database list.
@default 0

*/
}

"use strict"

var Eli = Eli || {}
var Imported = Imported || {}
Imported.Eli_Switches = true

/* ========================================================================== */
/*                                    ALERT                                   */
/* ========================================================================== */
{
const pluginName = "Eli Switches"
const requiredVersion = 5.30
const messageVersion = "5.3.0"

if(!Eli.Book){

    const msg = `${pluginName}:\nYou are missing the core plugin: Eli Book.\nPlease, click ok to download it now.`
    if(window.confirm(msg)){
        nw.Shell.openExternal("https://hakuenstudio.itch.io/eli-book-rpg-maker-mv-mz")
    }

}else if(Eli.Book.version < requiredVersion){

    const msg = `${pluginName}:\nYou need Eli Book version ${messageVersion} or higher.\nPlease, click ok to download it now.`
    if(window.confirm(msg)){
        nw.Shell.openExternal("https://hakuenstudio.itch.io/eli-book-rpg-maker-mv-mz")
    }
}

}

/* ========================================================================== */
/*                                   PLUGIN                                   */
/* ========================================================================== */
{

Eli.Switches = {

    version: 5.01,
    url: "https://hakuenstudio.itch.io/eli-devswitches-rpg-maker-mv",
    alias: {},
    parameters: {
        updateMethod: "Update as needed",
        wait: 0,
        player: {
            boat: 0, ship: 0, airship: 0, vehicle: 0, dashing: 0, 
            moving: 0, damageFloor: 0, ladder:0, bush: 0
        },
        system: {
            playtest: 0, mobile: 0, desktop: 0, android: 0, iphone: 0, hasSave: 0,
        },
        screen: {
            raining: 0, storming: 0, snowing: 0, weather: 0, timer: 0
        },
        windows: {
            message: 0, choice: 0, numberInput: 0, itemChoice: 0
        },
    },
    checkWeather: false,

    initialize(){
        this.initParameters()
        this.initPluginCommands()
    },

    initParameters(){
        const parameters = PluginManager.parameters("EliMZ_Switches")
        this.parameters = parameters
        this.parameters.wait = Number(this.parameters.wait)
        this.parseParamSwitches("player")
        this.parseParamSwitches("system")
        this.parseParamSwitches("screen")
        this.parseParamSwitches("windows")
    },

    parseParamSwitches(type){
        this.parameters[type] = JSON.parse(this.parameters[type])
        for(const param in this.parameters[type]){
            this.parameters[type][param] = Number(this.parameters[type][param])
        }
    },

    initPluginCommands(){
        const commands = ["cmd_operation"]
        Eli.PluginManager.registerCommands(this, commands)
    },

    param(){
        return this.parameters
    },

    processValue(valueType, id){
        if(valueType === "toggle"){
            return !$gameSwitches.value(id)

        }else{
            return valueType === "true"
        }
    },

    getTimeOut(timeUnit, delay){
        const timeValue = Number(delay)
        switch(timeUnit){
            case "frames": return Eli.Date.framesToMiliSeconds(timeValue)
            case "seconds": return timeValue * 1000
            case "minutes": return timeValue * 60 * 1000
        }
    },

    processEval(str){
        const func = new Function(`return ${str}`).bind(Eli.PluginManager.currentInterpreter || window)
        return func()
    },

    cmd_operation(args){
        if(Number(args.delay) > 0){
            this.operateWithDelay(args)
        }else{
            this.operateSwitchChange(args)
        }
    },

    operateWithDelay(args){
        const ms = this.getTimeOut(args.unit, args.delay)
        setTimeout(this.operateSwitchChange.bind(this, args), ms)
    },

    operateSwitchChange(args){
        const switchesId = Eli.PluginManager.createRangeOfNumbers(args.id)
        let str = args.script ? JSON.parse(args.script) : ""
        
        for(const id of switchesId){
            const value = str ? this.processEval(str) : this.processValue(args.value, id)
            $gameSwitches.setValue(id, value)
        }
    },

    executePluginCommandMV(args){
        const [id, value, delay = "0", unit = "seconds"] = args
        if(args.length >= 4){
            var script = args.slice(4).join(" ")
        }else{
            var script = ""
        }
        const objArgs = {
            id: id,
            value: value.toLowerCase(),
            delay: delay,
            unit: unit,
            script: script,
        }
        this.cmd_operationMV(objArgs)
    },

    cmd_operationMV(args){
        if(Number(args.delay) > 0){
            this.operateWithDelay(args)
        }else{
            this.operateSwitchChangeMV(args)
        }
    },

    operateSwitchChangeMV(args){
        const switchesId = Eli.PluginManager.createRangeOfNumbers(String(args.id))
        let str = args.script || ""
        
        for(const id of switchesId){
            const value = str.length > 0 ? this.processEval(str) : this.processValue(args.value, id)

            $gameSwitches.setValue(id, value)
        }
    },

}

const Plugin = Eli.Switches
const Alias = Eli.Switches.alias

Plugin.initialize()

/* ----------------------------- CONFIG MANAGER ----------------------------- */
{

ConfigManager.globalSwitches = []

Alias.ConfigManager_makeData = ConfigManager.makeData
ConfigManager.makeData = function() {
    const config = Alias.ConfigManager_makeData.call(this)
    config.globalSwitches = this.globalSwitches
    return config
}

Alias.ConfigManager_applyData = ConfigManager.applyData
ConfigManager.applyData = function(config) {
    Alias.ConfigManager_applyData.call(this, config)
    this.globalSwitches = this.readGlobalSwitches(config)
}

ConfigManager.readGlobalSwitches = function(config) {
    if(!config.hasOwnProperty("globalSwitches")){
        config.globalSwitches = []
    }
    const switches = config.globalSwitches
    switches.forEach((element, index) => {
        const switchName = $dataSystem.switches[index].toUpperCase()
        if(!switchName.includes("GD:")){
            delete switches[index]
        }
    })
    return switches  
}

}

/* ------------------------------ GAME SWITCHES ----------------------------- */
{

Alias.Game_Switches_initialize = Game_Switches.prototype.initialize
Game_Switches.prototype.initialize = function() {
    Alias.Game_Switches_initialize.call(this)
    this.timeForUpdate = 0
}

Alias.Game_Switches_value = Game_Switches.prototype.value
Game_Switches.prototype.value = function(switchId) {
    return !!ConfigManager.globalSwitches[switchId] || Alias.Game_Switches_value.call(this, switchId)
}

Alias.Game_Switches_setValue = Game_Switches.prototype.setValue
Game_Switches.prototype.setValue = function(switchId, value) {
    if(this.isGlobalSwitch(switchId)){
        ConfigManager.globalSwitches[switchId] = value
        ConfigManager.save()
    }
    Alias.Game_Switches_setValue.call(this, switchId, value)
}

Game_Switches.prototype.isGlobalSwitch = function(switchId = 0){
    return $dataSystem.switches[switchId].toUpperCase().includes("GD:")
}

Game_Switches.prototype.changeVehicleSwitches = function(){
    const {boat, ship, airship, vehicle} = Plugin.param().player

    this.setValue(boat, $gamePlayer.isInBoat())
    this.setValue(ship, $gamePlayer.isInShip())
    this.setValue(airship, $gamePlayer.isInAirship())
    this.setValue(vehicle, $gamePlayer.isInVehicle())
}

Game_Switches.prototype.changePlayerSwitches = function(){
    const {dashing, moving, damageFloor, ladder, bush} = Plugin.param().player

    this.setValue(dashing, $gamePlayer.isDashing())
    this.setValue(moving, $gamePlayer.isMoving())
    this.setValue(damageFloor, $gamePlayer.isOnDamageFloor())
    this.setValue(ladder, $gamePlayer.isOnLadder())
    this.setValue(bush, $gamePlayer.isOnBush())
}

Game_Switches.prototype.changeSystemSwitches = function(){
    const {playtest, mobile, desktop, android, iphone, hasSave} = Plugin.param().system

    this.setValue(playtest, $gameTemp.isPlaytest())
    this.setValue(mobile, Utils.isMobileDevice())
    this.setValue(desktop, Utils.isNwjs())
    this.setValue(android, Utils.isAndroidChrome())
    this.setValue(iphone, Utils.isMobileSafari())
    this.setValue(hasSave, DataManager.isAnySavefileExists())
}

Game_Switches.prototype.changeWeatherSwitches = function(){
    const {raining, storming, snowing, weather} = Plugin.param().screen

    this.setValue(raining, $gameScreen.weatherType() === 'rain')
    this.setValue(storming, $gameScreen.weatherType() === 'storm')
    this.setValue(snowing, $gameScreen.weatherType() === 'snow')
    this.setValue(weather, $gameScreen.weatherType() !== 'none')
}

Game_Switches.prototype.changeWindowSwitches = function(){
    const {message, choice, numberInput, itemChoice} = Plugin.param().windows

    this.setValue(message, $gameMessage.isBusy())
    this.setValue(choice, $gameMessage.isChoice())
    this.setValue(numberInput, $gameMessage.isNumberInput())
    this.setValue(itemChoice, $gameMessage.isChoice())
}

}

/* ========================================================================== */
/*                                ALWAYS UPDATE                               */
/* ========================================================================== */

if(Plugin.param().updateMethod === "Always update") {

Game_Switches.prototype.update = function(){
    this.timeForUpdate++

    if(this.timeForUpdate > Plugin.param().wait){
        this.changeVehicleSwitches()
        this.changeSystemSwitches()
        this.changePlayerSwitches()
        this.changeWeatherSwitches()
        if(!Imported.Eli_SuperTimer || !Imported.Eli_Timer){
            this.setValue(Plugin.param().screen.timer, $gameTimer.isWorking())
        }
        this.changeWindowSwitches()
        this.timeForUpdate = 0
    }
}

Alias.Scene_Map_update = Scene_Map.prototype.update
Scene_Map.prototype.update = function() {
    Alias.Scene_Map_update.call(this)
    $gameSwitches.update()
}

Alias.Scene_Battle_update = Scene_Battle.prototype.update
Scene_Battle.prototype.update = function(){
    Alias.Scene_Battle_update.call(this)
    $gameSwitches.update()
}
} // End IF "Always update"

/* ========================================================================== */
/*                              UPDATE AS NEEDED                              */
/* ========================================================================== */

if(Plugin.param().updateMethod === "Update as needed"){

/* ------------------------------ DATA MANAGER ------------------------------ */
{

Alias.DataManager_setupNewGame = DataManager.setupNewGame
DataManager.setupNewGame = function() {
    Alias.DataManager_setupNewGame.call(this)
    $gameSwitches.changeSystemSwitches()
}

Alias.DataManager_setupBattleTest = DataManager.setupBattleTest
DataManager.setupBattleTest = function() {
    Alias.DataManager_setupBattleTest.call(this)
    $gameSwitches.changeSystemSwitches()
}

Alias.DataManager_setupEventTest = DataManager.setupEventTest
DataManager.setupEventTest = function() {
    Alias.DataManager_setupEventTest.call(this)
    $gameSwitches.changeSystemSwitches()
}

Alias.DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue
DataManager.loadGameWithoutRescue = function(savefileId) {
    const alias = Alias.DataManager_loadGameWithoutRescue.call(this, savefileId)
    $gameSwitches.changeSystemSwitches()

    return alias
}

}

/* ------------------------------ GAME VEHICLE ------------------------------ */
{

Alias.Game_Vehicle_getOn = Game_Vehicle.prototype.getOn
Game_Vehicle.prototype.getOn = function() {
    Alias.Game_Vehicle_getOn.call(this)
    this.switchesChangesOnGetOn()
}

Game_Vehicle.prototype.switchesChangesOnGetOn = function() {
    const switches = $gameSwitches
    const {boat, ship, airship, vehicle} = Plugin.param().player

    switches.setValue(boat, $gamePlayer.isInBoat())
    switches.setValue(ship, $gamePlayer.isInShip())
    switches.setValue(airship, $gamePlayer.isInAirship())
    switches.setValue(vehicle, true)
}

Alias.Game_Vehicle_getOff = Game_Vehicle.prototype.getOff
Game_Vehicle.prototype.getOff = function() {
    Alias.Game_Vehicle_getOff.call(this)
    this.switchesChangesOnGetOff()
}

Game_Vehicle.prototype.switchesChangesOnGetOff = function() {
    const switches = $gameSwitches
    const {boat, ship, airship, vehicle} = Plugin.param().player

    if($gamePlayer.isInBoat()) {
        switches.setValue(boat, false)
    }

    if($gamePlayer.isInShip()) {
        switches.setValue(ship, false)
    }

    if($gamePlayer.isInAirship()) {
        switches.setValue(airship, false)
    }

    switches.setValue(vehicle, false)
}

}

/* ------------------------------- GAME PLAYER ------------------------------ */
{

Alias.Game_Player_isDashing = Game_Player.prototype.isDashing
Game_Player.prototype.isDashing = function() {
    const alias = Alias.Game_Player_isDashing.call(this)
    $gameSwitches.setValue(Plugin.param().player.dashing, alias)

    return alias
}

Alias.Game_Player_isOnDamageFloor = Game_Player.prototype.isOnDamageFloor;
Game_Player.prototype.isOnDamageFloor = function() {
    const alias = Alias.Game_Player_isOnDamageFloor.call(this)
    $gameSwitches.setValue(Plugin.param().player.damageFloor, alias)

    return alias
}

Alias.Game_Player_isOnLadder = Game_Player.prototype.isOnLadder;
Game_Player.prototype.isOnLadder = function() {
    const alias = Alias.Game_Player_isOnLadder.call(this)
    $gameSwitches.setValue(Plugin.param().player.ladder, alias)

    return alias
}

Alias.Game_Player_isOnBush = Game_Player.prototype.isOnBush
Game_Player.prototype.isOnBush = function() {
    const alias = Alias.Game_Player_isOnBush.call(this)
    $gameSwitches.setValue(Plugin.param().player.bush, alias)

    return alias
}

Alias.Game_Player_update = Game_Player.prototype.update
Game_Player.prototype.update = function(sceneActive) {
    Alias.Game_Player_update.call(this, sceneActive)
    $gameSwitches.setValue(Plugin.param().player.moving, !this.checkStop(0))
}

}
    
/* ------------------------------- GAME SCREEN ------------------------------ */
{

Alias.Game_Screen_clearWeather = Game_Screen.prototype.clearWeather;
Game_Screen.prototype.clearWeather = function() {
    Alias.Game_Screen_clearWeather.call(this)

    if(Plugin.checkWeather){
        $gameSwitches.changeWeatherSwitches()
        Plugin.checkWeather = false
    }
}

Alias.Game_Screen_changeWeather = Game_Screen.prototype.changeWeather
Game_Screen.prototype.changeWeather = function(type, power, duration) {
    Alias.Game_Screen_changeWeather.call(this, type, power, duration)
    $gameSwitches.changeWeatherSwitches()
    Plugin.checkWeather = !Plugin.checkWeather
}

}
    
/* ------------------------------- GAME TIMER ------------------------------- */
if(!Imported.Eli_SuperTimer || !Imported.Eli_Timer){ //If Super Timer is imported, don't do this.

Alias.Game_Timer_start = Game_Timer.prototype.start
Game_Timer.prototype.start = function(count) {
    Alias.Game_Timer_start.call(this, count)
    $gameSwitches.setValue(Plugin.param().screen.timer, true)
}

Alias.Game_Timer_stop = Game_Timer.prototype.stop
Game_Timer.prototype.stop = function() {
    Alias.Game_Timer_stop.call(this)
    $gameSwitches.setValue(Plugin.param().screen.timer, false)
}

Alias.Game_Timer_onExpire = Game_Timer.prototype.onExpire
Game_Timer.prototype.onExpire = function() {
    Alias.Game_Timer_onExpire.call(this)
    $gameSwitches.setValue(Plugin.param().screen.timer, false)
}

}

/* ------------------------------ GAME MESSAGE ------------------------------ */
{

Alias.Game_Message_hasText = Game_Message.prototype.hasText
Game_Message.prototype.hasText = function() {
    const alias = Alias.Game_Message_hasText.call(this)
    $gameSwitches.setValue(Plugin.param().windows.message, alias)

    return alias
}

Alias.Game_Message_isChoice = Game_Message.prototype.isChoice
Game_Message.prototype.isChoice = function() {
    const alias = Alias.Game_Message_isChoice.call(this)
    $gameSwitches.setValue(Plugin.param().windows.choice, alias)

    return alias
}

Alias.Game_Message_isNumberInput = Game_Message.prototype.isNumberInput
Game_Message.prototype.isNumberInput = function() {
    const alias = Alias.Game_Message_isNumberInput.call(this)
    $gameSwitches.setValue(Plugin.param().windows.numberInput, alias)

    return alias
}

Alias.Game_Message_isItemChoice = Game_Message.prototype.isItemChoice
Game_Message.prototype.isItemChoice = function() {
    const alias = Alias.Game_Message_isItemChoice.call(this)
    $gameSwitches.setValue(Plugin.param().windows.itemChoice, alias)

    return alias
}

}
    
} // End IF "Update as need"

/* ----------------------------- PLUGIN COMMANDS ---------------------------- */
{

Alias.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args){
    Alias.Game_Interpreter_pluginCommand.call(this, command, args)
    if(command.toUpperCase() === "CHANGESW"){
        Plugin.executePluginCommandMV(args)
    }
}

}

}