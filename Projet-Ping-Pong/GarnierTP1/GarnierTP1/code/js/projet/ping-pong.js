// Import functions

import { createTable } from "./table.js";

// import { createTable } from './table.js';
// import { createBall } from './ball.js';

// Set up the scene

function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer();

    cameraLumiere(scene,camera);
    lumiere(scene);

    renderer.setSize(window.innerWidth, window.innerHeight);

    const table = createTable();
    scene.add(table);
}