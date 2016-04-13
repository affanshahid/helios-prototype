/*globals Vector*/

/**
 * Main player in the game
 * @constructor
 * @param  {any} posVec - current position
 */
function Player(posVec) {
    this.pos = posVec;
    this.size = new Vector(0.5, 0.5);
    this.speed = new Vector(0, 0);

}
/**
 * Player action
 * @param  {World} world
 * @param  {Object} intentions
 */
Player.prototype.act = function(step, world, intentions) {
    this.move(step, world, intentions);
};

/**
 * move player on map
 * @param  {Number} step
 * @param  {World} world
 * @param  {Object} intentions
 */
Player.prototype.move = function(step, world, intentions) {

    for (var dir in intentions) {
        if (intentions[dir] == true) {
            var oldPos = this.pos;
            var newPos;
            if (dir == 'left') newPos = this.pos.minus(new Vector(this.playerSpeed * step, 0));
            if (dir == 'right') newPos = this.pos.add(new Vector(this.playerSpeed * step, 0));
            if (dir == 'up') newPos = this.pos.minus(new Vector(0, this.playerSpeed * step));
            if (dir == 'down') newPos = this.pos.add(new Vector(0, this.playerSpeed * step));

            if (!(world.handlingCollisions(newPos, this.size)))
                this.pos = newPos;
            else this.pos = oldPos;

        }
    }

};

Player.prototype.playerSpeed = 2.5;