import * as THREE from 'three';
import _, { isEmpty } from 'lodash';

// local files
import globalObj from './variables.js';

export function rotateBranchs(){
    var isRotate = document.getElementById('rotateBox').checked;
    //console.log('ISROTATE: ' + isRotate);

    if(isRotate){
        //console.log('rotating');
        for(let i = 0;i<globalObj.pivots.length;i++){
            globalObj.pivots[i].rotation.y += 0.01;
        }
    }
}



export function createTree(){
    // handling input
    var branchEl = document.getElementById("branchInput");
    var recurEl = document.getElementById("recurInput");

    var branch = getValueFromElement(branchEl, globalObj.MAX_BRANCH);
    var recursion = getValueFromElement(recurEl, globalObj.MAX_RECUR);

    // setting up root mesh
    globalObj.geoCylinder = new THREE.CylinderGeometry( 
        0.1, 1, 20 * branch * recursion, 8
    );

    globalObj.tRoot = new THREE.Mesh(globalObj.geoCylinder, globalObj.matCylinder);
    globalObj.tRoot.name = "root";
    globalObj.scene = new THREE.Scene();
    globalObj.scene.background = new THREE.Color( 0xf0f0f0 );
    globalObj.scene.name = "scene";
    globalObj.scene.add( globalObj.light );
    globalObj.objectsInScene.length = 0;
    globalObj.pivots.length = 0;
    globalObj.objectsInScene.push(globalObj.tRoot);
    globalObj.scene.add(globalObj.tRoot);

    // building tree
    createBranch(globalObj.tRoot, branch, recursion);
    
    document.getElementById('rotateBox').checked = true;
    for(let i = 0;i<100;i++) rotateBranchs();
    document.getElementById('rotateBox').checked = false;

    globalObj.camera.position.z = 100 * branch;
}



export function attachAtAngle(root, child, angle, pos, offset){
    var childWrapper = new THREE.Object3D();
    childWrapper.name = "pivot";
    globalObj.pivots.push(childWrapper);
    childWrapper.add(child);
    root.add(childWrapper);

    childWrapper.position.set(pos.x,
        pos.y,
        pos.z);
    

    child.position.set(0  ,
        offset,
        0 );

    if(pos.x > 0)   childWrapper.rotation.y += 180 * 3.1416 / 180.0 ;
    childWrapper.rotation.z += angle * 3.1416 / 180.0 ;
    //childWrapper.rotation.y += 3 * angle * 3.1416 / 180.0 ;
}


export function createBranch(root, nBranch, recur){
    if(recur == 0){
        return;
    }

    var angle = 60;
    var rootHeight = root.geometry.parameters.height * 0.9;
    var posY = -(rootHeight * 0.8) / 2;
    var gap = (rootHeight * 0.8) / nBranch;
    var height = rootHeight * 0.50;
    let geom = globalObj.geoCylinder;

    geom = new THREE.CylinderGeometry( 
        0.1, 0.3, height, 8
    );
    
    if (recur == 1) {
        height = nBranch * 2;
        geom = new THREE.CylinderGeometry( 
            0.1, 0.3, height, 8
        );
    }
    
    
    var pos;
    for(var i =0;i<nBranch;i++){
        var child = new THREE.Mesh(geom, globalObj.matSphere.clone());
        child.name = "child" + i + recur;
        globalObj.objectsInScene.push(child);
        pos = new THREE.Vector3(0, posY, 0);
        attachAtAngle(root, child, angle, pos, height/2);
        createBranch(child, nBranch, recur-1);

        if(angle == 60) angle = 300;
        else    angle = 60;
        posY = posY + gap;
    }
}

function getValueFromElement(elem, lim){
    
    //console.log(elem.value);
    var val = parseInt(elem.value);

    if (isNaN(val) || isEmpty(elem.value) 
        || val > lim || val < 1){
            val = 2;
            elem.value = "2";
        }  
    
    return val;
}