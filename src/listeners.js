import * as THREE from 'three';
import globalObj from './variables.js';
import * as Tree from './makeTree.js';

export function onWindowResize() {
    globalObj.camera.aspect = window.innerWidth / window.innerHeight;
    globalObj.camera.updateProjectionMatrix();
    globalObj.renderer.setSize(window.innerWidth, window.innerHeight);
}


export function onDocumentMouseMove( event ) {

    event.preventDefault();

    globalObj.mouse.x = ( ( event.clientX - globalObj.renderer.domElement.offsetLeft ) / globalObj.renderer.domElement.clientWidth ) * 2 - 1;
    globalObj.mouse.y = - ( ( event.clientY - globalObj.renderer.domElement.offsetTop ) / globalObj.renderer.domElement.clientHeight ) * 2 + 1;

    // console.log(mouse.x);
    // console.log(mouse.y);
}


export function onDocumentMouseDown(event){
    console.log("mouse clicked");

    if(globalObj.INTERSECTED){
        console.log("branch selected");
        var geom = new THREE.CylinderGeometry( 
            0.1, .15, 4, 8
        );
        var child = new THREE.Mesh(geom, globalObj.matSphere.clone());
        globalObj.objectsInScene.push(child);

        console.log(globalObj.INTERSECTED);
        var pos = globalObj.INTERSECTED.position.y;
        Tree.attachAtAngle(globalObj.INTERSECTED, child, 60, pos/3);
    }
    
}
