/*:
 * @plugindesc เปลี่ยนความเร็วการเคลื่อนที่เริ่มต้นของผู้เล่นโดยไม่ต้องกดปุ่ม Shift
 * @help ปลั๊กอินนี้ไม่มีคำสั่งปลั๊กอินให้ใช้งาน
 */

(function() {
    var _Game_Player_realMoveSpeed = Game_Player.prototype.realMoveSpeed;
    
    Game_Player.prototype.realMoveSpeed = function() {
        var speed = _Game_Player_realMoveSpeed.call(this);
        if (Input.isPressed('shift')) {
            return speed - 0.2; // ลดความเร็วเมื่อกดปุ่ม Shift
        } else {
            return speed + 0.25; // เพิ่มความเร็วเมื่อไม่กดปุ่ม Shift
        }
    };
})();
