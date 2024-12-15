import * as THREE from 'three';

export function sceneInitialize (): THREE.Scene{
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xA0DCE5);
    
    const geometry = new THREE.PlaneGeometry( 20, 20 );
    const material = new THREE.MeshToonMaterial( {color: 0x447C00, side: THREE.DoubleSide} ); 
    const plane = new THREE.Mesh( geometry, material );
    plane.rotateX(Math.PI/2)
    plane.translateZ(0.5)
    scene.add( plane );

    return scene
}