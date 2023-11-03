// parameters of the scene and animation
var guiParams = {
    ballRadius: 1,
    ballBouncePeriod: 3,  // time to bounce once, in arbitrary time units
    maxBallHeight: 8,     // max y position of the center of the ball
    deltaT: 0.035         // time between steps, in arbitrary time units
};

var scene = new THREE.Scene();

// create green ground plane and add to the scene
var ground = new THREE.Mesh(new THREE.PlaneGeometry(10,10),
                            new THREE.MeshBasicMaterial({color:0x009900}) );
ground.rotation.x = -Math.PI/2;
scene.add(ground);

var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

TW.cameraSetup(renderer, scene, 
               {minx: -5, maxx: 5,
                miny: 0, maxy: guiParams.maxBallHeight+guiParams.ballRadius,
                minz: -5, maxz: 5});

// state variables for the animation
var animationState;

// resets the animationState to its initial setting
function resetAnimationState() {
   animationState = {
       time: 0,
       ballHeight: guiParams.maxBallHeight    // fall from maximum height
   };
}

resetAnimationState();

// ball needs to be global so we can update its position
var ball;

function makeBall() {
    if ( ball != null ) {
        scene.remove(ball);
    }
    var ballG =  new THREE.SphereGeometry(guiParams.ballRadius,30,30);
    var ballMat = new THREE.MeshNormalMaterial();
    ball = new THREE.Mesh(ballG,ballMat);
    ball.position.set(0,animationState.ballHeight,0);
    scene.add(ball);
}

makeBall();

// transforms x in the range [minx,maxx] to y in the range [miny,maxy]
function linearMap(x, minx, maxx, miny, maxy) {
    // t is in the range [0,1]
    t = (x-minx)/(maxx-minx);
    y = t*(maxy-miny)+miny;
    return y;
}

// sets the position of the ball based on current time
function setBallPosition(time) {
    // rescale the time dimension so that the period of bouncing maps to pi
    var angle = time * Math.PI / guiParams.ballBouncePeriod; 
    var abs_cos = Math.abs(Math.cos(angle));
    var ballHeight = linearMap(abs_cos, 0, 1, 
                               guiParams.ballRadius, guiParams.maxBallHeight);
    ball.position.y = ballHeight;
    return ballHeight;
}

// resets the ball to the initial state and renders the scene
function firstState() {
    resetAnimationState();
    animationState.ballHeight = setBallPosition(animationState.time);
    TW.render();
}

firstState();

// updates the state of the animation (time and ballHeight)
function updateState() {
    animationState.time += guiParams.deltaT;
    animationState.ballHeight = setBallPosition(animationState.time);
//    console.log("time is " + animationState.time + " and ball height is " + animationState.ballHeight);
}

// performs one step of the animation
function oneStep() {
    updateState();
    TW.render();
}
    
// stored so that we can cancel the animation if we want
var animationId = null;                

// starts continuous animation loop
function animate(timestamp) {
    oneStep();
    animationId = requestAnimationFrame(animate);
}

// halts the animation
function stopAnimation() {
    if (animationId != null) {
        cancelAnimationFrame(animationId);
        console.log("Cancelled animation using " + animationId);
    }
}

// setup keyboard controls
TW.setKeyboardCallback("0", firstState, "reset animation");
TW.setKeyboardCallback("1", oneStep, "advance by one step");
TW.setKeyboardCallback("g", animate, "go:  start animation");
TW.setKeyboardCallback(" ", stopAnimation, "stop animation");

// setup gui controls
var gui = new dat.GUI();
gui.add(guiParams, "ballRadius", 0.1, 3).onChange(
                                           function () {
                                              makeBall();
                                              TW.render()
                                           });
gui.add(guiParams, "deltaT", 0.001, 0.999).step(0.001);
gui.add(guiParams, "ballBouncePeriod", 1, 30).step(1);

document.addEventListener('click', onMouseClick);

function onMouseClick (event) {
   guiParams.maxBallHeight += 2;
}