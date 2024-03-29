var scene = new THREE.Scene(); 
var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer,scene);

var sceneParams = { planeLambert: false,
                    planeColor : 0x30D040,
                    planeSpecular: 0x444444,
                    planeShininess: 20,
                    spotlightX: 9,
                    spotlightY: 0,
                    spotlightZ: 9,
                    spotlightColor: 0xffffff,
                    spotlightIntensity: 1,
                    spotlightDistance: 0,
                    spotlightAngle: Math.PI/5,
                    spotlightPenumbra: 0,
                    spotlightExponent: 10,
                    targetX: 0,
                    targetY: 0,
                    targetZ: 0,
                    lastparam: null
                  };
        
function removeByName(name) {
    var obj = scene.getObjectByName(name);
    if( obj ) scene.remove(obj);
}

function drawScene() {
    // delete old stuff; important when we adjust parameters
    removeByName("plane");
    removeByName("target");
    removeByName("spot");
    removeByName("helper");

    //create the plane
    var planeG = new THREE.PlaneGeometry(20,20);
    if(sceneParams.planeLambert) {
        var planeM = new THREE.MeshLambertMaterial({color: sceneParams.planeColor,
                                                    specular: sceneParams.planeSpecular,
                                                    shininess: sceneParams.planeShininess});
    } else {
        var planeM = new THREE.MeshPhongMaterial({color: sceneParams.planeColor,
                                                  specular: sceneParams.planeSpecular,
                                                  shininess: sceneParams.planeShininess});
    }
    var plane = new THREE.Mesh(planeG,planeM);
    plane.name = "plane";         // give it a name, so we can remove it next time. <!--  -->
    
    scene.add(plane);
    
    // create the target()
    var target = new THREE.Mesh( new THREE.SphereGeometry(0.5,8,8),
                                 new THREE.MeshBasicMaterial({color:0xFFFFFF}) );
    target.position.set( sceneParams.targetX, sceneParams.targetY, sceneParams.targetZ );
    target.name = "target";
    scene.add(target);

    //create the spotlight
    spotLight = new THREE.SpotLight( sceneParams.spotlightColor,
                                         sceneParams.spotlightIntensity,
                                         sceneParams.spotlightDistance,
                                         sceneParams.spotlightAngle,
                                         sceneParams.spotlightPenumbra,
                                         sceneParams.spotlightExponent );
    spotLight.name = "spot";
    spotLight.position.set(sceneParams.spotlightX, sceneParams.spotlightY, sceneParams.spotlightZ); 
    spotLight.target = target;
    
    scene.add(spotLight);
    
    var helper = new THREE.SpotLightHelper( spotLight );
    helper.name = "helper";
    scene.add(helper);
    helper.update();

    TW.render();
}
        
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -10, maxx: 10,
                            miny: -10, maxy: 10,
                            minz: -10, maxz: 10});

drawScene();

var gui = new dat.GUI();
gui.add(sceneParams,'planeLambert').onChange(drawScene);
gui.addColor(sceneParams,'planeColor').onChange(drawScene);
gui.addColor(sceneParams,'planeSpecular').onChange(drawScene);
gui.add(sceneParams,'planeShininess',0,100).onChange(drawScene);
gui.add(sceneParams,'spotlightX',0,20).onChange(drawScene);
gui.add(sceneParams,'spotlightY',0,20).onChange(drawScene);
gui.add(sceneParams,'spotlightZ',0,20).onChange(drawScene);
gui.add(sceneParams,'targetX',-10,10).onChange(drawScene);
gui.add(sceneParams,'targetY',-10,10).onChange(drawScene);
gui.add(sceneParams,'targetZ',-10,10).onChange(drawScene);
gui.addColor(sceneParams,'spotlightColor').onChange(drawScene);
gui.add(sceneParams,'spotlightIntensity',0,2).onChange(drawScene);
gui.add(sceneParams,'spotlightDistance',0,100).onChange(drawScene);
gui.add(sceneParams,'spotlightAngle',0,Math.PI/2).onChange(drawScene);
gui.add(sceneParams,'spotlightPenumbra',0,1).onChange(drawScene);
gui.add(sceneParams,'spotlightExponent',0,200).onChange(drawScene);