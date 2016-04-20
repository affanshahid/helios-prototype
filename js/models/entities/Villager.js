/*globals AIEntity, Vector*/
function Villager(pos, pathFinder) {
    AIEntity.call(this, pos, new Vector(0.35, 0.35), pathFinder);
}

Villager.prototype = Object.create(AIEntity.prototype);
Villager.prototype.constructor = Villager;

