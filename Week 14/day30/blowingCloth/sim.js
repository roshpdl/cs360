// empirically, it's about 16-17 ms
var time0 = (new Date('2023/11/18')).getTime();
var time = time0;
var deltaT = 16;
var stepNumber = 0

/* testing cloth simulation */
var pinsFormation = [];
var pins = [6];

pinsFormation.push( pins );

pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
pinsFormation.push( pins );

pins = [ 0 ];
pinsFormation.push( pins );

pins = []; // cut the rope ;)
pinsFormation.push( pins );

pins = [ 0, cloth.w ]; // classic 2 pins
pinsFormation.push( pins );

pins = pinsFormation[ 1 ];


function togglePins() {
    pins = pinsFormation[ ~~( Math.random() * pinsFormation.length ) ];
}

var container;                  // the DOM element (a DIV) that contains the canvas and info)
var camera, scene, renderer;

var clothGeometry;
var sphere;
var object, arrow;

var rotate = true;

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // scene
    scene = new THREE.Scene();

    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    // camera
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.y = 50;
    camera.position.z = 1500;
    scene.add( camera );

    // lights
    var light, materials;

    scene.add( new THREE.AmbientLight( 0x666666 ) );

    light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );

    light.castShadow = true;
    //light.shadowCameraVisible = true;

    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;

    var d = 300;

    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    light.shadowCameraFar = 1000;
    light.shadowDarkness = 0.5;

    scene.add( light );

    light = new THREE.DirectionalLight( 0x3dff0c, 0.35 );
    light.position.set( 0, -1, 0 );

    scene.add( light );

    // cloth material
    var clothTexture = THREE.ImageUtils.loadTexture( 'circuit_pattern.png' );
    clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
    clothTexture.anisotropy = 16;

    var clothMaterial = new THREE.MeshPhongMaterial( { alphaTest: 0.5, ambient: 0xffffff, color: 0xffffff, specular: 0x030303, emissive: 0x111111, shiness: 10, map: clothTexture, side: THREE.DoubleSide } );

    // cloth geometry
    clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h );
    clothGeometry.dynamic = true;
    clothGeometry.computeFaceNormals();

    // cloth mesh
    object = new THREE.Mesh( clothGeometry, clothMaterial );
    object.position.set( 0, 0, 0 );
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add( object );

    // sphere
    var ballGeo = new THREE.SphereGeometry( ballSize, 20, 20 );
    var ballMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    sphere = new THREE.Mesh( ballGeo, ballMaterial );
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add( sphere );

    // arrow
    arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ),
                                   new THREE.Vector3( 0, 0, 0 ),
                                   100, // length of arrow
                                   THREE.ColorKeywords.red,
                                   20, // length of arrowhead
                                   10  // width of arrowhead
                                 );
    arrow.position.set( -200, 0, -200 );
    scene.add( arrow );

    // ground
    var initColor = new THREE.Color( 0x497f13 );
    var initTexture = THREE.ImageUtils.generateDataTexture( 1, 1, initColor );

    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: initTexture } );

    var groundTexture = THREE.ImageUtils.loadTexture( "grasslight-big.jpg", undefined, function() { groundMaterial.map = groundTexture } );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;

    var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), groundMaterial );
    mesh.position.y = -250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    // poles
    var poleGeo = new THREE.BoxGeometry( 5, 375, 5 );
    var poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shiness: 100 } );

    var mesh = new THREE.Mesh( poleGeo, poleMat );
    mesh.position.x = -125;
    mesh.position.y = -62;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    var mesh = new THREE.Mesh( poleGeo, poleMat );
    mesh.position.x = 125;
    mesh.position.y = -62;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    var mesh = new THREE.Mesh( new THREE.BoxGeometry( 255, 5, 5 ), poleMat );
    mesh.position.y = -250 + 750/2;
    mesh.position.x = 0;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    var gg = new THREE.BoxGeometry( 10, 10, 10 );
    var mesh = new THREE.Mesh( gg, poleMat );
    mesh.position.y = -250;
    mesh.position.x = 125;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    var mesh = new THREE.Mesh( gg, poleMat );
    mesh.position.y = -250;
    mesh.position.x = -125;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    //
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( scene.fog.color );

    container.appendChild( renderer.domElement );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMapEnabled = true;

    //
    window.addEventListener( 'resize', onWindowResize, false );

    sphere.visible = !true
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}


// not used in this version
function animate() {
    var time = Date.now();

    requestAnimationFrame( animate );

    oneStep(time);
}

function oneStep(time) {
    windStrength = Math.cos( time / 7000 ) * 20 + 40;
    windForce.set( Math.sin( time / 2000 ),
                   Math.cos( time / 3000 ),
                   Math.sin( time / 1000 ) )
        .normalize()
        .multiplyScalar( windStrength );
    arrow.setLength( windStrength * 5 );
    windDir = new THREE.Vector3().copy(windForce);
    windDir.normalize();
    arrow.setDirection( windDir );
    simulate(time);
    if(animationId==null) {
        console.log("windStrength: "+windStrength+ " and force: "+JSON.stringify(windForce));
    }
    render(time);
}

function render(time) {
    var timer = time * 0.0002;

    var p = cloth.particles;

    for ( var i = 0, il = p.length; i < il; i ++ ) {
        clothGeometry.vertices[ i ].copy( p[ i ].position );
    }

    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();

    clothGeometry.normalsNeedUpdate = true;
    clothGeometry.verticesNeedUpdate = true;

    sphere.position.copy( ballPosition );

    if ( rotate ) {
        camera.position.x = Math.cos( timer ) * 1500;
        camera.position.z = Math.sin( timer ) * 1500;
    }

    camera.lookAt( scene.position );

    renderer.render( scene, camera );
}

var gui = new dat.GUI();

var animationId = null;

function go () {
    if( animationId != null ) return;
    animationLoop();
}
    
function animationLoop() {
    animationId = requestAnimationFrame(animationLoop);
    time += deltaT;
    oneStep(time);
}    

function stop () {
    if( animationId == null ) return;
    cancelAnimationFrame(animationId);
    animationId = null;
}
    

function onKeyPress (e) {
    var key = e.keyCode;
    switch (key) {
    case 48: time = time0; oneStep(time); break; // '0'
    case 49: time += deltaT; oneStep(time); break; // '1'
    case 103: go(); break;                         // 'g'
    case 32: stop(); break;                        // SPC
    }
}
        
document.addEventListener('keypress', onKeyPress, false);

init();
go();