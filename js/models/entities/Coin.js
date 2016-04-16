/*globals Vector, Coin*/
function Coin(pos,world) {
    this.pos = pos;
    this.size = new Vector(0.2, 0.2);
    this.coolDown = 1;
    this.world=world;

}
Coin.prototype.act = function(step) {
    if (this.coolDown > 0)
        this.coolDown -= step*2;
    if (this.coolDown > 0 && (!(this.world.handlingCollisions(this.pos, this.size))))
        this.pos = this.pos.add(new Vector(0, this.coinSpeed*step));
};
Coin.prototype.coinSpeed = 4;



