var scene = new THREE.Scene(); 
var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer,scene);
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -10, maxx: 10,
                            miny: -10, maxy: 10,
                            minz: -1, maxz: 1});

var sceneParams = { planeBrightness : 0.6,
                    planeSpecular: 0.2,
                    planeShininess: 20,
                    spotlightX: 9,
                    spotlightY: 0,
                    spotlightZ: 9,
                    spotlightColor: 0xffffff,
                    spotlightIntensity: 2,
                    spotlightDistance: 0,
                    spotlightAngle: 0.5,  // pi/6 or 30 degrees
                    spotlightPenumbra: 0.2,
                    targetX: -5,
                    targetY: 3,
                    targetZ: -1,
                    lastparam: null
                  };
        
function removeByName(name) {
    var obj = scene.getObjectByName(name);
    if( obj ) scene.remove(obj);
}

var buffy;

var buffyTexture = false;

function makeBuffyPlane() {
    function makePlane(texture) {
        buffyTexture = texture;
        var planeGeom = new THREE.PlaneGeometry( 20, 20);
        var b = sceneParams.planeBrightness;
        var s = sceneParams.planeSpecular;
        var buffyMat = new THREE.MeshPhongMaterial(
            {color: new THREE.Color(b, b, b),
             specular: new THREE.Color( s, s, s),
             shininess: sceneParams.planeShininess,
             map: texture});
        scene.remove(buffy);
        buffy = new THREE.Mesh( planeGeom, buffyMat );
        scene.add(buffy);
        TW.render();
        }
    // main code
    if(buffyTexture) 
        makePlane(buffyTexture)
    else
        TW.loadTexture( 'buffy.gif', makePlane );
}

var spot;
var target;
var helper;

function drawScene() {
    // delete old stuff; important when we adjust parameters
    scene.remove(target)
    scene.remove(spot);
    scene.remove(helper);
    
    makeBuffyPlane();

    // create the target()
    target = new THREE.Mesh( new THREE.SphereGeometry(0.5,8,8),
                             new THREE.MeshBasicMaterial({color:0xFFFFFF}) );
    target.position.set( sceneParams.targetX, sceneParams.targetY, sceneParams.targetZ );

    spot = new THREE.SpotLight( sceneParams.spotlightColor,
                                sceneParams.spotlightIntensity,
                                sceneParams.spotlightDistance,
                                sceneParams.spotlightAngle,
                                sceneParams.spotlightPenumbra );
    spot.position.set(sceneParams.spotlightX, sceneParams.spotlightY, sceneParams.spotlightZ); 
    spot.target = target;
    helper = new THREE.SpotLightHelper(spot);
    scene.add(helper);
    
    scene.add(spot);
    scene.add(spot.target);
    TW.render();
}
        
drawScene();


var gui = new dat.GUI();
gui.add(sceneParams,'planeBrightness',0,1).onChange(drawScene);
gui.add(sceneParams,'planeSpecular',0,1).onChange(drawScene);
gui.add(sceneParams,'planeShininess',0,100).onChange(drawScene);
gui.add(sceneParams,'spotlightX',0,20).onChange(drawScene);
gui.add(sceneParams,'spotlightY',0,20).onChange(drawScene);
gui.add(sceneParams,'spotlightZ',0,20).onChange(drawScene);
gui.add(sceneParams,'targetX',-10,10).onChange(drawScene);
gui.add(sceneParams,'targetY',-10,10).onChange(drawScene);
gui.add(sceneParams,'targetZ',-10,10).onChange(drawScene);
gui.addColor(sceneParams,'spotlightColor').onChange(drawScene);
gui.add(sceneParams,'spotlightIntensity',0,3).onChange(drawScene);
gui.add(sceneParams,'spotlightDistance',0,100).onChange(drawScene);
gui.add(sceneParams,'spotlightAngle',0,Math.PI/2).onChange(drawScene);
gui.add(sceneParams,'spotlightPenumbra',0,1).onChange(drawScene);