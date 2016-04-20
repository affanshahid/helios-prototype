/*globals Vector Coin, Player, Serf, EasyStar*/

/**
 * Represents world model
 * @constructor
 * @param  {array} map - an array of strings representing the static map
 * @param  {array} entityMap - an array of strings representing the entities on the map
 * @param  {object} backgroundLegend - an object to decode the map characters to tiles
 * @param  {object} entityLegend - an object to decode the entity-map characters to entities
 * @param  {object} intentions - describes user intentions
 */
function World(map, entityMap, backgroundLegend, entityLegend, intentions, obstacles, collectibles) {
    if (map.length != entityMap.length || map[0].length != entityMap[0].length)
        throw new Error('Entity map and static map sizes do not match');

    //2D array
    var grid = this.grid = [];
    var entities = this.entities = [];
    this.intentions = intentions;
    this.collectibles = collectibles;
    this.obstacles = obstacles;
    this.height = map.length;
    this.width = map[0].length;
    var player;
    var self = this;

    var walkables = [];
    for (var bgName in backgroundLegend) {
        if (backgroundLegend.hasOwnProperty(bgName)) {
            if (obstacles.indexOf(backgroundLegend[bgName]) == -1) {
                walkables.push(backgroundLegend[bgName]);
            }
        }
    }
    this.walkables = walkables;
    map.forEach(function (line) {
        var row = [];
        Array.prototype.forEach.call(line, (function (char) {
            row.push(backgroundLegend[char]);
        }));
        grid.push(row);
    });

    entityMap.forEach(function (line, y) {
        Array.prototype.forEach.call(line, (function (entityChar, x) {

            if (entityChar in entityLegend) {
                var entity;
                if (entityLegend[entityChar] == Player)
                    player = entity = new entityLegend[entityChar](new Vector(x, y));
                else
                    entity = new entityLegend[entityChar](new Vector(x, y), self.createPathFinder(walkables));
                entities.push(entity);
            }
        }));
    });

    this.player = player;
}
World.prototype.dropCoin = function (pos) {
    this.entities.push(new Coin(pos, this));
};
/**
 * detect collisons
 * @param  {Vector} vec
 * @param  {Vector} size
 */
World.prototype.handlingCollisions = function (vec, size) {
    var xStart = Math.floor(vec.x);
    var yStart = Math.floor(vec.y);
    var newPos = vec.add(size);
    var xEnd = Math.ceil(newPos.x);
    var yEnd = Math.ceil(newPos.y);

    if (xStart < 0 || xEnd > this.width || yStart < 0 || yStart > this.height)
        return true;
    for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
            if (this.obstacles.indexOf(this.grid[y][x]) >= 0) {
                return true;
            }
        }
    }
    return false;
};

/**
 * One iteration in the world
 */
World.prototype.cycle = function (step) {
    var self = this;

    while (step > 0) {
        var thisStep = Math.min(this.maxStep, step);
        step -= thisStep;
        this.entities.forEach(function (entity) {
            entity.act(thisStep, self, self.intentions);
        });
        this.cleanUpItems();
    }

};

World.prototype.upgradeVillager = function (vill) {
    this.entities.splice(this.entities.indexOf(vill), 1);
    var vec = vill.pos.clone();
    var serf = new Serf(vec, this.createPathFinder(this.walkables));
    this.entities.push(serf);

};

World.prototype.cleanUpItems = function () {
    this.entities.forEach(function (entity, index) {
        if (entity instanceof Coin) {
            if (this.world.handlingCollisions(entity.pos, entity.size))
                this.world.entities.splice(index, 1);
        }
    });
};

World.prototype.createPathFinder = function (walkables) {
    var pathFinder = new EasyStar.js();
    pathFinder.setGrid(this.grid);
    pathFinder.setAcceptableTiles(walkables);
    //pathFinder.enableDiagonals();
    return pathFinder;
};

World.prototype.maxStep = 0.05;