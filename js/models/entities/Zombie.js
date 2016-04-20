/*globals Vector, Utils, AIEntity*/

/**
 * Zombie entity
 * @param  {Vector} position
 */
function Zombie(pos, pathFinder) {
    AIEntity.call(this, pos, new Vector(0.5, 0.5), pathFinder);
}

Zombie.prototype = Object.create(AIEntity.prototype);
Zombie.prototype.constructor = Zombie;

/**
 * Zombie behavior, calculate shortest path to player asynchronously
 * and move
 * 
 * @param  {number} step
 * @param  {World} world
 */
Zombie.prototype.act = function (step, world) {
    this.move(step, world);
};

/**
 * Move zombie using path-finding
 * @param  {number} step - time step
 * @param  {World} world
 * @param  {object} delta - direction of movement
 */
Zombie.prototype.move = function (step, world) {
    this.pathFindTo(step, world, world.player);
};

Zombie.prototype._speed = 2.3;