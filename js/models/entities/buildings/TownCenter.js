/*globals Building*/

function TownCenter(pos, size) {
    Building.call(this, pos, size);
}

TownCenter.prototype = Object.create(Building.prototype);
TownCenter.prototype.constructor = TownCenter;

