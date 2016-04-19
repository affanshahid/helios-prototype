/*globals Vector*/

/**
 * Main player in the game
 * @constructor
 * @param  {any} posVec - current position9
 */
function Player(posVec) {
    this.pos = posVec;
    this.size = new Vector(0.5, 0.5);
    this.speed = new Vector(0, 0);
    this.coinCoolDownTimer = 1;
    this.coinCollectingTimer=3;
    this.lastDirection = {};
    this.collectibles = ['Coin'];

}
/**
 * Player action
 * @param  {World} world
 * @param  {Object} intentions
 */
Player.prototype.act = function(step, world, intentions) {
    this.move(step, world, intentions);
    this.throwCoin(step, world, intentions);
    this.collectCoin(world,step);
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
            if (dir == 'drop');
            else
                if (!(world.handlingCollisions(newPos, this.size)))
                    this.pos = newPos;
                else this.pos = oldPos;
        }
    }
};

Player.prototype.throwCoin = function(step, world, intentions) {
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
Player.prototype.collectCoin = function(world,step) {
    
   
    world.entities.forEach(function(entity,index) {
        if(entity.constructor.name=="Coin" ) {
           if (this.pos.x + this.size.x > entity.pos.x &&
            this.pos.x < entity.pos.x + entity.size.x &&
            this.pos.y + this.size.y > entity.pos.y &&
            this.pos.y < entity.pos.y + entity.size.y && entity.coolDown <0)
            {   
                world.entities.splice(index,1);
                this.playerCoins++;
                this.coinCollectingTimer=3;
               
        }            }
    },this);

  
};
Player.prototype.playerSpeed = 2.5;
Player.prototype.playerCoins = 10;