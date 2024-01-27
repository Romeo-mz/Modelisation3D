// ping-pong.js

function init() {
    
    const canvas = document.getElementById('ping-pong');
    const renderer = new THREE.WebGLRenderer({ canvas , antialias: true});
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 3000);
    
    const controls = new THREE.OrbitControls( camera, renderer.domElement );

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xFFE4E1);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    camera.position.set(20, 10, -10);
    camera.lookAt(0, 0, 0);

    // Create the table
    const tableInstance = new window.Table(scene);
    tableInstance.render();
    
    // Create the net
    const netInstance = new window.Net(scene, tableInstance);
    netInstance.render();

    // Create the racket
    const racketInstance1 = new window.Racket(scene, tableInstance);
    racketInstance1.render();

    // Set camera position

    // Create the gui
   const guiInstance = new window.Gui();

   // Create a folder for controlling the lathe points
   const latheFolder = guiInstance.addFolder('Lathe Controls');
   

    // Add controls for the first lathe
    const firstLatheFolder = latheFolder.addFolder('First Lathe');
    const pointsFirstLathe = tableInstance.legMesh[0].pointsFirstLathe;
    const pointsSecondLathe = tableInstance.legMesh[0].pointsSecondLathe;
    pointsFirstLathe.forEach((point, index) => {
        firstLatheFolder.add(point, 'x', -1, 1).step(0.1).onChange(() => tableInstance.legMesh[index].setControlPointsFirst(pointsFirstLathe));
        firstLatheFolder.add(point, 'y', -1, 1).step(0.1).onChange(() => tableInstance.legMesh[index].setControlPointsFirst(pointsFirstLathe));
        renderer.render(scene, camera);
    });

    // Add controls for the second lathe
    const secondLatheFolder = latheFolder.addFolder('Second Lathe');
    pointsSecondLathe.forEach((point, index) => {
        secondLatheFolder.add(point, 'x', -1, 1).step(0.1).onChange(() => tableInstance.legMesh[index].setControlPointsSecond(pointsSecondLathe));
        secondLatheFolder.add(point, 'y', -1, 1).step(0.1).onChange(() => tableInstance.legMesh[index].setControlPointsSecond(pointsSecondLathe));
    });

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


