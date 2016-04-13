/**
 * 2D map view 
 * @constructor
 * @param  {World} world - the world object to draw
 * @param  {Object} legend - maps tiles to colors
 * @param  {Object} entityLegend - contains entity colors
 * @param  {string} containerId - the id of the container in which to create the canvas
 * @param  {Object} opts - configuration options
 */
function MapView(world, legend, entityLegend, containerId, opts) {
    this.world = world;
    this.legend = legend;
    this.timeElasped = 0;
    this.entityLegend = entityLegend;
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', '1024');
    this.canvas.setAttribute('height', '800');
    this.cx = this.canvas.getContext('2d');

    if (opts) {
        this.gridLines = opts.gridLines || false;
    } else {
        this.gridLines = false;
    }

    document.getElementById(containerId).appendChild(this.canvas);
}

/**
 * Draw current state of world
 */
MapView.prototype._drawBackground = function() {
    var cx = this.cx;
    var legend = this.legend;
    var scale = this._scale;
    var gridLines = this.gridLines;

    cx.strokeStyle = 'white';
    cx.lineWidth = 0.5;

    this.world.grid.forEach(function(row, y) {
        row.forEach(function(tile, x) {
            cx.fillStyle = legend[tile];
            cx.fillRect(x * scale, y * scale, scale, scale);

            if (gridLines) cx.strokeRect(x * scale, y * scale, scale, scale);
        });
    });
};

/**
 * Draw entity layer
 */
MapView.prototype._drawEntities = function() {
    var cx = this.cx;
    var legend = this.entityLegend;
    var scale = this._scale;

    cx.strokeStyle = 'black';
    cx.lineWidth = 0.5;

    this.world.entities.forEach(function(entity) {
        var entitySize = entity.size.scale(scale);
        var x = entity.pos.x * scale + entitySize.x / 2;
        var y = entity.pos.y * scale + entitySize.y / 2;
        cx.fillStyle = legend[entity.constructor.name];
        cx.beginPath();
        cx.ellipse(x, y, entitySize.x / 2, entitySize.y / 2, 0, 0, 2 * Math.PI);
        cx.fill();
        cx.stroke();

        ////
        cx.fillStyle = '#fff';
        cx.fillText('' + entity.pos.x + '\n' + entity.pos.y, 15, 15);
    });
};

/**
 * Draw entire frame
 */
MapView.prototype.drawFrame = function(step) {
    this.timeElasped += step;
    this._drawBackground();
    this._drawEntities();
};

/** 
 * Size of an tile
*/
MapView.prototype._scale = 50;