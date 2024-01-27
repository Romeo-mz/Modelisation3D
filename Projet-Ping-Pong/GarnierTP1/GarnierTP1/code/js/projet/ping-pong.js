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
   
   // Add controls for the first lathe control points
   const pointsFirstLathe = tableInstance.legs[0].pointsFirstLathe;

   pointsFirstLathe.forEach((point, index) => {
        console.log(point)
        latheFolder.add(point, 'x', -10, 10).name(`Point  X First Lathe`);
        latheFolder.add(point, 'y', -10, 10).name(`Point  Y First Lathe`);
   });

   // Add controls for the second lathe control points
   const pointsSecondLathe = tableInstance.legs[0].pointsSecondLathe;
   pointsSecondLathe.forEach((point, index) => {
        latheFolder.add(point, 'x', -10, 10).name(`Point X Second Lathe`);
        latheFolder.add(point, 'y', -10, 10).name(`Point Y Second Lathe`);
   });

   // Add a folder for the light properties
   const lightFolder = guiInstance.addFolder('Light Properties');

   // Add controls for the light properties
   lightFolder.add(tableInstance, 'setLightProperties', 0, 1).name('Light Intensity');
   lightFolder.addColor(tableInstance.light, 'color').onChange(function (value) {
       tableInstance.light.color.set(value);
   });


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
