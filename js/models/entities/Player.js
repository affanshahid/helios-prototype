/*globals Vector*/

/**
 * Main player in the game
 * @constructor
 * @param  {any} posVec - current position
 */
function Player(posVec) {
    this.pos = posVec;
}
/**
 * Player action
 * @param  {World} world
 * @param  {Object} intentions
 */
Player.prototype.act = function(world, intentions) {
    for (var dir in intentions) {
        if (intentions[dir] == true) {
            this.pos = this.pos.add(this._directionMap[dir]);
        }
    }
};

/** Maps directions to actual vectors*/
Player.prototype._directionMap = {
    'up': new Vector(0, -1),
    'down': new Vector(0, 1),
    'left': new Vector(-1, 0),
    'right': new Vector(1, 0)
};