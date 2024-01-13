// ping-pong.js

function init() {
    
    const canvas = document.getElementById('ping-pong');
    const renderer = new THREE.WebGLRenderer({ canvas , antialias: true});
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 3000);
    
    const controls = new THREE.OrbitControls( camera, renderer.domElement );

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xffffff);

    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    // Create the table
    const tableInstance = new window.Table(scene);
    console.log(tableInstance);
    tableInstance.render();


    // Set camera position

    // Your animation/rendering loop here
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the table
        // table.rotation.y += 0.01;
        // table.rotation.x += 0.01;
        controls.update();
        // Render the scene with the camera
        renderer.render(scene, camera);
    }

    animate(); // Start the animation loop
}

window.init = init;