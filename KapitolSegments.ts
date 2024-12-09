import * as THREE from 'three';

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


        // Shared box geometry
        const centralBoxGeometry = new THREE.BoxGeometry(2, 1, 5);
        const sideBoxGeometry = new THREE.BoxGeometry(2, 1, 6);

        // Create central box mesh
        const centralBoxMesh = new THREE.Mesh(centralBoxGeometry, m);
        centralBoxMesh.scale.set(0.5, 0.5, 0.5);
        centralBoxMesh.rotateY(Math.PI);
        meshes.push(centralBoxMesh);

        // Create left box mesh
        const leftBoxMesh = new THREE.Mesh(sideBoxGeometry, m);
        leftBoxMesh.position.set(1, 0, 0); // Use position.set instead of translateX
        leftBoxMesh.scale.set(0.5, 0.5, 0.5);
        leftBoxMesh.rotateY(Math.PI);
        meshes.push(leftBoxMesh);

        // Create right box mesh
        const rightBoxMesh = new THREE.Mesh(sideBoxGeometry, m);
        rightBoxMesh.position.set(-1, 0, 0); // Use position.set instead of translateX
        rightBoxMesh.scale.set(0.5, 0.5, 0.5);
        rightBoxMesh.rotateY(Math.PI);
        meshes.push(rightBoxMesh);

        return meshes;
    }

}