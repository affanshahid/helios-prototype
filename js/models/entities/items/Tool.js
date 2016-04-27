/*globals Vector, Item*/
function Tool(pos) {
    Item.call(this, pos, new Vector(0.3, 0.3));
    this.coolDown = 0.2;
}

Tool.prototype = Object.create(Item.prototype);
Tool.prototype.constructor = Tool;

Tool.prototype.act = function (step) {

    if (this.coolDown > 0) {
        this.coolDown -= step;
        this.pos = this.pos.add(new Vector(0, this._speed * step));
    }
};
Tool.prototype._speed = 4;