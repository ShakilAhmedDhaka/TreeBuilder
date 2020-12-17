import './style.css';
import _, { create } from 'lodash';
import printMe from './print.js';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';


let scene, camera, renderer, controls;
let geoCylinder, matSphere;

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
    //root.scale.set(1,2,1);
    //originToBottom(root);
    root.geometry.computeBoundingBox();
    var rootDim = root.geometry.boundingBox;
    child.geometry.computeBoundingBox();
    var childDim = child.geometry.boundingBox;
    var childDimX = childDim.max.x - childDim.min.x;
    var childDimY = childDim.max.y - childDim.min.y;
    var childDimZ = childDim.max.z - childDim.min.z;

    var positionToAttach = rootDim.min.add(rootDim.max);

    var childWrapper = new THREE.Object3D();
    childWrapper.add(child);
    root.add(childWrapper);
    childWrapper.position.set(positionToAttach.x,
        positionToAttach.y - childDimY / pos,
        positionToAttach.z);
    

    child.position.set(positionToAttach.x  ,
        positionToAttach.y + childDimY / 2.0,
        positionToAttach.z );
    //child.position.y = root.position.y + 20;
    childWrapper.rotation.z += angle * 3.1416 / 180.0 ;


    //root.scale.y += 1;
}



function createBranch(root, nBranch = 2, recur){
    if(recur == 0)  return;

    for(var i =0;i<2;i++){
        var child = new THREE.Mesh(geoCylinder, matSphere);
        attachAtAngle(root, child, 60, 4);
        createBranch(child, 2, recur-1);
        child = new THREE.Mesh(geoCylinder, matSphere);
        attachAtAngle(root, child, 300, -4);
        createBranch(child, 2, recur-1);
    }
}


function init(){
    const branch = 2;
    const recursion = 2;

    const element = document.createElement('div');
    element.innerHTML = _.join(['Build your ', 'Dynamic Tree'], ' ');
    element.classList.add('hello');

    const btn = document.createElement('button');
    btn.innerHTML = "test";
    btn.onclick = printMe;
    element.appendChild(btn);


    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xff000);
    //scene.domElement.classList.add('hello');

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        .01,
        1000
    );
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(element);
    document.body.appendChild(renderer.domElement);


    geoCylinder = new THREE.CylinderGeometry( 
        1, 1, 20, 8
    );

    const matCylinder = new THREE.MeshBasicMaterial( {
        color: 0x377B8C
    } );

    matSphere = new THREE.MeshBasicMaterial({color: 0xff0000 });


    var tRoot = new THREE.Mesh(geoCylinder, matCylinder);
    scene.add(tRoot);

    createBranch(tRoot, 2, 2);
    
    // var child11 = new THREE.Mesh(geoCylinder, matSphere);
    // var child12 = new THREE.Mesh(geoCylinder, matSphere);
    
    // attachAtAngle(tRoot, child11, 60, 4);
    // attachAtAngle(tRoot, child12, 300, -4);

    // var child21 = new THREE.Mesh(geoCylinder, matSphere);
    // attachAtAngle(child11, child21, 60,4);

    // var child31 = new THREE.Mesh(geoCylinder, matSphere);
    // attachAtAngle(child21, child31, 60,4);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
}


function animate(){
    requestAnimationFrame(animate);
    
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    controls.update();
    render();
    //renderer.render(scene, camera);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render(){
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();