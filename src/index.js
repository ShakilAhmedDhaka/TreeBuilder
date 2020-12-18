import './style.css';
import _, { create, isEmpty } from 'lodash';
import printMe from './print.js';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';


const MAX_BRANCH = 4;
const MAX_RECUR = 5;
const mouse = new THREE.Vector2();
const light = new THREE.AmbientLight ( 0xffffff, 1 );;

let matCylinder, scene, camera, renderer, controls, raycaster;
let geoCylinder, matSphere, tRoot, INTERSECTED;
let objectsInScene = [];


function createUI(){
    var element = document.createElement('div');

    element.innerHTML = "TreeBuilder";
    element.classList.add('hello');

    var branchLabel = document.createElement('label');
    branchLabel.innerHTML = "number of branches: ";
    branchLabel.style.marginLeft = "20px";
    branchLabel.style.color = "#377B8C";

    var branchInput = document.createElement('input');
    branchInput.type = 'number';
    branchInput.min = 1;
    branchInput.max = MAX_BRANCH;
    branchInput.style.width = '40px';
    branchInput.id = "branchInput";

    var recurLabel = document.createElement('label');
    recurLabel.innerHTML = "tree depth: ";
    recurLabel.style.marginLeft = "20px";
    recurLabel.style.color = "#377B8C";

    var recurInput = document.createElement('input');
    recurInput.type = 'number';
    recurInput.min = 1;
    recurInput.max = MAX_RECUR;
    recurInput.style.width = '40px';
    recurInput.id = "recurInput";

    const btn = document.createElement('button');
    btn.innerHTML = "RUN";
    btn.onclick = createTree;
    btn.style.marginLeft = "20px";
    btn.style.color = "#fb5858";

    element.appendChild(branchLabel);
    element.appendChild(branchInput);
    element.appendChild(recurLabel);
    element.appendChild(recurInput);
    element.appendChild(btn);

    element.appendChild(renderer.domElement);
    document.body.appendChild(element);
}


function getValueFromElement(elem, lim){
    
    console.log(elem.value);
    var val = parseInt(elem.value);

    if (isNaN(val) || isEmpty(elem.value) 
        || val > lim || val < 1){
            val = 2;
            elem.value = "2";
        }  
    
    return val;
}



function createTree(){
    // handling input
    var branchEl = document.getElementById("branchInput");
    var recurEl = document.getElementById("recurInput");

    var branch = getValueFromElement(branchEl, MAX_BRANCH);
    var recursion = getValueFromElement(recurEl, MAX_RECUR);

    // setting up root mesh
    geoCylinder = new THREE.CylinderGeometry( 
        0.1, 1, 20 * branch, 8
    );

    tRoot = new THREE.Mesh(geoCylinder, matCylinder);
    tRoot.name = "root";
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    scene.name = "scene";
    scene.add( light );
    objectsInScene.length = 0;
    objectsInScene.push(tRoot);
    scene.add(tRoot);

    // building tree
    createBranch(tRoot, branch, recursion);
}


function originToBottom ( meshObj ) {

    //1. Find the lowest `y` coordinate
    meshObj.geometry.computeBoundingBox();
    var shift = meshObj.geometry.boundingBox.min.y;

    //2. Then you translate all your vertices up 
    meshObj.translateOnAxis(new THREE.Vector3(0,1,0), -shift);

    //finally
    meshObj.verticesNeedUpdate = true;
}



function attachAtAngle(root, child, angle, pos){
    root.geometry.computeBoundingBox();
    var rootDim = root.geometry.boundingBox;
    child.geometry.computeBoundingBox();
    var childDim = child.geometry.boundingBox;
    var childDimX = childDim.max.x - childDim.min.x;
    var childDimY = childDim.max.y - childDim.min.y;
    var childDimZ = childDim.max.z - childDim.min.z;

    var positionToAttach = rootDim.min.add(rootDim.max);
    positionToAttach.divideScalar(2.0);

    var childWrapper = new THREE.Object3D();
    childWrapper.name = "pivot";
    childWrapper.add(child);
    root.add(childWrapper);
    childWrapper.position.set(positionToAttach.x,
        pos,
        positionToAttach.z);
    

    child.position.set(positionToAttach.x  ,
        positionToAttach.y + childDimY / 2.0,
        positionToAttach.z );
    //child.position.y = root.position.y + 20;
    childWrapper.rotation.z += angle * 3.1416 / 180.0 ;
    childWrapper.rotation.y += 2 * angle * 3.1416 / 180.0 ;
    //childWrapper.rotation.z += angle * 3.1416 / 180.0 ;

    //root.scale.y += 1;
}


