/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import './app.css';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
let keypress = null;
let highScore = 0;

// Set up camera
camera.position.set(-8, 5, 0);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.enabled = false;
controls.update();

// Add music
let listener = new THREE.AudioListener();
// camera.add(listener);
let sounds = [];
let audioLoader = new THREE.AudioLoader();

let bgmusic = new THREE.Audio(listener);
sounds['bgmusic'] = bgmusic;
audioLoader.load(
    'https://raw.githubusercontent.com/mhuang412/COS426-Final-Project/main/src/components/sounds/eyeofthetiger.mp3',
    function (buffer) {
        bgmusic.setBuffer(buffer);
        bgmusic.setLoop(true);
        bgmusic.setVolume(0.50);
    }
);

// make game over window
let endContainer = document.createElement('div');
endContainer.id = "game-over-container";
document.body.appendChild(endContainer);

// make instructions title
let endTitle = document.createElement('h1');
endTitle.innerText = "GAME OVER";
endContainer.appendChild(endTitle);

// create a line break between title and content
let endText = document.createElement('p');
endText.innerHTML = "You crashed into an obstacle :(";
endContainer.appendChild(endText);

let endText2 = document.createElement('p');
endText2.innerHTML = "Your score: " + scene.coinsCollected;
endContainer.appendChild(endText2);

let endText3 = document.createElement('p');
endText3.innerHTML = "High score: " + highScore;
endContainer.appendChild(endText3);

let endText4 = document.createElement('p');
endText4.innerHTML = "Hit spacebar to play again!";
endContainer.appendChild(endText4);

endContainer.style.visibility = 'hidden';

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    // check if game is over
    if (scene.gameOver) {
        // console.log("game OVER");
        endContainer.style.visibility = 'visible';
        titleContainer.style.visibility = 'visible';
        // change high scores
        endText2.innerHTML = "Your score: " + scene.coinsCollected;
        if (scene.coinsCollected > highScore) {
            highScore = scene.coinsCollected;
        }
        endText3.innerHTML = "High score: " + highScore;

        sounds['bgmusic'].stop();
        scene.gameOver = false;
        scene.gameStart = true;
        scene.gameRunning = false;
        scene.gamePaused = false;
        scene.coinsCollected = 0;
    }
    if (scene.gameRunning) {
        scene.update && scene.update(timeStamp);
    }

    coinText.innerText = "Coins: " + scene.coinsCollected;

    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Start theme music - spacebar click
document.addEventListener('keydown', function (event) {
    if (event.key === ' ') {
        if (scene.gameStart) {
            sounds['bgmusic'].play();
            scene.gameStart = false;
            scene.gameOver = false;
            scene.gameRunning = true;
            instructionsContainer.style.visibility = 'hidden';
            titleContainer.style.visibility = 'hidden';
            endContainer.style.visibility = 'hidden';
        }
    }
});

// HTML STUFF, inspo from https://github.com/justin-bi/3D-Breakout
// Set up coins counter
var coinDiv = document.createElement('div');
coinDiv.id = 'coinscollected';
document.body.appendChild(coinDiv);

let coinText = document.createElement('h1');
coinText.innerText = "Coins: " + scene.coinsCollected;
coinDiv.appendChild(coinText);

// make title
let titleContainer = document.createElement('div');
titleContainer.id = "title-container";
document.body.appendChild(titleContainer);

let titleText = document.createElement('h1');
titleText.innerText = "RACCOON RUSH";
titleContainer.appendChild(titleText);

// make instructions window
let instructionsContainer = document.createElement('div');
instructionsContainer.id = "instructions-container";
document.body.appendChild(instructionsContainer);

// make instructions title
let instructionsTitle = document.createElement('h1');
instructionsTitle.innerText = "INSTRUCTIONS";
instructionsContainer.appendChild(instructionsTitle);

// create a line break between title and content
let instructionsText = document.createElement('p');
instructionsText.innerHTML = "Move the raccoon left and right to collect coins and avoid obstacles! <br> <br> Careful, the workers will try to rob you!";
instructionsContainer.appendChild(instructionsText);

// make instructions table
let table = document.createElement('table');
instructionsContainer.appendChild(table);

let space = table.insertRow();
space.insertCell(0).innerHTML = "[SPACEBAR]";
space.insertCell(1).innerHTML = "Start game";

let left = table.insertRow();
left.insertCell(0).innerHTML = "[&#8592;]";
left.insertCell(1).innerHTML = "Move raccoon to the left";

let right = table.insertRow();
right.insertCell(0).innerHTML = "[&#8594;]";
right.insertCell(1).innerHTML = "Move raccoon to the right";

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

window.addEventListener('keydown', (event) => {
    // if (event.repeat) return;
    if (event.key == "ArrowLeft") scene.state.character.changeLanes(-1);
    if (event.key == "ArrowRight") scene.state.character.changeLanes(1);
    if (event.repeat) return;
    // if (event.key == " ") scene.state.isPlaying = true;
    //console.log(keypress);
}
, false);

// window.addEventListener('keyup', (event) => {
//     if (event.key == keypress) keypress = null;
// }
// , false);