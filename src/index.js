import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

// local files
import * as Listeners from './listeners.js';
import globalObj from './variables.js';
import * as Tree from './makeTree.js';
import createUI from './createUI.js';


function init(){

    var initialBranches = 4, initialDepth = 4;

    globalObj.scene = new THREE.Scene();
    globalObj.scene.background = new THREE.Color( 0xf0f0f0 );
    globalObj.scene.name = "scene";
    globalObj.camera = new THREE.PerspectiveCamera(
        70, 
        window.innerWidth / window.innerHeight, 
        1, 
        10000
    );
    globalObj.camera.position.z = 300;

    globalObj.light = new THREE.AmbientLight ( 0xffffff, 1 );
    globalObj.scene.add( globalObj.light );

    globalObj.raycaster = new THREE.Raycaster();
    globalObj.renderer = new THREE.WebGLRenderer({antialias: true});
    globalObj.renderer.setPixelRatio( window.devicePixelRatio );
    globalObj.renderer.setSize(window.innerWidth, window.innerHeight);
    
    createUI();
    globalObj.objectsInScene = [];
    globalObj.pivots = [];
    
    globalObj.matCylinder = new THREE.MeshLambertMaterial( {
        color: 0x377B8C
    } );
    globalObj.matSphere = new THREE.MeshLambertMaterial({color: 0xff0000 });
    globalObj.geoCylinder = new THREE.CylinderGeometry( 
        0.1 * initialBranches, initialBranches, 20 * initialBranches * initialDepth, 8
    );

    globalObj.tRoot = new THREE.Mesh(globalObj.geoCylinder, globalObj.matCylinder);
    globalObj.tRoot.name = "root";
    globalObj.objectsInScene.push(globalObj.tRoot);
    globalObj.scene.add(globalObj.tRoot);


    document.getElementById("branchInput").value = initialBranches;
    document.getElementById("recurInput").value = initialDepth;
    Tree.createBranch(globalObj.tRoot, initialBranches, initialDepth);
    document.getElementById('rotateBox').checked = true;
    for(let i = 0;i<50;i++) Tree.rotateBranchs();
    document.getElementById('rotateBox').checked = false;
    

    globalObj.mouse = new THREE.Vector2();
    globalObj.controls = new TrackballControls(globalObj.camera, globalObj.renderer.domElement);
    globalObj.controls.addEventListener('change', render);
}


function animate(){
    requestAnimationFrame(animate);
    globalObj.controls.update();
    render();
}



function render(){
    globalObj.camera.lookAt( globalObj.scene.position );
	globalObj.camera.updateMatrixWorld();

    globalObj.raycaster.setFromCamera( globalObj.mouse, globalObj.camera );
    
    Tree.rotateBranchs();

	const intersects = globalObj.raycaster.intersectObjects( globalObj.objectsInScene, false );
    //console.log(`number of intersected objects: ${intersects.length}`);


    if ( intersects.length > 0 ) {

        globalObj.intersectPoint = intersects[0].point;
        if ( globalObj.INTERSECTED != intersects[ 0 ].object ) {

            if ( globalObj.INTERSECTED ) globalObj.INTERSECTED.material.emissive.setHex( globalObj.INTERSECTED.currentHex );

            console.log(`object name: ${intersects[0].object.name}`);
            globalObj.INTERSECTED = intersects[ 0 ].object;
            globalObj.INTERSECTED.currentHex = globalObj.INTERSECTED.material.emissive.getHex();
            globalObj.INTERSECTED.material.emissive.setHex( 0x00ff00 );

        }

    } else {

        if ( globalObj.INTERSECTED ) globalObj.INTERSECTED.material.emissive.setHex( globalObj.INTERSECTED.currentHex );

        globalObj.INTERSECTED = null;

    }

    globalObj.renderer.render( globalObj.scene, globalObj.camera );
}



window.addEventListener('resize', Listeners.onWindowResize, false);
document.addEventListener( 'mousemove', Listeners.onDocumentMouseMove, false );
document.addEventListener('click', Listeners.onDocumentMouseDown, false);


init();
animate();