function createBranch(root, nBranch, recur){
    if(recur == 0){
        return;
    }

    var angle = 60;
    var height = nBranch * 10;
    var gap = height / nBranch;
    var pos = nBranch * -4;
    let geom = geoCylinder;

    if(recur == 2){
        geom = new THREE.CylinderGeometry( 
            0.1, 0.3, height, 8
        );
    }
    else if (recur == 1) {
        height = nBranch * 2;
        geom = new THREE.CylinderGeometry( 
            0.1, 0.3, height, 8
        );
    }
    
    
    for(var i =0;i<nBranch;i++){
        var child = new THREE.Mesh(geom, matSphere.clone());
        child.name = "child" + i + recur;
        objectsInScene.push(child);
        attachAtAngle(root, child, angle, pos);
        createBranch(child, nBranch, recur-1);

        if(angle == 60) angle = 300;
        else    angle = 60;
        pos = pos + gap;
        //gap = gap * -1;
        //pos = pos + gap;
    }
}


function init(){

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    scene.name = "scene";
    camera = new THREE.PerspectiveCamera(
        70, 
        window.innerWidth / window.innerHeight, 
        1, 
        10000
    );
    camera.position.z = 100;

    //light.position.set( 1, 1, 1 ).normalize();
    scene.add( light );

    raycaster = new THREE.Raycaster();
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    createUI();
    
    matCylinder = new THREE.MeshLambertMaterial( {
        color: 0x377B8C
    } );
    matSphere = new THREE.MeshLambertMaterial({color: 0xff0000 });
    geoCylinder = new THREE.CylinderGeometry( 
        0.1, 1, 20 * 2, 8
    );

    tRoot = new THREE.Mesh(geoCylinder, matCylinder);
    tRoot.name = "root";
    objectsInScene.push(tRoot);
    scene.add(tRoot);

    createBranch(tRoot, 2, 2);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.addEventListener('change', render);

    console.log("total objects in scene: " + objectsInScene.length);
    for(let i = 0;i<objectsInScene.length;i++){
        console.log(objectsInScene[i].name);
    }
}


function animate(){
    requestAnimationFrame(animate);
    
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    controls.update();
    render();
    //renderer.render(scene, camera);
}


function render(){
    camera.lookAt( scene.position );
	camera.updateMatrixWorld();

	raycaster.setFromCamera( mouse, camera );

	const intersects = raycaster.intersectObjects( objectsInScene, false );
    console.log(`number of intersected objects: ${intersects.length}`);


    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            console.log(`object name: ${intersects[0].object.name}`);
            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0x00ff00 );

        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;

    }

    renderer.render( scene, camera );
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function onDocumentMouseMove( event ) {

    event.preventDefault();

    // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.clientHeight ) * 2 + 1;


    console.log(mouse.x);
    console.log(mouse.y);
}


function onDocumentMouseDown(event){
    console.log("mouse clicked");

    if(INTERSECTED){
        console.log("branch selected");
        var geom = new THREE.CylinderGeometry( 
            0.1, .15, 4, 8
        );
        var child = new THREE.Mesh(geom, matSphere.clone());
        //child.name = "child" + i + recur;
        objectsInScene.push(child);

        console.log(INTERSECTED);
        var pos = INTERSECTED.position.y;
        console.log("position: " + pos/2);
        attachAtAngle(INTERSECTED, child, 60, -pos/2);
        //attachAtAngle(INTERSECTED, )
    }
    
}


window.addEventListener('resize', onWindowResize, false);
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener('click', onDocumentMouseDown, false);


init();
animate();