// Create an initial empty Scene
var scene = new THREE.Scene();

// global variable for box width
var boxWidth = 20;

// addBox() creates a 3D rectangular box of a given width, height, depth
// and adds it to the scene

function addBox (width,height,depth) {
    var boxGeom = new THREE.BoxGeometry(width,height,depth)
    boxMesh = TW.createMesh(boxGeom);
    scene.add(boxMesh);
}

addBox(boxWidth,40,60);

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// Set up a camera for the scene
TW.cameraSetup(renderer,
               scene,
               {minx: -20, maxx: 20,
                miny: -25, maxy: 25,
                minz: -35, maxz: 35});

// expandBox() is a callback function that increases the width of the box
function expandBox() {
    scene.remove(boxMesh);
    boxWidth = boxWidth + 2;
    addBox(boxWidth,40,60);
    TW.render();
}

// shrinkBox() is a callback function that decreases the width of the box
function shrinkBox() {
    scene.remove(boxMesh);
    boxWidth = boxWidth - 2;
    addBox(boxWidth,40,60);
    TW.render();
}

TW.setKeyboardCallback('+', expandBox, "wider box");
TW.setKeyboardCallback('-', shrinkBox, "narrower box");
