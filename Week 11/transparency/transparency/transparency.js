var sceneParams = {
   bgColor: 'black',
   color: 0x000000,
   plane1Opacity: 0.5,
   plane2Opacity: 0.5,
   plane3Opacity: 0.5,
   depthMask: true,
   depthTest: true,
   lastParam: null
};
       
var scene = new THREE.Scene(); 
var renderer = new THREE.WebGLRenderer();
       
TW.clearColor = sceneParams.color;
TW.mainInit(renderer,scene);
       
TW.cameraSetup(renderer,
              scene,
              {minx: -5, maxx: 5,
               miny: -5, maxy: 5,
               minz: -5, maxz: 5});
       
// Globals, so we can remove them
var plane1, plane2, plane3;

function redrawPlanes() {
   scene.remove(plane1);
   scene.remove(plane2);
   scene.remove(plane3);

   var planeG = new THREE.PlaneGeometry(10,10);
   var plane1M = new THREE.MeshBasicMaterial({color: 0x00ffff,
                                              transparent: true,
                                              side: THREE.DoubleSide,
                                              opacity: sceneParams.plane1Opacity}); 
   plane1 = new THREE.Mesh(planeG,plane1M);
   scene.add(plane1);
   
   var plane2G = new THREE.PlaneGeometry(10,10);
   var plane2M = new THREE.MeshBasicMaterial({color: 0xffff00,
                                              transparent: true,
                                              side: THREE.DoubleSide,
                                              opacity: sceneParams.plane2Opacity});
   plane2 = new THREE.Mesh(plane2G,plane2M);
   plane2.translateZ(-2);
   plane2.translateX(2);
   scene.add(plane2);
   
   var plane3M = new THREE.MeshBasicMaterial({color: 0xff00ff,
                                              transparent: true,
                                              side: THREE.DoubleSide,
                                              opacity: sceneParams.plane3Opacity});
   plane3 = new THREE.Mesh(planeG,plane3M);
   plane3.translateZ(-4);
   plane3.translateX(4);
   scene.add(plane3);
   TW.render();
}
       
var gui = new dat.GUI();
gui.add(sceneParams,'bgColor',['black','white','custom']).onChange(
   function () {
       switch ( sceneParams.bgColor ) {
           case 'black': sceneParams.color = 0x000000; break;
           case 'white': sceneParams.color = 0xFFFFFF; break;
       }
       renderer.setClearColor( sceneParams.color );
       TW.render();
   });
gui.addColor(sceneParams,'color').onChange(function () {
   renderer.setClearColor( sceneParams.color );
   TW.render();
});
gui.add(sceneParams,'plane1Opacity',0,1,.1).onChange(redrawPlanes);
gui.add(sceneParams,'plane2Opacity',0,1,.1).onChange(redrawPlanes);
gui.add(sceneParams,'plane3Opacity',0,1,.1).onChange(redrawPlanes);
       
redrawPlanes();