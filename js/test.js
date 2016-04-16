/*globals World, MapView, Player , Coin*/
var backgroundLegend = {
    ' ': 'grass',
    '#': 'hill'
};

var entityLegend = {
    '@': Player,
    'o': Coin
};

var map = [
    "###################",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "###################"
];

var entityMap = [
    "###################",
    "#                 #",
    "#                 #",
    "#   @             #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "#                 #",
    "###################"
];

var colorLegend = {
    'grass': 'green',
    'hill': 'brown'
};

var entityColorLegend = {
    'Player': 'red' ,
    'Coin' : 'gold'
};
var obstacles = ['hill'];

function createIntentions() {
    var keyCodes = { '87': 'up', '83': 'down', '65': 'left', '68': 'right', '70': 'drop' };
    var intentions = Object.create(null);

    function handler(event) {
        if (keyCodes.hasOwnProperty(event.keyCode)) {
            event.preventDefault();
            intentions[keyCodes[event.keyCode]] = event.type == 'keydown';
        }
    }

    addEventListener('keydown', handler);
    addEventListener('keyup', handler);

    return intentions;
}

function runAnimation(f) {
    var lastTime = null;

    function wrapper(time) {
        if (lastTime != null) {
            var step = Math.min(time - lastTime, 100) / 1000;
            f(step);
        }
        lastTime = time;
        requestAnimationFrame(wrapper);
    }
    requestAnimationFrame(wrapper);
}

var world = new World(map, entityMap, backgroundLegend, entityLegend, createIntentions(), obstacles);
var view = new MapView(world, colorLegend, entityColorLegend, 'container', { gridLines: true });

function gameLoop(step) {
    world.cycle(step);
    view.drawFrame(step);
}

runAnimation(gameLoop);