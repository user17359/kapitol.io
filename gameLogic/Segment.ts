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

		// TODO: Initialize rigidbody with 0 gravity

		// TODO: Initialize collider

		this.update();
	}

	startGravity() {
		// TODO: Set gravity to neutral state

		this.oscilating = false;
	}

	update() {
		let pos = this.rigidbody.translation();
		let rot = this.rigidbody.rotation();
		if (this.oscilating) {
			// TODO: Set velocity on z-axis to this.oscilatorValue
			
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
