/*globals Entity, Utils, Vector*/
function AIEntity(pos, size, pathFinder) {
    Entity.call(this, pos, size);
    this.pathFinder = pathFinder;
}

AIEntity.prototype = Object.create(Entity.prototype);
AIEntity.prototype.constructor = AIEntity;
/**
 * Moves entity to the goal specified
 * Override '_speed' property to alter the speed
 * @param  {World} world
 * @param  {number} step
 * @param  {Entiy|Vector} endGoal
 */
AIEntity.prototype.pathFindTo = function (step, world, goal) {
    
    var self = this;
    var size;
    if (goal instanceof Entity) {
        size = goal.size;
        goal = goal.pos;
    } else {
        size = new Vector(1, 1);
    }

    function getNextStep(start, end) {
        //calcuate direction unit vector
        var uv = end.minus(start).getUnitVector();
        //distance to travel in direction
        return uv.scale(step * self._speed);
    }

    var currentPos = this.pos;

    //centers indicate which grid square the majority portion of an entity is in
    var center = Utils.getCenter(this.pos, this.size);

    var goalCenter = Utils.getCenter(goal, size);

    var start = center.map(Math.floor);
    var end = goalCenter.map(Math.floor);


    var next;
    //i.e too close for pathfinding
    if (start.equals(end)) {
        next = goal;

        //temp goal set
    } else if (this._tempGoal) {
        next = this._tempGoal;
    }

    if (next) {
        var nextStep = getNextStep(currentPos, next);
        var newPos = currentPos.add(nextStep);

        if (!world.handlingCollisions(newPos, self.size)) {
            self.pos = newPos;
            if (this._tempGoal && Math.abs(this.pos.x - this._tempGoal.x) < 0.1 && Math.abs(this.pos.y - this._tempGoal.y) < 0.1)
                this._tempGoal = null;
        }
        return;
    }

    this.pathFinder.findPath(start.x, start.y, end.x, end.y, function (path) {
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
                self._tempGoal = new Vector(path[0].x + 0.15, path[0].y + 0.15);
            }
        }
    });
    this.pathFinder.calculate();
};

AIEntity.prototype._speed = 1;