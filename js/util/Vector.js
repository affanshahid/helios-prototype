/**
 * Represents a vector
 * @constructor
 * @param  {number} x - X coordinate
 * @param  {number} y - Y coordinate
 */
function Vector(x, y) {
    if (typeof x == 'object') {
        this.x = x.x;
        this.y = x.y;
    } else {
        this.x = x;
        this.y = y;
    }
}
/**
 * @param  {Vector} vec - vector to add
 */
Vector.prototype.add = function (vec) {
    return new Vector(this.x + vec.x, this.y + vec.y);
};

Vector.prototype.minus = function (vec) {
    return new Vector(this.x - vec.x, this.y - vec.y);
};

Vector.prototype.scale = function (scalar) {
    return new Vector(scalar * this.x, this.y * scalar);
};

Vector.prototype.distanceTo = function (vector) {
    return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
};

Vector.prototype.magnitude = function () {
    return this.distanceTo(new Vector(0, 0));
};

Vector.prototype.getUnitVector = function () {
    var mag = this.magnitude();
    if (mag == 0)
        return new Vector(0, 0);
    return this.scale(1 / mag);
};

Vector.prototype.clone = function () {
    return new Vector(this.x, this.y);
};

Vector.prototype.equals = function (vec) {
    return this.x == vec.x && this.y == vec.y;
};

Vector.prototype.map = function (f) {
    return new Vector(f(this.x), f(this.y));
};

Vector.directions = {
    north: new Vector(0, -1),
    south: new Vector(0, 1),
    east: new Vector(1, 0),
    west: new Vector(-1, 0)
};