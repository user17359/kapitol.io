import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import { spawnPoint } from './consts';
import { Segment } from './Segment';
import { segments } from '../KapitolSegments';
import { segmentsOnBoard, scene } from '../main';

export function createNewSegment(world: RAPIER.world, segmentID: number) {
	segmentsOnBoard[segmentsOnBoard.length - 1].startGravity();
	spawnPoint.y += 1;
	segmentID += 1;

	setTimeout(function () {
		if (segmentID == 13) {
			segmentsOnBoard.push(new Segment(world, spawnPoint, segments.GREEN, scene));
		}
		else if (segmentID == 15) {
			segmentsOnBoard.push(new Segment(world, spawnPoint, segments.NAME, scene));
		}
		else {
			if (segmentID < 15) {
				segmentsOnBoard.push(new Segment(world, spawnPoint, segments.BASIC, scene));
			}
			else {
			}
		}
	}, 1500);
}
