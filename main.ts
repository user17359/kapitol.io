import * as THREE from 'three';
import { segments, KapitolSegments } from './KapitolSegments';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import { cameraTick, spawnPoint} from './gameLogic/consts.ts'
import { Segment } from './gameLogic/Segment';
import { sceneInitialize } from './initialization/sceneInitialize.ts';
import { cameraInitialize } from './initialization/cameraInitialize.ts';
import { delay } from './utils/delay.ts';
import { createNewSegment } from './gameLogic/createNewSegment.ts';
import { cameraMove } from './gameLogic/consts.ts';

export let cameraYChange = 0.0;
let world: RAPIER.World;
export let segmentsOnBoard: Array<Segment> = [];
let segmentID = 1;

export const kapitolSegments = new KapitolSegments();


while(!kapitolSegments.fontLoaded){
	await delay(100);
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 88 && world != undefined) {
        createNewSegment(world, segmentID)
		segmentID += 1;
		cameraYChange += cameraMove;
    }
};

document.body.appendChild( renderer.domElement );

export let scene = sceneInitialize();
let camera = cameraInitialize(scene);

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
	segmentsOnBoard.push(new Segment(world, {"x": 0, "y": 0.5, "z":0}, segments.BABILON, scene));
	segmentsOnBoard[0].startGravity();

	// Create the 1 segment
	segmentsOnBoard.push(new Segment(world, spawnPoint, segments.BASIC, scene));
    
	let gameLoop = () => {
		// Step the simulation forward.  
		world.step();
	
		segmentsOnBoard.forEach((seg) => {seg.update()}) 
	
		setTimeout(gameLoop, 16);
	};

	gameLoop();
});