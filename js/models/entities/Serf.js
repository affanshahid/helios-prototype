/*globals AIEntity, Vector, Coin, Villager, Tool*/

/**
 * An idle serf
 * @param  {Vector} pos - position
 * @param  {object} pathFinder
 */
function Serf(pos, pathFinder) {
    AIEntity.call(this, pos, new Vector(0.35, 0.35), pathFinder);
}

Serf.prototype = Object.create(Villager.prototype);
Serf.prototype.constructor = Serf;
/**
 * Serf behavior
 * @param  {number} step
 * @param  {World} world
 */
Serf.prototype.act = function (step, world) {
    this.roamForItems(step, world, Tool);
};

Serf.prototype._radius = 1000;
Serf.prototype._speed = 0.8;