/*globals Vector, Coin, Item*/
function Coin(pos) {
    Item.call(this, pos, new Vector(0.2, 0.2));
    this.coolDown = 0.5;
}

Coin.prototype = Object.create(Item.prototype);
Coin.prototype.constructor = Coin;

Coin.prototype.act = function (step) {

    if (this.coolDown > 0) {
        this.coolDown -= step;
        this.pos = this.pos.add(new Vector(0, this._speed * step));
    }
};
Coin.prototype._speed = 4;


