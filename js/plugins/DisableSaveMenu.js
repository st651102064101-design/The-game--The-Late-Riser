

(function() {
    var _Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
    Window_MenuCommand.prototype.addMainCommands = function() {
        _Window_MenuCommand_addMainCommands.call(this);
        this.removeCommand(TextManager.save);
    };
})();
