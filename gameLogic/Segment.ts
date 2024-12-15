import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { segments } from '../KapitolSegments';
import { kapitolSegments} from '../main';
import { oscilatorBound, oscilatorStep } from './consts.ts'

export class Segment {
	scene: THREE.Scene;
	meshes: THREE.Object[];
	rigidbody: RAPIER.RigidBody;
	oscilating = true;
	oscilatorValue = 0;
	oscialtorDir = true;

	constructor(world: RAPIER.World, position: { x: number; y: number; z: number; }, segment: segments, scene: THREE.Scene) {
		this.scene = scene;
		this.meshes = kapitolSegments.getSegment(segment);
		console.log("Adding", this.meshes?.length, "meshes");
		this.meshes?.forEach((obj) => { scene.add(obj); });

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
		if (this.oscilating) {
			this.rigidbody.setLinvel({ x: 0, y: 0, z: this.oscilatorValue });
			if (this.oscialtorDir && this.oscilatorValue < oscilatorBound) {
				this.oscilatorValue += oscilatorStep;
			}
			else if (this.oscialtorDir && this.oscilatorValue >= oscilatorBound) {
				this.oscialtorDir = !this.oscialtorDir;
			}
			if (!this.oscialtorDir && this.oscilatorValue > -oscilatorBound) {
				this.oscilatorValue -= oscilatorStep;
			}
			else if (!this.oscialtorDir && this.oscilatorValue <= -oscilatorBound) {
				this.oscialtorDir = !this.oscialtorDir;
			}
		}
		if (this.rigidbody != undefined) {
			kapitolSegments.repositionSegments(this.meshes, { "x": pos.x, "y": pos.y, "z": pos.z }, new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w));
		}
	}
}
