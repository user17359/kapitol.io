import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

export enum segments {
    BABILON = 0,
    BASIC = 1,
    GREEN = 2,
    NAME = 3
}

export class KapitolSegments{

    ready = false;
    gradientTexture: any; 
    fnt: any;
    fontLoaded = false;

    constructor(){
        const loader = new FontLoader();

        loader.load( 'fonts/helvetiker_regular.typeface.json', (font: any) => {
            this.fnt = font;
            this.fontLoaded = true;
        });

        this.gradientTexture = new THREE.TextureLoader().load('gradient.png'); 
        this.gradientTexture.minFilter = THREE.NearestFilter; 
        this.gradientTexture.magFilter = THREE.NearestFilter;
    }


    getSegment(segment: segments): Array<THREE.Object>{
 
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

        //Special Babilon rules
        if(segment == segments.BABILON){
            console.log(this.fnt)

            const textGeo = new TextGeometry( "Babilon", {
                font: this.fnt,
                size: 0.4,
                depth: 0.1,
                curveSegments: 12,
            } );
        
            const textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
        
            const text1 = new THREE.Mesh( textGeo, textMaterial );
            text1.position.set( 0.5, 0.5, 1.5 );
        
            meshes.push(text1);
            console.log("meshes now", meshes.length)

            const text2Geo = new TextGeometry( "pizzeria", {
                font: this.fnt,
                size: 0.3,
                depth: 0.1,
                curveSegments: 12,
            } );
        
            const text2Material = new THREE.MeshPhongMaterial( { color: 0x333333 } );
        
            const text2 = new THREE.Mesh( text2Geo, text2Material );
            text2.position.set( 0.5, 0, 1.5 );
        
            meshes.push( text2 );

       }

       //Special name rules
       if(segment == segments.NAME){
            console.log(this.fnt)

            const textGeo = new TextGeometry( "KAPITOL", {
                font: this.fnt,
                size: 0.35,
                depth: 0.1,
                curveSegments: 12,
            } );
        
            const textMaterial = new THREE.MeshPhongMaterial( { color: 0x34AF65 } );
        
            const text1 = new THREE.Mesh( textGeo, textMaterial );
            text1.position.set( 0.5, 0.5, 1.5 );
        
            meshes.push(text1);

        }

       return meshes;
    }

    repositionSegments(meshes: THREE.Object[], vector: { x: number; y: number; z: number; }, rotation: THREE.Quaternion){
        meshes[0].position.set(vector.x, vector.y, vector.z);
        meshes[0].setRotationFromQuaternion(rotation);
        meshes[1].position.set(vector.x + 1.5, vector.y, vector.z);
        meshes[1].setRotationFromQuaternion(rotation)
        meshes[2].position.set(vector.x - 1.5, vector.y, vector.z);
        meshes[2].setRotationFromQuaternion(rotation)
        if(meshes.length == 4){
            meshes[3].position.set(vector.x - 2.5, vector.y, vector.z + 1.5);
            meshes[3].setRotationFromQuaternion(rotation)
        }
    }

}