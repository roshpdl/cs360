// when true, objects are drawn in wireframe
var wireframe = false;

// Colors and materials for the teddy bear.
var bodyColor = 0xD08050;
var headColor = 0xB07040;   // like body but slightly darker
var bodyMaterial = new THREE.MeshBasicMaterial({color: bodyColor});
var headMaterial = new THREE.MeshBasicMaterial({color: headColor});
var blackMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
bodyMaterial.wireframe = wireframe;
headMaterial.wireframe = wireframe;

function createNose(params) {
    var sd = params.sphereDetail || 10;
    var radius = params.noseRadius || 0.6;
    var noseGeometry = new THREE.SphereGeometry(radius,sd,sd);
    var noseMesh = new THREE.Mesh(noseGeometry, blackMaterial);
    return noseMesh;
}

function addNose(head,params) {
    /* adds a nose to the head. It's placed by creating a composite object
     * centered in the middle of the head, and positioning the nose at the
     * head radius on +Z, then rotating around X by a little. */
    var noseframe = new THREE.Object3D();
    var nose = createNose(params);
    var radius = params.headRadius || 2;
    nose.position.z = radius; // within the noseframe
    noseframe.add(nose);
    var angle = params.noseRotation || TW.degrees2radians(10);
    noseframe.rotation.x = angle;
    head.add(noseframe);
    return head;
}

function createEar(params) {
    // side is 1 (right) or -1 (left)
    var sd = params.sphereDetail || 10;
    var radius = params.earRadius || 0.6;
    var earGeometry = new THREE.SphereGeometry(radius,sd,sd);
    var ear = new THREE.Mesh(earGeometry, bodyMaterial);
     //Flattens the sphere to make it look more like a flat disk
    ear.scale.z = params.earScale || 0.5;
    return ear;
}

function addEar(head,params,side) {
    /* adds an ear to the head on the right (side=1) or left
     * (side=-1). The center of the ear is flush with the surface of the
     * head by moving it out by the radius, and rotating it around the z
     * axis to get it to the desired height. */
    var earframe = new THREE.Object3D();
    var ear = createEar(params);
    var radius = params.headRadius || 2;
    var angle = params.earAngle || Math.PI/4;
    ear.position.x = side * radius; // within the earframe
    earframe.rotation.z = side * angle;
    earframe.add(ear);
    head.add(earframe);
    return head;
}

function createEye(params) {
    var sd = params.sphereDetail || 10;
    var radius = params.eyeRadius || 0.3;
    var eyeGeometry = new THREE.SphereGeometry(radius,sd,sd);
    var eyeMesh = new THREE.Mesh(eyeGeometry, blackMaterial);
    return eyeMesh;
}

function addEye(head,params,side) {
    /* adds an eye to the head on the right (side=1) or left
     * (side=-1). The center of the eye is flush with the surface of the
     * head by moving it out along the z axis by the radius, and rotating
     * it around the x and then y axes to get it to the desired height. */
    var eyeframe = new THREE.Object3D();
    var eye = createEye(params);
    var radius = params.headRadius || 2;
    eye.position.z = radius; // within the eyeframe
    var angleX = params.eyeAngleX || -Math.PI/6;
    var angleY = params.eyeAngleY || Math.PI/6;
    eyeframe.rotation.x = angleX;
    eyeframe.rotation.y = side * angleY;
    eyeframe.add(eye);
    head.add(eyeframe);
    return head;
}

function createHead(params) {
    /* Returns a teddy bear head object, with origin in the center, and
     * eyes on the +Z side of the head, and ears on the left (-X) and
     * right (+X) sides. */
    var head = new THREE.Object3D();

    var sd = params.sphereDetail || 10;
    var radius = params.headRadius || 2;
    var headGeometry = new THREE.SphereGeometry(radius, sd, sd);
    var headMesh = new THREE.Mesh(headGeometry, headMaterial);
    head.add(headMesh);
    if(params.nose) {
        addNose(head,params);
    }
    if(params.ears) {
        addEar(head,params,1);
        addEar(head,params,-1);
    }
    if(params.eyes) {
        addEye(head,params,1);
        addEye(head,params,-1);
    }
    return head;
}

