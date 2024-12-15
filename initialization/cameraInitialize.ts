import * as THREE from 'three';

export function cameraInitialize (scene: THREE.Scene): THREE.Camera{
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // White light with intensity 1
    directionalLight.position.set(2, 8, 4);
    
    scene.add(directionalLight);

    // isometric camera
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    let distance = 7;
    camera.position.set( distance, distance, distance );
    camera.lookAt( scene.position );
    camera.translateY(3)

    return camera
}