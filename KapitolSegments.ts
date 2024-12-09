import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export enum segments {
    BABILON = 0,
    BASIC = 1,
    GREEN = 2,
    NAME = 3
}

export class KapitolSegments{

    ready = false;
    gradientTexture: any; 

    constructor(){
        this.gradientTexture = new THREE.TextureLoader().load('gradient.png'); 
        this.gradientTexture.minFilter = THREE.NearestFilter; 
        this.gradientTexture.magFilter = THREE.NearestFilter;
    }


    getSegment(segment: segments){
 
        var meshes: Array<THREE.Object> = []; 
        let m = new THREE.MeshToonMaterial(
            {
                color: 0xFFFAED,
                gradientMap: this.gradientTexture
            }
        )
        m.userData.outlineParameters = {
            thickness: 0.01,
            color: new THREE.Color().setHSL(0, 0, 0).toArray(),
            alpha: 1,
            visible: true
       };

       let mGreen = new THREE.MeshToonMaterial(
        {
            color: 0x34AF65,
            gradientMap: this.gradientTexture
        }
        )
        mGreen.userData.outlineParameters = {
            thickness: 0.01,
            color: new THREE.Color().setHSL(0, 0, 0).toArray(),
            alpha: 1,
            visible: true
    };


        // Shared box geometry
        const centralBoxGeometry = new THREE.BoxGeometry(1, 1, 2);
        const sideBoxGeometry = new THREE.BoxGeometry(2, 1, 3);

        // Create central box mesh
        const centralBoxMesh = new THREE.Mesh(centralBoxGeometry, m);
        centralBoxMesh.rotateY(Math.PI);
        meshes.push(centralBoxMesh);

        // Create left box mesh
        const leftBoxMesh = new THREE.Mesh(sideBoxGeometry, m);
        leftBoxMesh.position.set(1.5, 0, 0)
        leftBoxMesh.rotateY(Math.PI);
        meshes.push(leftBoxMesh);

        // Create right box mesh
        let rightBoxMesh: THREE.Mesh;
        if(segment == segments.GREEN) rightBoxMesh = new THREE.Mesh(sideBoxGeometry, mGreen);
        else rightBoxMesh = new THREE.Mesh(sideBoxGeometry, m);
        rightBoxMesh.position.set(-1.5, 0, 0);
        rightBoxMesh.rotateY(Math.PI);
        meshes.push(rightBoxMesh);

        return meshes;
    }

    repositionSegments(meshes: THREE.Object[], vector: { x: number; y: number; z: number; }, rotation: THREE.Quaternion){
        meshes[0].position.set(vector.x, vector.y, vector.z);
        meshes[0].setRotationFromQuaternion(rotation);
        meshes[1].position.set(vector.x + 1.5, vector.y, vector.z);
        meshes[1].setRotationFromQuaternion(rotation)
        meshes[2].position.set(vector.x - 1.5, vector.y, vector.z);
        meshes[2].setRotationFromQuaternion(rotation)
    }

}