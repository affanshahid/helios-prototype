/*globals Vector, Entity, Coin*/

/**
 * Main player in the game
 * @constructor
 * @param  {any} posVec - current position9
 */
function Player(posVec) {
    Entity.call(this, posVec, new Vector(0.5, 0.5));
    this.coinCoolDownTimer = 1;
    this.coinCollectingTimer = 3;
    this.lastDirection = {};
    this.collectibles = ['Coin'];

}

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;
/**
 * Player action
 * @param  {World} world
 * @param  {Object} intentions
 */
Player.prototype.act = function (step, world, intentions) {
    this.move(step, world, intentions);
    this.throwCoin(step, world, intentions);
    this.collectCoin(world, step);
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
Player.prototype.collectCoin = function (world, step) {
    world.entities.forEach(function (entity, index) {
        if (entity instanceof Coin) {
            if (this.pos.x + this.size.x > entity.pos.x &&
                this.pos.x < entity.pos.x + entity.size.x &&
                this.pos.y + this.size.y > entity.pos.y &&
                this.pos.y < entity.pos.y + entity.size.y && entity.coolDown < 0) {
                world.entities.splice(index, 1);
                this.playerCoins++;
                this.coinCollectingTimer = 3;

            }
        }
    }, this);
};

Player.prototype.playerSpeed = 2.5;
Player.prototype.playerCoins = 10;