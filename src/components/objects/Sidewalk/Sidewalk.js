import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './sidewalk.gltf';

const scale = new Vector3(1, 1, 1);

class Sidewalk extends Group {
    constructor(parent, position, min_pos, max_pos, name) {
        super();

        const loader = new GLTFLoader();

        this.name = name;
        this.p = position;
        this.min_pos = min_pos;
        this.max_pos = max_pos;
        this.parent = parent;

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(scale.x, scale.y, scale.z);
            let model = gltf.scene;
            this.add(model);
        });
        this.position.x = this.p.x;
        this.position.y = this.p.y;
        this.position.z = this.p.z;
    }

    update(timeStamp) {
        // console.log(this.name);
        this.move(timeStamp);
    }

    move(timeStamp) {
        this.p.x -= SIDEWALK_SIZE.x /30;
        this.position.x -= SIDEWALK_SIZE.x/30;
        if (this.p.x < this.min_pos * SIDEWALK_SIZE.x) {
            this.position.x = this.max_pos * SIDEWALK_SIZE.x;
            this.p.x = this.max_pos * SIDEWALK_SIZE.x;
            this.p.x -= SIDEWALK_SIZE.x/30;
            this.position.x -= SIDEWALK_SIZE.x/30;
        }
    }
}

export default Sidewalk;

export const SIDEWALK_SIZE = new Vector3(3.48, 0.12, 3.48);