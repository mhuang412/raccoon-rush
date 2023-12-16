import { Group, Vector3, Box3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './raccoon.gltf';
import { SIDEWALK_SIZE } from '../Sidewalk';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';


const scale = new Vector3(0.5, 0.5, 0.5);

class Raccoon extends Group {
    constructor(parent, position) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'raccoon';
        this.p = position;
        this.parent = parent;

        loader.load(MODEL, (gltf) => {
            let model = gltf.scene;
            model.scale.set(scale.x, scale.y, scale.z);
            model.rotateY(Math.PI / 2);
            this.add(model);
            this.box = new Box3().setFromObject(gltf.scene, true);
            console.log(this.box);
        });
        this.position.x = position.x;
        this.position.y = position.x;
        this.position.z = position.x;
        this.box = new Box3();
    }

    changeLanes(dir) {
        if (dir == -1) {
            const moveDis = new TWEEN.Tween(this.position)
            .to({ z: this.position.z - SIDEWALK_SIZE.z / 3 }, 250)
            .easing(TWEEN.Easing.Quadratic.Out);

            moveDis.start();
            // this.position.z -= SIDEWALK_SIZE.z / 20;
            // this.box.translate(new Vector3(0, 0, -SIDEWALK_SIZE.z/20));
        }
        if (dir == 1) {
            const moveDis = new TWEEN.Tween(this.position)
            .to({ z: this.position.z + SIDEWALK_SIZE.z / 3 }, 250)
            .easing(TWEEN.Easing.Quadratic.Out);

            moveDis.start();

            // this.position.z += SIDEWALK_SIZE.z / 20;
            // this.box.translate(new Vector3(0, 0, SIDEWALK_SIZE.z/20));
        }

    }

    update(timestamp) {
        this.box.setFromObject(this);
        TWEEN.update();
        if (this.position.z <= -SIDEWALK_SIZE.z) {
            let diff = -SIDEWALK_SIZE.z + 0.01 - this.position.z;
            this.position.z += diff;
            // this.box.translate(new Vector3(0, 0, diff));
        }
        if (this.position.z >= SIDEWALK_SIZE.z) {
            let diff = SIDEWALK_SIZE.z + 0.01 - this.position.z;
            this.position.z += diff;
           // this.box.translate(new Vector3(0, 0, diff))
        }
        // console.log(this.box);
    }
}

export default Raccoon;