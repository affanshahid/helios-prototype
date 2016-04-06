/*globals Vector*/

/**
 * Represents world model
 * @constructor
 * @param  {array} map - an array of strings representing the static map
 * @param  {array} entityMap - an array of strings representing the entities on the map
 * @param  {object} backgroundLegend - an object to decode the map characters to tiles
 * @param  {object} entityLegend - an object to decode the entity-map characters to entities
 * @param  {object} intentions - describes user intentions
 */
function World(map, entityMap, backgroundLegend, entityLegend, intentions) {
    if (map.length != entityMap.length || map[0].length != entityMap[0].length)
        throw new Error('Entity map and static map sizes do not match');

    //2D array
    var grid = this.grid = [];
    var entities = this.entities = [];
    this.intentions = intentions;

    map.forEach(function(line) {
        var row = [];
        Array.prototype.forEach.call(line, (function(char) {
            row.push(backgroundLegend[char]);
        }));
        grid.push(row);
    });

    entityMap.forEach(function(line, y) {
        Array.prototype.forEach.call(line, (function(entityChar, x) {

            if (entityChar in entityLegend) {
                entities.push(new entityLegend[entityChar](new Vector(x, y)));
            }
        }));
    });
}

/**
 * One iteration in the world
 */
World.prototype.cycle = function() {
    var self = this;
    this.entities.forEach(function(entity) {
        entity.act(self, self.intentions);
    });
};