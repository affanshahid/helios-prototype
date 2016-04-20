/*globals Entity*/

function Item(pos, size) {
    Entity.call(this, pos, size);
}

Item.prototype = Object.create(Entity.prototype);
Item.prototype.constructor = Item;
