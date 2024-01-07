

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

  var axes = new THREE.AxesHelper(1);
  createAxes(scene);

  //********************************************************
  //
  //  G E O M E T R Y     P A R T
  //
  //********************************************************

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