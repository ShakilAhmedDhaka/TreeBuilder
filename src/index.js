import './style.css';
import _, { create, isEmpty } from 'lodash';
import printMe from './print.js';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';


const MAX_BRANCH = 4;
const MAX_RECUR = 5;

let matCylinder, scene, camera, renderer, controls;
let geoCylinder, matSphere, tRoot;



function createUI(){
    const element = document.createElement('div');
    //element.innerHTML = _.join(['Build your ', 'Dynamic Tree'], ' ');
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
    scene = new THREE.Scene();
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
        var child = new THREE.Mesh(geom, matSphere);
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
    createUI();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        .01,
        1000
    );
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    matCylinder = new THREE.MeshBasicMaterial( {
        color: 0x377B8C
    } );
    matSphere = new THREE.MeshBasicMaterial({color: 0xff0000 });
    geoCylinder = new THREE.CylinderGeometry( 
        0.1, 1, 20 * 2, 8
    );

    tRoot = new THREE.Mesh(geoCylinder, matCylinder);
    scene.add(tRoot);

    createBranch(tRoot, 2, 2);

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