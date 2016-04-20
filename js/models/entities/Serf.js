/*globals AIEntity, Vector, Coin*/

/**
 * An idle serf
 * @param  {Vector} pos - position
 * @param  {object} pathFinder
 */
function Serf(pos, pathFinder) {
    AIEntity.call(this, pos, new Vector(0.35, 0.35), pathFinder);
    this.cooldown = 0;
}

Serf.prototype = Object.create(AIEntity.prototype);
Serf.prototype.constructor = Serf;
/**
 * Serf behavior
 * @param  {number} step
 * @param  {World} world
 */
Serf.prototype.act = function (step, world) {

};