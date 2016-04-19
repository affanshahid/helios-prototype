/*globals Vector*/
var Utils = {};

Utils.getCenter = function (pos, size) {
    return new Vector(pos.x + size.x / 2, pos.y + size.y / 2);
};