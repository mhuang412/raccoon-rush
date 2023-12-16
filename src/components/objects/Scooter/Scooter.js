import { Group, Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scooter.gltf';
import { HittableObject } from '../HittableObject';

const scale = new Vector3(0.4, 0.4, 0.4);
const translation = new Vector3(0, 0, 0);

class Scooter extends HittableObject {
    constructor(parent, position, min_pos, name) {
        // Call parent Group() constructor
        super(parent, position, min_pos, name);

        const loader = new GLTFLoader();

        this.name = 'scooter';
        this.p = position;
        this.p = position.add(translation);
        this.parent = parent;

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(scale.x, scale.y, scale.z);
            this.box = new Box3().setFromObject(gltf.scene, true).translate(this.p);
            let model = gltf.scene;
            this.add(model);
            this.isLoaded = true;
        });

        this.position.x = this.p.x;
        this.position.y = this.p.y;
        this.position.z = this.p.z;
    }

    update(timeStamp) {
        if (this.deactivate) return;
        this.move(timeStamp);
        this.move(timeStamp);
        this.move(timeStamp);
        this.checkCollision(this.parent.state.character);
    }
}

export default Scooter;