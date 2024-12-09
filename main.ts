import * as THREE from 'three';
import { segments, KapitolSegments } from './KapitolSegments';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

const kapitolSegments = new KapitolSegments();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xA0DCE5);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // White light with intensity 1
directionalLight.position.set(2, 8, 4);

scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.PlaneGeometry( 15, 15 );
const material = new THREE.MeshToonMaterial( {color: 0x447C00, side: THREE.DoubleSide} ); 
const plane = new THREE.Mesh( geometry, material );
plane.rotateX(Math.PI/2)
plane.translateZ(0.4)
scene.add( plane );

const objects = kapitolSegments.getSegment(segments.BASIC);
objects.forEach((obj) => scene.add(obj)) 
const objects2 = kapitolSegments.getSegment(segments.BASIC);
objects2.forEach((obj) => {obj.translateY(2); scene.add(obj)}) 

// isometric camera
let distance = 5;
camera.position.set( distance, distance, distance );
camera.lookAt( scene.position );

let effect = new OutlineEffect( renderer );

function animate() {
	
}

renderer.setAnimationLoop(() => {
	animate()
	effect.render(scene, camera);
})