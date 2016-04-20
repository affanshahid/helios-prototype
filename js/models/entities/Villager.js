/*globals AIEntity, Vector, Coin*/

/**
 * An idle villager, ready to be converted to a serf
 * @param  {Vector} pos - position
 * @param  {object} pathFinder
 */
function Villager(pos, pathFinder) {
    AIEntity.call(this, pos, new Vector(0.35, 0.35), pathFinder);
    this.cooldown = 0;
}

Villager.prototype = Object.create(AIEntity.prototype);
Villager.prototype.constructor = Villager;
/**
 * Villager behavior, attempt to move and collect coin and transform if able
 * @param  {number} step
 * @param  {World} world
 */
Villager.prototype.act = function (step, world) {
    this.move(step, world);
    this.collectCoin(world);
};


/**
 * Attempt to move to closest coin or random spot within radius
 * @param  {number} step
 * @param  {World} world
 */
Villager.prototype.move = function (step, world) {
    var foundCoins = this._lookupCoins(world);
    if (foundCoins.length <= 0) {
        if (!this.goal)
            this.goal = this._genRandomSpot(world);
    } else {
        this.goal = this._getClosest(foundCoins);
    }

    if (this.goal) {
        this.pathFindTo(step, world, this.goal);
        if (this.goal && Math.abs(this.pos.x - this.goal.x) < 0.1 && Math.abs(this.pos.y - this.goal.y) < 0.1)
            this.goal = null;
    }
};

/**
 * If possible generates and returns random spot within radius
 * @param  {World} world
 */
Villager.prototype._genRandomSpot = function (world) {
    var startY = Math.max(0, this.pos.y - this._radius);
    var endY = Math.min(this.pos.y + this._radius, world.grid.length - 1);

    var startX = Math.max(0, this.pos.x - this._radius);
    var endX = Math.min(this.pos.x + this._radius, world.grid[0].length - 1);

    //attempt to find a viable destination, max attempts 10
    var maxAttempts = 10;
    for (var i = 0; i < maxAttempts; i++) {
        var xRand = Math.floor(Math.floor(Math.random() * (endX - startX + 1)) + startX);
        var yRand = Math.floor(Math.floor(Math.random() * (endY - startY + 1)) + startY);
        var spot = world.grid[yRand][xRand];
        if (world.obstacles.indexOf(spot) == -1)
            return new Vector(xRand, yRand);
    }
    return null;

};

/**
 * Return list of coins that are in radius
 * @param  {World} world
 */
Villager.prototype._lookupCoins = function (world) {
    var startY = Math.max(0, this.pos.y - this._radius);
    var endY = Math.min(this.pos.y + this._radius, world.grid.length - 1);

    var startX = Math.max(0, this.pos.x - this._radius);
    var endX = Math.min(this.pos.x + this._radius, world.grid[0].length - 1);

    return world.entities.filter(function (entity) {
        return entity instanceof Coin && entity.pos.x >= startX && entity.pos.x <= endX
            && entity.pos.y >= startY && entity.pos.y <= endY;
    });
};

/**
 * Get closest entity from list
 * @param  {Array} entityList
 */
Villager.prototype._getClosest = function (entityList) {
    var self = this;
    return entityList.reduce(function (prev, cur) {
        var distToCur = self.pos.distanceTo(cur.pos);
        var distToPrev = self.pos.distanceTo(prev.pos);
        return distToCur < distToPrev ? cur : prev;
    });
};

Villager.prototype.collectCoin = function (world) {
    var self = this;
    world.entities.forEach(function (entity, index) {
        if (entity instanceof Coin) {
            if (this.pos.x + this.size.x > entity.pos.x &&
                this.pos.x < entity.pos.x + entity.size.x &&
                this.pos.y + this.size.y > entity.pos.y &&
                this.pos.y < entity.pos.y + entity.size.y && entity.coolDown < 0) {
                world.entities.splice(index, 1);
                self.goal = null;
            }
        }
    }, this);
};

Villager.prototype._speed = 0.4;
Villager.prototype._radius = 2;