function createArm(params) {
    /* returns an Object with the center at the shoulder and the negative
     * Y axis running down the center. */
    var arm = new THREE.Object3D();
    var top = params.armRadiusTop || 0.7;
    var bot = params.armRadiusBottom || 0.6;
    var len = params.armLength || 5;
    var cd  = params.cylinderDetail || 10;
    // console.log("cd is "+cd);
    // Turns out there's an error in Three.js if cd is a non-integer
    var armGeom = new THREE.CylinderGeometry(top,bot,len,cd);
    var armMesh = new THREE.Mesh( armGeom, headMaterial );
    armMesh.position.y = -len/2;
    arm.add(armMesh);
    return arm;
}

function addArm(bear,params,side) {
    /* adds an arm to the bear on the right (side=1) or left (side=-1). */
    var arm = createArm(params);
    var radius = params.bodyRadius || 3;
    var scale = params.bodyScaleY || 2; 
    var sx = params.shoulderWidth  || radius * 0.5;
    var sy = params.shoulderHeight || scale * radius * 0.7;
    // console.log("adding arms at "+sx+","+sy);
    arm.position.set( side * sx, sy, 0 );
    arm.rotation.z = side * Math.PI/2;
    bear.add(arm);
}
    
function createLimb(radiusTop, radiusBottom, length, params) {
    /* returns an Object with the center at the top and the negative Y
     * axis running down the center. */
    var limb = new THREE.Object3D();
    var cd  = params.cylinderDetail || 10;
    // console.log("cd is "+cd);
    // Turns out there's an error in Three.js if cd is a non-integer
    var limbGeom = new THREE.CylinderGeometry(radiusTop,radiusBottom,length,cd);
    var limbMesh = new THREE.Mesh( limbGeom, headMaterial );
    limbMesh.position.y = -length/2;
    limb.add(limbMesh);
    return limb;
}

function addLeg(bear,params,side) {
    /* adds a leg to the bear on the right (side=1) or left (side=-1). */
    var top = params.legRadiusTop || 0.7;
    var bot = params.legRadiusBottom || 0.6;
    var len = params.legLength || 5;
    var leg = createLimb(top,bot,len,params);
    leg.name = (side == 1 ? "right leg" : "left leg");
    var radius = params.bodyRadius || 3;
    var scale = params.bodyScaleY || 2; 
    var hx = side * params.hipWidth  || side * radius * 0.5;
    var hy = params.hipHeight || scale * radius * -0.7;
    console.log("adding "+leg.name+" at "+hx+","+hy);
    leg.position.set( hx, hy, 0 );
    console.log("rotating to "+params.legRotationZ);
    leg.rotation.x = params.legRotationX;
    leg.rotation.z = side * params.legRotationZ;
    bear.add(leg);
}

function createBody(params) {
    var body = new THREE.Object3D();
    var radius = params.bodyRadius || 3;
    var sd = params.sphereDetail || 20;
    var bodyGeom = new THREE.SphereGeometry(radius,sd,sd);
    var bodyMesh = new THREE.Mesh(bodyGeom, bodyMaterial);
    var scale = params.bodyScaleY || 2;
    bodyMesh.scale.y = scale;
    body.add(bodyMesh);
    if(params.arms) {
        addArm(body,params,1);
        addArm(body,params,-1);
    }
    if(params.legs) {
        console.log("adding legs");
        addLeg(body,params,1);
        addLeg(body,params,-1);
    }
    return body;
}

function createTeddyBear(params) {
    var bear = new THREE.Object3D();
    var body = createBody(params);
    bear.add(body);
    if(params.head) {
        var head = createHead(params);
        var bs = params.bodyScaleY || 2;
        var br = params.bodyRadius || 3;
        var hr = params.headRadius || 1;
        // calculate position for the center of the head
        head.position.y = bs*br+hr;
        bear.add(head);
    }
    return bear;
}

