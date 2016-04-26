/*globals AIEntity, Vector, Coin, Utils*/

/**
 * An idle villager, ready to be converted to a serf
 * @param  {Vector} pos - position
 * @param  {object} pathFinder
 */
function Villager(pos, pathFinder) {
    AIEntity.call(this, pos, new Vector(0.35, 0.35), pathFinder);
}

Villager.prototype = Object.create(AIEntity.prototype);
Villager.prototype.constructor = Villager;
/**
 * Villager behavior, attempt to roamForItems and collect coin and transform if able
 * @param  {number} step
 * @param  {World} world
 */
Villager.prototype.act = function (step, world) {
    this.roamForItems(step, world, Coin);
    this.collectItem(world, Coin, world.upgradeVillager.bind(world, this));
};


/**
 * Attempt to roam for the item type specified or random spot within radius
 * radius can be overriden
 * @param  {number} step
 * @param  {World} world
 * @param {constructor} Item - type
 */
Villager.prototype.roamForItems = function (step, world, Item) {
    var foundItems = this._lookupItem(world, Item);
    if (foundItems.length <= 0) {
        if (!this.goal)
            this.goal = this._genRandomSpot(world);
    } else {
        this.goal = this._getClosest(foundItems);
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
 * @param  {World} world
 * @param  {constructor} Item
 */
Villager.prototype._lookupItem = function (world, Item) {
    var startY = Math.max(0, this.pos.y - this._radius);
    var endY = Math.min(this.pos.y + this._radius, world.grid.length - 1);

    var startX = Math.max(0, this.pos.x - this._radius);
    var endX = Math.min(this.pos.x + this._radius, world.grid[0].length - 1);

    return world.entities.filter(function (entity) {
        return Item && entity instanceof Item && entity.pos.x >= startX && entity.pos.x <= endX
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
/**
 * @param  {World} world
 * @param  {constructor} item
 * @param  {Function} cb
 */
Villager.prototype.collectItem = function (world, item, cb) {
    var self = this;
    world.entities.forEach(function (entity, index) {
        if (entity instanceof item) {
            if (Utils.detectCollision(this, entity) && entity.coolDown < 0) {
                world.entities.splice(index, 1);
                self.goal = null;
                cb(entity);
            }
        }
    }, this);
};

Villager.prototype._speed = 0.4;
Villager.prototype._radius = 2;