/*globals Building, Sword, Coin, Vector*/

function Barracks(pos) {
    Building.call(this, pos, new Vector(2, 2));
}

Barracks.prototype = Object.create(Building.prototype);
Barracks.prototype.constructor = Barracks;

Barracks.prototype.collided = function (world, entity) {
    if (entity instanceof Coin) {
        this._dropTool(Sword, world);
    }
};