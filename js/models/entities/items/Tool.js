/*globals Vector, Coin, Item*/
function Tool(pos) {
    Item.call(this, pos, new Vector(0.2, 0.2));
}

Tool.prototype = Object.create(Item.prototype);
Tool.prototype.constructor = Tool;