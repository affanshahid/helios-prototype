/*globals Vector*/

/**
 * Zombie entity
 * @param  {Vector} position
 */
function Zombie(pos, pathFinder) {
    this.pathFinder = pathFinder;
    this.pos = pos;
    this.size = new Vector(0.5, 0.5);
    this.speed = new Vector(0, 0);
}

Zombie.prototype.act = function (step, world) {
    var self = this;
    var x = Math.floor(this.pos.x);
    var y = Math.floor(this.pos.y);

    var px = Math.floor(world.player.pos.x);
    var py = Math.floor(world.player.pos.y);

    this.pathFinder.findPath(x, y, px, py, function (path) {
        if (path == null) {
            return;
        } else {
            var delta = new Vector(path[1].x - x, path[1].y - y);
            self.move(step, world, delta);
        }
    });
    this.pathFinder.calculate();
};

Zombie.prototype.move = function (step, world, delta) {
    var distanceToMove = step * this._speed;
    var newPos = this.pos.add(delta.scale(distanceToMove));
    if (!(world.handlingCollisions(newPos, this.size))) {
        this.pos = newPos;
    }
};

Zombie.prototype._speed = 1.3;