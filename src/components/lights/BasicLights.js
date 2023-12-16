import { Group, SpotLight, AmbientLight, HemisphereLight } from 'three';

class BasicLights extends Group {
    constructor(parent, ...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 1.32);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        dir.position.set(0, 5, 0);
        dir.target.position.set(0, 0, 0);

        this.add(ambi, hemi, dir);
        // this.parent.addToUpdateList(this);
    }

    update(timeStamp) {
        dir.position.set(-8, -8 ,5 * Math.sin(timeStamp/100000));
    }
}

export default BasicLights;
