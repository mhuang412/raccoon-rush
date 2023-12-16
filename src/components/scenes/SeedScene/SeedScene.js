import * as Dat from 'dat.gui';
import { Scene, Color, Vector3 } from 'three';
import * as THREE from 'three';
import { Scooter, Raccoon, Coin, Cone, Worker, Csign, Sidewalk, SIDEWALK_SIZE } from 'objects';
import { BasicLights } from 'lights';

const nightColor = new Color(0x000000);
const dayColor = new Color(0x7ec0ee);
const max_pos = 10;
const min_pos = -2;
const lanes = [-1, 0, 1];

// Add sounds
let listener = new THREE.AudioListener();
let sounds = [];
let audioLoader = new THREE.AudioLoader();

let hit = new THREE.Audio(listener);
sounds['hit'] = hit;
audioLoader.load(
    'https://raw.githubusercontent.com/mhuang412/COS426-Final-Project/main/src/components/sounds/hit.mp3',
    function (buffer) {
        hit.setBuffer(buffer);
        hit.setLoop(false);
        hit.setVolume(0.50);
    }
);

let ding = new THREE.Audio(listener);
sounds['ding'] = ding;
audioLoader.load(
    'https://raw.githubusercontent.com/mhuang412/COS426-Final-Project/main/src/components/sounds/ding.mp3',
    function (buffer) {
        ding.setBuffer(buffer);
        ding.setLoop(false);
        ding.setVolume(0.50);
    }
);

let robbed = new THREE.Audio(listener);
sounds['robbed'] = robbed;
audioLoader.load(
    'https://raw.githubusercontent.com/mhuang412/COS426-Final-Project/main/src/components/sounds/robbed.mp3',
    function (buffer) {
        robbed.setBuffer(buffer);
        robbed.setLoop(false);
        robbed.setVolume(10);
    }
);

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            objList: [],
            updateList: [],
            terrainList: [],
            hittableList: [],
            workerList: [],
            coinList: [],
            character: null,
        };

        // Set background to a nice color
        this.background = nightColor;

        // game status
        this.gameStart = true;
        this.gameRunning = false;
        this.gameOver = false;
        this.gamePaused = false;
        this.coinsCollected = 0;

        // Add meshes to scene
        // const flower = new Flower(this);
        const lights = new BasicLights(this);
        this.add(lights);
        let sidewalk;
        for (let i = min_pos; i < max_pos; i++) {
            sidewalk = new Sidewalk(this, new Vector3(SIDEWALK_SIZE.x * i, 0, 0), min_pos, max_pos, i);
            this.add(sidewalk);
            this.state.terrainList.push(sidewalk);
        }

        this.state.character = new Raccoon(this, new Vector3(0, 0, 0));
        // const raccoon = new Scooter(this, new Vector3(0, 0, 0), min_pos, "scooter");
        this.add(this.state.character);

        console.log(this.state.updateList);

        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    death() {
        // game status
        this.gameStart = true;
        this.gameRunning = false;
        this.gameOver = true;
        this.gamePaused = false;
        //this.coinsCollected = 0;

        for (const obj of this.state.hittableList) { 
            this.remove(obj);
        }

        for (const obj of this.state.coinList) { 
            this.remove(obj);
        }

        for (const obj of this.state.workerList) { 
            this.remove(obj);
        }

        this.state.hittableList = [];
        this.state.coinList = [];
        this.state.workerList = [];

        this.remove(this.state.character);
        this.state.character = new Raccoon(this, new Vector3(0, 0, 0));
        this.add(this.state.character);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        this.spawnObjects(timeStamp);
        // Call update for each object in the updateList
        this.state.character.update(timeStamp);
        for (const obj of this.state.updateList) {
            obj.update(timeStamp);
        }
        for (const obj of this.state.terrainList) {
            obj.update(timeStamp);
        }
        for (const obj of this.state.coinList) {
            obj.update(timeStamp);
            if (obj.deactivate) {
                if (obj.isHit) {
                    // sounds['ding'].play();
                    this.coinsCollected += 1;
                    this.state.coinList.splice(this.state.coinList.indexOf(obj), 1);
                    this.remove(obj);
                // TODO: stop game when we hit any other obstacle
                }
            }
        }
        for (const obj of this.state.workerList) {
            obj.update(timeStamp);
            if (obj.deactivate) {
                if (obj.isHit) {
                    sounds['robbed'].play();
                    this.coinsCollected = Math.floor(this.coinsCollected / 2);
                    // this.state.workerList.splice(this.state.workerList.indexOf(obj), 1);
                    // this.remove(obj);
                // TODO: stop game when we hit any other obstacle
                }
                this.state.workerList.splice(this.state.workerList.indexOf(obj), 1);
                this.remove(obj);
            }
        }
        for (const obj of this.state.hittableList) {
            obj.update(timeStamp);
            if (obj.deactivate) {
                if (obj.isHit) {
                    sounds['hit'].play();
                    this.state.hittableList.splice(this.state.hittableList.indexOf(obj), 1);
                    this.remove(obj);
                    this.death();
                    break;
                // TODO: stop game when we hit any other obstacle
                }
                this.state.hittableList.splice(this.state.hittableList.indexOf(obj), 1);
                this.remove(obj);
            }
        }
        this.background = new Color().lerpColors(nightColor, dayColor, Math.sin(timeStamp/1000));
    }

    spawnObjects(timeStamp) {
        // SPAWN COINS + OBSTACLES
        // generate coins
        if (Math.random() < 0.01) {
            const coin = new Coin(this, new Vector3(SIDEWALK_SIZE.x * max_pos, 0, SIDEWALK_SIZE.z * lanes[Math.floor(Math.random() * lanes.length)]), min_pos, max_pos, timeStamp);
            this.add(coin);
            this.state.coinList.push(coin);
        }

        // generate cones
        if (Math.random() < 0.005) {
            const cone = new Cone(this, new Vector3(SIDEWALK_SIZE.x * max_pos, 0, SIDEWALK_SIZE.z * lanes[Math.floor(Math.random() * lanes.length)]), min_pos, max_pos, timeStamp);
            this.add(cone);
            this.state.hittableList.push(cone);
        }

        // generate csigns
        if (Math.random() < 0.005) {
            const csign = new Csign(this, new Vector3(SIDEWALK_SIZE.x * max_pos, 0, SIDEWALK_SIZE.z * lanes[Math.floor(Math.random() * lanes.length)]), min_pos, max_pos, timeStamp);
            this.add(csign);
            this.state.hittableList.push(csign);
        }

        // generate workers
        if (Math.random() < 0.001) {
            const worker = new Worker(this, new Vector3(SIDEWALK_SIZE.x * max_pos, 0, SIDEWALK_SIZE.z * lanes[Math.floor(Math.random() * lanes.length)]), min_pos, max_pos, timeStamp);
            this.add(worker);
            this.state.workerList.push(worker);
        }

        // generate scooters
        if (Math.random() < 0.005) {
            const lane = Math.random() < 0.5 ? 0.5 : -0.5;
            const scooter = new Scooter(this, new Vector3(SIDEWALK_SIZE.x * max_pos, 0, SIDEWALK_SIZE.z * lane), min_pos, max_pos, timeStamp);
            this.add(scooter);
            this.state.hittableList.push(scooter);
        }
    }
}

export default SeedScene;
