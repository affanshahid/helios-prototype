/*globals Entity, Vector*/

function Building(pos, size) {
    Entity.call(this, pos, size);
}

Building.prototype = Object.create(Entity.prototype);
Building.prototype.constructor = Building;

Building.prototype._dropTool = function (Tool, world) {
    var offset = new Vector(0, 0.5);
    var start = new Vector(this.pos.x + this.size.x/2, this.pos.y + this.size.y);
    var newPos = offset.add(start);
    world.dropItem(newPos, Tool);
};

Building.prototype.collided = function (world, entity) {

};