/*globals Vector*/

/**
 * Main player in the game
 * @constructor
 * @param  {any} posVec - current position9
 */
function Player(posVec) {
    this.pos = posVec;
    this.size = new Vector(0.5, 0.5);
    this.coinCoolDownTimer = 1;
    this.lastDirection = {};

}
/**
 * Player action
 * @param  {World} world
 * @param  {Object} intentions
 */
Player.prototype.act = function (step, world, intentions) {
    this.move(step, world, intentions);
    this.throwCoin(step, world, intentions);
};

/**
 * move player on map
 * @param  {Number} step
 * @param  {World} world
 * @param  {object} intentions
 */
Player.prototype.move = function (step, world, intentions) {

    for (var dir in intentions) {
        if (intentions[dir] == true) {
            var newPos;

            if (dir == 'left') newPos = this.pos.add(Vector.directions.west.scale(this.playerSpeed * step));
            if (dir == 'right') newPos = this.pos.add(Vector.directions.east.scale(this.playerSpeed * step));
            if (dir == 'up') newPos = this.pos.add(Vector.directions.north.scale(this.playerSpeed * step));
            if (dir == 'down') newPos = this.pos.add(Vector.directions.south.scale(this.playerSpeed * step));

            if (newPos)
                if (!(world.handlingCollisions(newPos, this.size)))
                    this.pos = newPos;
        }
    }
};

Player.prototype.throwCoin = function (step, world, intentions) {
    if (this.coinCoolDownTimer > 0)
        this.coinCoolDownTimer -= step;

    if (intentions['drop'] && this.playerCoins > 0 && this.coinCoolDownTimer < 0) {
        var offset = new Vector(0, 0.5);
        var newPos = offset.add(this.pos);
        world.dropCoin(newPos);
        this.playerCoins--;
        this.coinCoolDownTimer = 1;

    }

};

Player.prototype.playerSpeed = 2.5;
Player.prototype.playerCoins = 10;