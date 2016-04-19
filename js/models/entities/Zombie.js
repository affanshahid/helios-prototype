/*globals Vector, Utils*/

/**
 * Zombie entity
 * @param  {Vector} position
 */
function Zombie(pos, pathFinder) {
    this.pathFinder = pathFinder;
    this.pos = pos;
    this.size = new Vector(0.5, 0.5);
    this.temporaryGoal = pos;
}
/**
 * Zombie behavior, calculate shortest path to player asynchronously
 * and move
 * 
 * @param  {number} step
 * @param  {World} world
 */



Zombie.prototype.act = function (step, world) {
    this.move(step, world);
};
/**
 * Move zombie
 * @param  {number} step - time step
 * @param  {World} world
 * @param  {object} delta - direction of movement
 */
Zombie.prototype.move = function (step, world) {

    var self = this;

    function getNextStep(start, goal) {
        //calcuate direction unit vector
        var uv = goal.minus(start).getUnitVector();
        //distance to travel in direction
        return uv.scale(step * self._speed);
    }

    var currentPos = this.pos;

    //centers indicate which grid square the majority portion of an entity is in
    var center = Utils.getCenter(this.pos, this.size);
    var playerCenter = Utils.getCenter(world.player.pos, world.player.size);

    var start = center.map(Math.floor);
    var goal = playerCenter.map(Math.floor);


    var next;
    //i.e too close for pathfinding
    if (start.equals(goal)) {
        next = world.player.pos;

        //temp goal set
    } else if (this.tempGoal) {
        next = this.tempGoal;
    }

    if (next) {
        var nextStep = getNextStep(currentPos, next);
        var newPos = currentPos.add(nextStep);

        if (!world.handlingCollisions(newPos, self.size)) {
            self.pos = newPos;
            if (this.tempGoal && Math.abs(this.pos.x - this.tempGoal.x) < 0.1 && Math.abs(this.pos.y - this.tempGoal.y) < 0.1)
                this.tempGoal = null;
        }
        return;
    }

    this.pathFinder.findPath(start.x, start.y, goal.x, goal.y, function (path) {
        var newPos;
        var nextStep;

        if (!path) {
            return;
        } else if (path.length > 0) {
            nextStep = getNextStep(self.pos, new Vector(path[1]));
            newPos = self.pos.add(nextStep);
            if (!world.handlingCollisions(newPos, self.size)) {
                self.pos = newPos;
            } else {
                self.tempGoal = new Vector(path[0].x + 0.15, path[0].y + 0.15);
            }
        }
    });
    this.pathFinder.calculate();
};

Zombie.prototype._speed = 2.3;

// Old working path-finding code
// Zombie.prototype.crap = function (step, world) {
//     var self = this;
//     var currentPos = this.pos;

//     //centers indicate which grid square the majority portion of an entity is in
//     var center = Utils.getCenter(this.pos, this.size);
//     var playerCenter = Utils.getCenter(world.player.pos, world.player.size);

//     var start = center.map(Math.floor);
//     var goal = playerCenter.map(Math.floor);

//     this.pathFinder.findPath(start.x, start.y, goal.x, goal.y, function (path) {
//         if (path == null) {
//             return;
//         } else {
//             var delta;
//             var delta2 = self.pos.clone();
//             if (path.length > 0) {
//                 if (self.temporaryGoal) {
//                     var select = self.temporaryGoal;
//                     var dx = select.x - self.pos.x;
//                     var dy = select.y - self.pos.y;
//                     delta = new Vector(dx, dy).getUnitVector();
//                 } else {
//                     delta = [];
//                     for (var i = 0; i < 2; i++) {
//                         var select = new Vector(path[i].x, path[i].y);
//                         var dx = select.x - self.pos.x;
//                         var dy = select.y - self.pos.y;
//                         delta.push(new Vector(dx, dy).getUnitVector());
//                     }
//                     path[0].x += .15;
//                     path[0].y += .15;
//                     delta2 = path[0];
//                     delta = delta[1];
//                 }
//             }
//             else {
//                 var actualDX = world.player.pos.x - self.pos.x;
//                 var actualDY = world.player.pos.y - self.pos.y;
//                 delta = new Vector(actualDX / Math.abs(actualDX), actualDY / Math.abs(actualDY));
//             }
//             var alternate = delta2;
//             var distanceToMove = step * self._speed;
//             var newPos = self.pos.add(delta.scale(distanceToMove));
//             if (!(world.handlingCollisions(newPos, self.size))) {
//                 self.pos = newPos;
//                 if (self.temporaryGoal && Math.abs(self.pos.x - self.temporaryGoal.x) < 0.1 && Math.abs(self.pos.y - self.temporaryGoal.y) < 0.1)
//                     self.temporaryGoal = null;
//             } else {
//                 self.temporaryGoal = alternate;
//             }
//         }
//     });

//     this.pathFinder.calculate();

// };