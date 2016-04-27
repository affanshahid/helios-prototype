/*globals Tool*/
function Sword(pos) {
    Tool.call(this, pos);
}

Sword.prototype = Object.create(Tool.prototype);
Sword.prototype.constructor = Sword;