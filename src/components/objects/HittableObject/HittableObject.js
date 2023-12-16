import { Group, Box3, Vector3 } from 'three';
import { SIDEWALK_SIZE } from '../Sidewalk/';

const scale = new Vector3(1, 1, 1);

class HittableObject extends Group {
    constructor(parent, position, min_pos, name) {
        // Call parent Group() constructor
        super();
        this.box = new Box3(new Vector3(0, 0, 0), new Vector3(0,0,0));
        this.parent = parent;
        this.min_pos = min_pos;
        this.isLoaded = false;
        this.isHit = false;
        this.deactivate = false;
    }

    checkCollision(character) {
        if (this.isLoaded) {
            if (this.box.intersectsBox(character.box)) {
                this.isHit = true;
                this.deactivate = true;
            }
        }
    }

    move(timeStamp) {
        let dist = -SIDEWALK_SIZE.x /30;
        this.p.x += dist;
        this.position.x += dist;
        this.box.translate(new Vector3(dist, 0, 0));
        if (this.position.x < this.min_pos * SIDEWALK_SIZE.x) {
            this.deactivate = true;
        }
    }
}

export default HittableObject;