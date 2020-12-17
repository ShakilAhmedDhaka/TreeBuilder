import './style.css';
import _ from 'lodash';
import printMe from './print.js';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';


let scene, camera, renderer, controls;

function init(){
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


    const geometry = new THREE.CylinderGeometry( 
        1, 1, 20, 8
    );

    const material = new THREE.MeshBasicMaterial( {
        color: 0x377B8C
    } );


    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    var geo = new THREE.EdgesGeometry( mesh.geometry ); // or WireframeGeometry
    var mat = new THREE.LineBasicMaterial( { color: 0xDFDEE0, linewidth: 2 } );
    var wireframe = new THREE.LineSegments( geo, mat );
    mesh.add( wireframe );


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