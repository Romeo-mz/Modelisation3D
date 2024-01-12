function init() {
  var stats = initStats();
  let renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(new THREE.Color(0xFFFFFF));
  renderer.setSize(window.innerWidth * .9, window.innerHeight * .9);
  cameraLumiere(scene, camera);
  lumiere(scene);

  createAxes(scene);
  // createVectOrth(scene);
  
  let sphere = createSphere(scene, 1, 20, 0.5, 0x0000FF);
  scene.add(sphere);
  //********************************************************
  //
  //  G E O M E T R Y     P A R T
  //
  //********************************************************
  
  function createVectOrth(scene){
    let u = new THREE.Vector3(-7, 4, -4);
    let v = new THREE.Vector3(4, 8, 7);
    let w = new THREE.Vector3(7, -3, -8);
    
    let origin = new THREE.Vector3(0, 0, 0);

    createVector(scene, origin, u, 0x000000, 0.1, 0.05);
    createVector(scene, origin, v, 0x000000, 0.1, 0.05);

    let crossVect = crossVector(u, v);

    // Création d'une flèche pour représenter le vecteur croisé
    let crossArrow = new THREE.ArrowHelper(crossVect.normalize(), origin, crossVect.length(), 0xff3300, 0.2, 0.1);

    // Ajout de la flèche à la scène
    scene.add(crossArrow);
}

function crossVector(vect1, vect2){
    let cross = new THREE.Vector3();
    cross.crossVectors(vect1, vect2);
    return cross;
}

function createSphere(scene, r, n, oppacity, color){
    const geometry = new THREE.SphereGeometry(r, n, n);
    const material = new THREE.MeshPhongMaterial({color: color, oppacity: oppacity })
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
}



  //********************************************************
  //
  // E N D      G E O M E T R Y     P A R T
  //
  //********************************************************

  //********************************************************
  //
  //  G U I     M E N U     P A R T
  //
  //********************************************************
  const gui = new dat.GUI();
  let cameraPosGui = gui.addFolder('Camera Position');
  
  let cameraControls = {
    cameraxPos: camera.position.x,
    camerayPos: camera.position.y,
    camerazPos: camera.position.z
  };
  
  cameraPosGui.add(cameraControls, 'cameraxPos', -10, 10).onChange(function () {
    camera.position.x = cameraControls.cameraxPos;
    reRender();
  });
  cameraPosGui.add(cameraControls, 'camerayPos', -10, 10).onChange(function () {
    camera.position.y = cameraControls.camerayPos;
    reRender();
  });
  cameraPosGui.add(cameraControls, 'camerazPos', -10, 10).onChange(function () {
    camera.position.z = cameraControls.camerazPos;
    reRender();
  });

  
let cameraDirGui = gui.addFolder('Camera Direction');

let cameraDirControls = {
  cameraDirxPos: xDir,
  cameraDiryPos: yDir,
  cameraDirzPos: zDir
};

cameraDirGui.add(cameraDirControls, 'cameraDirxPos', -10, 10).onChange(function () {
  xDir = cameraDirControls.cameraDirxPos;
  camera.lookAt(xDir, yDir, zDir);
  reRender();
}
);
cameraDirGui.add(cameraDirControls, 'cameraDiryPos', -10, 10).onChange(function () {
  yDir = cameraDirControls.cameraDiryPos;
  camera.lookAt(xDir, yDir, zDir);
  reRender();
}
);
cameraDirGui.add(cameraDirControls, 'cameraDirzPos', -10, 10).onChange(function () {
  zDir = cameraDirControls.cameraDirzPos;
  camera.lookAt(xDir, yDir, zDir);
  reRender();
}
);
  //********************************************************
  //
  //  E N D     G U I     M E N U     P A R T
  //
  //********************************************************

  animate();

  document.getElementById("webgl").appendChild(renderer.domElement);

  renderer.render(scene, camera);

  function reRender() {
    setTimeout(function () {

    }, 200);
    renderer.render(scene, camera);
  }

  function animate() {
    stats.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
}

/**
 * Creates a vector in the given scene from point A to point B with the specified properties.
 * @param {Scene} scene - The scene in which the vector will be created.
 * @param {Vector3} A - The starting point of the vector.
 * @param {Vector3} B - The ending point of the vector.
 * @param {string} hexColor - The color of the vector in hexadecimal format.
 * @param {number} coneLength - The length of the cone representing the vector.
 * @param {number} coneRadius - The radius of the cone representing the vector.
 */
function createVector(scene, A, B, hexColor, coneLength, coneRadius) {
  let vector = new THREE.Vector3();
  vector.subVectors(B, A);

  let arrow = new THREE.ArrowHelper(vector.clone().normalize(), A, vector.length(), hexColor, coneLength, coneRadius);
  scene.add(arrow);
}

/**
 * Creates three vectors representing the three axes of the scene.
 * @param {Scene} scene  - The scene in which the vectors will be created.
 */
function createAxes(scene) {
  createVector(scene, new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0), 0xFF0000, 0.1, 0.05);
  createVector(scene, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), 0x00FF00, 0.1, 0.05);
  createVector(scene, new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,1), 0x0000FF, 0.1, 0.05);
}