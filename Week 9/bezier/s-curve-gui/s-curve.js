var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene(); 
TW.mainInit(renderer,scene);
TW.cameraSetup(renderer,scene, {minx:-2,maxx:2,miny:0,maxy:3,minz:0,maxz:0});
        
var params = {P0x: 0, P0y: 0,
              P1x: 2, P1y: 2,
              P2x: -2, P2y: 1,
              P3x: 0, P3y: 3,
              steps: 20};

var curve;
var cpObj;

function createCurve() {
    scene.remove(curve);
    var controlPoints = [ [params.P0x, params.P0y, 0],
                          [params.P1x, params.P1y, 0],
                          [params.P2x, params.P2y, 0],
                          [params.P3x, params.P3y, 0] ];
    var curveGeom = TW.createBezierCurve(controlPoints, params.steps);
    var mat = new THREE.LineBasicMaterial( { color: THREE.ColorKeywords.blue,
                                             linewidth: 3 } );
    curve = new THREE.Line( curveGeom, mat );
    scene.add(curve);
    showCP(controlPoints);          // optional, for debugging.
}
createCurve();

function showCP(cpList) {
    scene.remove(cpObj);
    cpObj = new THREE.Object3D();
    for( var i=0; i < cpList.length; i++ ) {
        cpObj.add( TW.createPoint(cpList[i]) );
    }
    scene.add(cpObj);
};

TW.viewFromFront();        

function redo() {
    createCurve();
    TW.render();
}

var gui = new dat.GUI();
gui.add(params, "steps", 1, 50).onChange(redo);
gui.add(params, "P0x", -5, +5).onChange(redo);
gui.add(params, "P0y", -5, +5).onChange(redo);
gui.add(params, "P1x", -5, +5).onChange(redo);
gui.add(params, "P1y", -5, +5).onChange(redo);
gui.add(params, "P2x", -5, +5).onChange(redo);
gui.add(params, "P2y", -5, +5).onChange(redo);
gui.add(params, "P3x", -5, +5).onChange(redo);
gui.add(params, "P3y", -5, +5).onChange(redo);