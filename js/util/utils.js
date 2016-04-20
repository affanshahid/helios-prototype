/*globals Vector*/
var Utils = {};

Utils.getCenter = function (pos, size) {
    return new Vector(pos.x + size.x / 2, pos.y + size.y / 2);
};

Utils.detectCollision = function (ent1, ent2) {
    return ent1 != ent2 && ent1.pos.x + ent1.size.x > ent2.pos.x &&
        ent1.pos.x < ent2.pos.x + ent2.size.x &&
        ent1.pos.y + ent1.size.y > ent2.pos.y &&
        ent1.pos.y < ent2.pos.y + ent2.size.y;
}