import * as THREE from 'three';
import { segments, KapitolSegments } from './KapitolSegments';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

const kapitolSegments = new KapitolSegments();

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

while(!kapitolSegments.fontLoaded){
	await delay(100);
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xA0DCE5);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // White light with intensity 1
directionalLight.position.set(2, 8, 4);

scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let cameraYChange = 0.0;
const cameraTick = 0.05;
const cameraMove = 0.75;

let spawnPoint = {"x": 0, "y": 8.0, "z":0};
const spawnPointMove = 0.75;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );

let world: RAPIER.World;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 88 && world != undefined) {
        createNewSegment(world)
    }
};

document.body.appendChild( renderer.domElement );

const geometry = new THREE.PlaneGeometry( 20, 20 );
const material = new THREE.MeshToonMaterial( {color: 0x447C00, side: THREE.DoubleSide} ); 
const plane = new THREE.Mesh( geometry, material );
plane.rotateX(Math.PI/2)
plane.translateZ(0.5)
scene.add( plane );

let segmentsOnBoard: Array<Segment> = [];

// isometric camera
let distance = 7;
camera.position.set( distance, distance, distance );
camera.lookAt( scene.position );
camera.translateY(3)

let effect = new OutlineEffect( renderer );

function animate() {
	if(cameraYChange > 0){
		camera.translateY(cameraTick);
		camera.translateZ(cameraTick);
		cameraYChange -= cameraTick;
	}
}

renderer.setAnimationLoop(() => {
	animate()
	effect.render(scene, camera);
})

RAPIER.init().then(() => {

    // Use the RAPIER module here.
    let gravity = { x: 0.0, y: -9.81, z: 0.0 };

	world = new RAPIER.World(gravity);

    // Create the ground
    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(20.0, 0.5, 20.0)
	.setTranslation(0.0, -0.5, 0.0);
    world.createCollider(groundColliderDesc);

	// Create the 0 segment
	segmentsOnBoard.push(new Segment(world, {"x": 0, "y": 0.5, "z":0}, segments.BABILON));
	segmentsOnBoard[0].startGravity();

	// Create the 1 segment
	segmentsOnBoard.push(new Segment(world, spawnPoint, segments.BASIC));
    
	let gameLoop = () => {
		// Step the simulation forward.  
		world.step();
	
		segmentsOnBoard.forEach((seg) => {seg.update()}) 
	
		setTimeout(gameLoop, 16);
	};

	gameLoop();
});

let segmentID = 1;
function createNewSegment(world: RAPIER.world){

	segmentsOnBoard[segmentsOnBoard.length - 1].startGravity();
	cameraYChange += cameraMove;
	spawnPoint.y += 1;
	segmentID += 1;

	setTimeout(function(){
		if(segmentID == 13){
			segmentsOnBoard.push(new Segment(world, spawnPoint, segments.GREEN));
		}
		else if(segmentID == 15){
			segmentsOnBoard.push(new Segment(world, spawnPoint, segments.NAME));
		}
		else{
			if(segmentID < 15){
				segmentsOnBoard.push(new Segment(world, spawnPoint, segments.BASIC));
			}
			else{

			}
		}
	}, 1500);
}

let oscilatorBound = 3;
let oscilatorStep = 0.05;

class Segment{
	meshes: THREE.Object[]
	rigidbody: RAPIER.RigidBody;
	oscilating = true; 
	oscilatorValue = 0;
	oscialtorDir = true;

	constructor (world: RAPIER.World, position:{ x: number; y: number; z: number; }, segment: segments) {
		this.meshes = kapitolSegments.getSegment(segment);
		console.log("Adding", this.meshes?.length, "meshes")
		this.meshes?.forEach((obj) => {scene.add(obj)}) 

		 let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
		 .setTranslation(position.x, position.y, position.z);
		this.rigidbody = world.createRigidBody(rigidBodyDesc);

		this.rigidbody.setGravityScale(0.0);
	
		let colliderDesc = RAPIER.ColliderDesc.cuboid(4.0, 0.5, 3.0).setDensity(10.0);
		world.createCollider(colliderDesc, this.rigidbody);

		this.update();
	}

	startGravity() {
		this.rigidbody.setGravityScale(1.0);
		this.oscilating = false;
	}

	update() {
		let pos = this.rigidbody.translation();
		let rot = this.rigidbody.rotation();
		if(this.oscilating){
			this.rigidbody.setLinvel({ x: 0, y: 0, z: this.oscilatorValue })
			if(this.oscialtorDir && this.oscilatorValue < oscilatorBound){
				this.oscilatorValue += oscilatorStep;
			}
			else if(this.oscialtorDir && this.oscilatorValue >= oscilatorBound){
				this.oscialtorDir = !this.oscialtorDir
			}
			if(!this.oscialtorDir && this.oscilatorValue > -oscilatorBound){
				this.oscilatorValue -= oscilatorStep;
			}
			else if(!this.oscialtorDir && this.oscilatorValue <= -oscilatorBound){
				this.oscialtorDir = !this.oscialtorDir
			}
		}
		if(this.rigidbody != undefined){
			kapitolSegments.repositionSegments(this.meshes, {"x": pos.x, "y": pos.y, "z": pos.z}, new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w)) ;
		}
	}
	
}
