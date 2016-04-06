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
    var entityRadius = this._entityRadius;
    var scale = this._scale;

    cx.strokeStyle = 'black';
    cx.lineWidth = 0.5;

    this.world.entities.forEach(function(entity) {
        cx.fillStyle = legend[entity.constructor.name];
        cx.beginPath();
        cx.arc(entity.pos.x * scale, entity.pos.y * scale, entityRadius / 2, 0, 2 * Math.PI);
        cx.fill();
        cx.stroke();
    });
};

/**
 * Draw entire frame
 */
MapView.prototype.drawFrame = function() {
    this._drawBackground();
    this._drawEntities();
};

/** 
 * Size of an tile
*/
MapView.prototype._scale = 50;
MapView.prototype._entityRadius = 20;