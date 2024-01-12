// ping-pong.js

import { createTable } from './table.js';

export function init() {
    const canvas = document.getElementById('ping-pong');
    const renderer = new THREE.WebGLRenderer({ canvas , antialias: true});
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xffffff);

    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    const table = createTable();
    scene.add(table);

    // Set camera position
    camera.position.set(0, 0, 100);

    // Your animation/rendering loop here
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the table
        table.rotation.y += 0.01;
        table.rotation.x += 0.01;

        // Render the scene with the camera
        renderer.render(scene, camera);
    }

    animate(); // Start the animation loop
}