var params = {
    wireframe: false,
    sphereDetail: 10,
    cylinderDetail: 10,
    nose: true,
    noseRadius: 0.5,
    noseRotation: TW.degrees2radians(10),
    ears: true,
    earRadius: 0.6,
    earScale: 0.5,
    earAngle: Math.PI/4,
    eyes: true,
    eyeRadius: 0.3,
    eyeAngleX: -Math.PI/6,
    eyeAngleY: +Math.PI/6,
    arms: true,
    armLength: 7,
    armRadiusTop: 1.5,
    armRadiusBottom: 1.2,
    legs: true,
    legRadiusTop: 1.8,
    legRadiusBottom: 1.4,
    legLength: 9,
    legRotationX: -TW.degrees2radians(60),
    legRotationZ: TW.degrees2radians(20),
    hipWidth: 2.5,
    hipHeight: -7,
    head: true,
    headRadius: 2,
    bodyRadius: 5,
    bodyScaleY: 2,
    noop: "last param"
};

var renderer = new THREE.WebGLRenderer();

var scene = new THREE.Scene();
                        
var bear = createTeddyBear(params);
scene.add(bear);

TW.mainInit(renderer,scene);

TW.cameraSetup(renderer,
               scene,
               {minx: -5, maxx: 5,
                miny: -10, maxy: 15,
                minz: -5, maxz: 5});
TW.toggleAxes("show");
TW.viewFromAboveFrontSide();

var render = TW.lastClickTarget.TW_state.render;

TW.setKeyboardCallback("w",
                       function () {
                           wireframe = !wireframe;
                           bodyMaterial.wireframe = wireframe;
                           headMaterial.wireframe = wireframe;
                           render();
                       },
                       "toggle wireframe");

// ================================================================

function rebuild() {
    wireframe = params.wireframe;
    bodyMaterial.wireframe = wireframe;
    headMaterial.wireframe = wireframe;
    scene.remove(bear);
    bear = createTeddyBear(params);
    scene.add(bear);
    render();
}

// ================================================================
var gui = new dat.GUI();
gui.add(params, 'wireframe').onChange(rebuild);
gui.add(params, 'sphereDetail',2,30).step(1).onChange(rebuild);
gui.add(params, 'cylinderDetail',3,30).step(1).onChange(rebuild);
gui.add(params, 'head').onChange(rebuild);
gui.add(params, 'headRadius',1,3).onChange(rebuild);
gui.add(params, 'bodyRadius',2,10).onChange(rebuild);
gui.add(params, 'bodyScaleY',1,3).onChange(rebuild);
gui.add(params, 'nose').onChange(rebuild);
gui.add(params, 'noseRadius',0.1,0.9).onChange(rebuild);
gui.add(params, 'noseRotation',0.1,Math.PI/2).onChange(rebuild);
gui.add(params, 'ears').onChange(rebuild);
gui.add(params, 'earRadius',0.1,0.9).onChange(rebuild);
gui.add(params, 'earScale',0.1,0.9).onChange(rebuild);
gui.add(params, 'earAngle',0.1,Math.PI/2).onChange(rebuild);
gui.add(params, 'eyes').onChange(rebuild);
gui.add(params, 'eyeAngleX',-Math.PI/2,0).onChange(rebuild);
gui.add(params, 'eyeAngleY',0,Math.PI/2).onChange(rebuild);
gui.add(params, 'arms').onChange(rebuild);
gui.add(params, 'armLength',3,14).onChange(rebuild);
gui.add(params, 'armRadiusTop',0.5,3).onChange(rebuild);
gui.add(params, 'armRadiusBottom',0.5,3).onChange(rebuild);
var legfolder = gui.addFolder('legs');
legfolder.add(params, 'legs').onChange(rebuild);
legfolder.add(params, 'legLength',3,14).onChange(rebuild);
legfolder.add(params, 'legRadiusTop',0.5,3).onChange(rebuild);
legfolder.add(params, 'legRadiusBottom',0.5,3).onChange(rebuild);
legfolder.add(params, 'legRotationX',-3,0).step(0.01).onChange(rebuild);
legfolder.add(params, 'legRotationZ',0.0,3).step(0.01).onChange(rebuild);
legfolder.add(params, 'hipHeight',-10,-1).step(0.1).onChange(rebuild);
legfolder.add(params, 'hipWidth',1.0,5.0).step(0.1).onChange(rebuild);