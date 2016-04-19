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
    this.canvas.setAttribute('width', '800');
    this.canvas.setAttribute('height', '600');
    this.cx = this.canvas.getContext('2d');

    this.viewport = {
        left: 0,
        top: 0,
        width: this.canvas.width / this._scale,
        height: this.canvas.height / this._scale
    };
    if (opts) {
        this.gridLines = opts.gridLines || false;
        this.coordsOn = opts.coordsOn || false;
    } else {
        this.coordsOn = false;
        this.gridLines = false;
    }

    document.getElementById(containerId).appendChild(this.canvas);
}

/**
 * Draw current state of world
 */
MapView.prototype._drawBackground = function () {
    var cx = this.cx;
    var legend = this.legend;
    var scale = this._scale;
    var gridLines = this.gridLines;
    var coordsOn = this.coordsOn;

    var view = this.viewport;

    var xStart = Math.floor(view.left);
    var xEnd = Math.ceil(view.left + view.width);
    var yStart = Math.floor(view.top);
    var yEnd = Math.ceil(view.top + view.height);

    cx.strokeStyle = 'white';
    cx.lineWidth = 0.5;
    for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
            var tile = this.world.grid[y][x];
            cx.fillStyle = legend[tile];
            var xCoord = (x - view.left) * scale;
            var yCoord = (y - view.top) * scale;
            cx.fillRect(xCoord, yCoord, scale, scale);

            if (gridLines) cx.strokeRect(xCoord, yCoord, scale, scale);
            if (coordsOn) {
                cx.fillStyle = 'white';
                cx.fillText(x + ', ' + y, xCoord + 3, yCoord + 15);
            }
        }
    }
};

/**
 * Draw entity layer
 */
MapView.prototype._drawEntities = function () {
    var cx = this.cx;
    var legend = this.entityLegend;
    var scale = this._scale;
    var vp = this.viewport;

    cx.strokeStyle = 'black';
    cx.lineWidth = 0.5;

    this.world.entities.forEach(function (entity) {
        var entitySize = entity.size.scale(scale);
        var x = (entity.pos.x - vp.left) * scale + entitySize.x / 2;
        var y = (entity.pos.y - vp.top) * scale + entitySize.y / 2;
        cx.fillStyle = legend[entity.constructor.name];
        cx.beginPath();
        cx.ellipse(x, y, entitySize.x / 2, entitySize.y / 2, 0, 0, 2 * Math.PI);
        cx.fill();
        cx.stroke();
    });
};
/**
 * updates the viewport around the player
 */
MapView.prototype._updateViewport = function () {
    var view = this.viewport;

    var playerVector = this.world.player.pos;

    view.left = Math.max(0, playerVector.x - view.width / 2);
    if (view.left + view.width > this.world.width)
        view.left = this.world.width - view.width;

    view.top = Math.max(0, playerVector.y - view.height / 2);
    if (view.top + view.height > this.world.height)
        view.top = this.world.height - view.height;

};

/**
 * Draw entire frame
 */
MapView.prototype.drawFrame = function (step) {
    this.timeElasped += step;
    this._updateViewport();
    this._drawBackground();
    this._drawEntities();
};

/** 
 * Size of a tile
*/
MapView.prototype._scale = 50;