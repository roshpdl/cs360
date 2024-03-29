var params = {
    size: 100,
    angle: 0
};

// black and red materials for scale
var materials = [ new THREE.MeshBasicMaterial( {color: new THREE.Color("black")} ),
                  new THREE.MeshBasicMaterial( {color: new THREE.Color("red")} ) ];

// createCone() creates and returns a "cone object" with its origin at the top of the cone
function createCone (height) {
    var coneObj = new THREE.Object3D();

    // add cone mesh to coneObj, with tip of cone at the origin of coneObj
    var coneGeom = new THREE.ConeGeometry(height/3, height);
    var coneMesh = new THREE.Mesh(coneGeom, materials[1]);
    coneMesh.position.y = -height/2;
    coneObj.add(coneMesh);

    return coneObj;
}

// ===============================================================================

// complete the createBeam() function that creates and returns a "beam object" holding 
// two cones at its ends

function createBeam (size, angle) {
    
}

// ===============================================================================

// createScale() creates and returns a "scale object"

function createScale (size, angle) {

    var scaleObj = new THREE.Object3D();

    // add mesh for cylindrical base to scaleObj
    var baseGeom = new THREE.CylinderGeometry(size/2, size/2, size/10);
    var baseMesh = new THREE.Mesh(baseGeom, materials[0]);
    baseMesh.position.y = size/20;
    scaleObj.add(baseMesh);

    // add mesh for vertical pole to scaleObj
    var poleGeom = new THREE.CylinderGeometry(size/20, size/20, size);
    var poleMesh = new THREE.Mesh(poleGeom, materials[0]);
    poleMesh.position.y = size/2 + size/10;
    scaleObj.add(poleMesh);

    // ===============================

    // add code to call createBeam() and add the beam object to scaleObj
    // at the top of the vertical pole

    // ===============================

    return scaleObj;
}

var scene = new THREE.Scene();

// create scale object and add it to the scene
var scale = createScale(params.size, params.angle);
scene.add(scale);

var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

TW.cameraSetup(renderer,
               scene,
               {minx: -params.size, maxx: params.size,
                miny: 0, maxy: 1.5*params.size,
                minz: -params.size/2, maxz: params.size/2});

function redraw() {
    scene.remove(scale);
    // convert angle to radians
    angle_rads = 0.01745 * params.angle;  
    scale = createScale(params.size, angle_rads);
    scene.add(scale);
    TW.render();
}

var gui = new dat.GUI();
gui.add(params,'size',60,100).onChange(redraw);
gui.add(params,'angle',-90,90).onChange(redraw);