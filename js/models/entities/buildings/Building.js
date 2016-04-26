/*globals Entity*/

function Building(pos, size) {
    Entity.call(this, pos, size);
}

Building.prototype = Object.create(Entity.prototype);
Building.prototype.constructor = Building;
