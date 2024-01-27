// ping-pong.js

function init() {
    const canvas = document.getElementById('ping-pong');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 3000);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xFFE4E1);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    camera.position.set(20, 10, -10);
    camera.lookAt(0, 0, 0);

    const tableInstance = new window.Table(scene);
    const netInstance = new window.Net(scene, tableInstance);
    const racketInstance1 = new window.Racket(scene, tableInstance);

    tableInstance.render();
    netInstance.render();
    racketInstance1.render();

    const guiInstance = new window.Gui();
    setupLatheControls(guiInstance, tableInstance);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function setupLatheControls(guiInstance, tableInstance) {
    const latheFolder = guiInstance.addFolder('Lathe Controls');

    const setupLatheFolder = (folder, points, setControlPointsFunction) => {
        points.forEach((point, index) => {
            folder.add(point, 'x', -10, 10).step(1).onChange(() => setControlPointsFunction(index, points));
            folder.add(point, 'y', -10, 10).step(1).onChange(() => setControlPointsFunction(index, points));
        });
    };

    const firstLatheFolder = latheFolder.addFolder('First Lathe');
    const secondLatheFolder = latheFolder.addFolder('Second Lathe');

    const setControlPointsFirst = (index, points) => {
        tableInstance.legMesh[index].setControlPointsFirst(points);
        tableInstance.render();
    };

    const setControlPointsSecond = (index, points) => {
        tableInstance.legMesh[index].setControlPointsSecond(points);
        tableInstance.render();
    };

    setupLatheFolder(firstLatheFolder, tableInstance.legMesh[0].pointsFirstLathe, setControlPointsFirst);
    setupLatheFolder(secondLatheFolder, tableInstance.legMesh[0].pointsSecondLathe, setControlPointsSecond);
}
