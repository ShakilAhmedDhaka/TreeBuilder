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
        0.1, 1, 20 * branch, 8
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
}



export function attachAtAngle(root, child, angle, pos){
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
    globalObj.pivots.push(childWrapper);
    childWrapper.add(child);
    root.add(childWrapper);
    childWrapper.position.set(positionToAttach.x,
        pos,
        positionToAttach.z);
    

    child.position.set(positionToAttach.x  ,
        positionToAttach.y + childDimY / 2.0,
        positionToAttach.z );

    childWrapper.rotation.z += angle * 3.1416 / 180.0 ;
    childWrapper.rotation.y += 3 * angle * 3.1416 / 180.0 ;
}


export function createBranch(root, nBranch, recur){
    if(recur == 0){
        return;
    }

    var angle = 60;
    var height = nBranch * 10;
    var gap = height / nBranch;
    var pos = nBranch * -4;
    let geom = globalObj.geoCylinder;

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
        var child = new THREE.Mesh(geom, globalObj.matSphere.clone());
        child.name = "child" + i + recur;
        globalObj.objectsInScene.push(child);
        attachAtAngle(root, child, angle, pos);
        createBranch(child, nBranch, recur-1);

        if(angle == 60) angle = 300;
        else    angle = 60;
        pos = pos + gap;
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