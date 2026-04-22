Window_MenuCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    this.addFormationCommand();
    this.addOriginalCommands();
    this.addOptionsCommand();
    this.addSaveCommand();
    this.addGameEndCommand();
};

Window_MenuCommand.prototype.addMainCommands = function() {
    var enabled = this.areMainCommandsEnabled();
    if (this.needsCommand('item')) {
        this.addCommand('ไอเท็ม', 'item', enabled);
    }
    if (this.needsCommand('skill')) {
        this.addCommand('ทักษะ', 'skill', enabled);
    }
    if (this.needsCommand('equip')) {
        this.addCommand('อุปกรณ์', 'equip', enabled);
    }
    if (this.needsCommand('status')) {
        this.addCommand('สถานะ', 'status', enabled);
    }
};

Window_MenuCommand.prototype.addFormationCommand = function() {
    var oldEnabled = this.isFormationEnabled();
    if (this.needsCommand('formation')) {
        var enabled = oldEnabled;
        this.addCommand('การจัดแนวท่า', 'formation', enabled); // แปล 'formation' เป็น 'การจัดแนวท่า'
    }
};


Window_MenuCommand.prototype.addOptionsCommand = function() {
    var enabled = this.isOptionsEnabled();
    this.addCommand('ตัวเลือก', 'options', enabled);
};

Window_MenuCommand.prototype.addSaveCommand = function() {
    var enabled = this.isSaveEnabled();
    this.addCommand('บันทึก', 'save', enabled);
};

Window_MenuCommand.prototype.addGameEndCommand = function() {
    var enabled = this.isGameEndEnabled();
    this.addCommand('สิ้นสุดเกม', 'gameEnd', enabled);
};

// แก้ 'cancel' เป็น 'ยกเลิก' ทั้งในเมนู Option และ Save
Window_Options.prototype.makeCommandList = function() {
    this.addGeneralOptions();
    this.addVolumeOptions();
    this.addCommand('ยกเลิก', 'cancel');
};

Scene_File.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_SavefileList(0, 0);
    this._commandWindow.setHandler('ok', this.onSavefileOk.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};
