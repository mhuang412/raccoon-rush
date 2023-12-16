import { Clock, Box3, Vector3, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Worker.glb';
import { HittableObject } from '../HittableObject'; 

const scale = new Vector3(1.5, 2, 1.5);
const translation = new Vector3(0, 0.7, 0);
let clock = new Clock();

class Worker extends HittableObject {
    constructor(parent, position, min_pos, name) {
        // Call parent Group() constructor
        super(parent, position, min_pos, name);

        const loader = new GLTFLoader();

        this.name = 'worker';
        this.p = position;
        this.p = position.add(translation);
        this.parent = parent;

        loader.load(MODEL, (gltf) => {
            gltf.scene.rotateY(-Math.PI/2);
            gltf.scene.scale.set(scale.x, scale.y, scale.z);
            this.box = new Box3().setFromObject(gltf.scene, true).translate(this.p);
            let model = gltf.scene;
            this.add(model);
            this.isLoaded = true;
            this.mixer = new AnimationMixer( gltf.scene );
            gltf.animations.forEach((clip) => {
                this.mixer.clipAction(clip).play();})
        });

        this.position.x = this.p.x;
        this.position.y = this.p.y;
        this.position.z = this.p.z;
    }

    update(timeStamp) {
        if (this.deactivate) return;
        if (this.mixer) {
            this.mixer.update(clock.getDelta());
        }        
        this.move(timeStamp);
        this.checkCollision(this.parent.state.character);
    }
}

export default Worker;