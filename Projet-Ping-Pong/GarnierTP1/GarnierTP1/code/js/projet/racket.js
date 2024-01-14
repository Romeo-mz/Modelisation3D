class TableTennisRacket {
    constructor(scene, table) {
        this.scene = scene;
        this.table = table;
        

   }

   createRacket(position) {
    // Create racket handle
    const handleGeometry = new THREE.CylinderGeometry(0.1, 0.2, 2, 32);
    const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x996633 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(position.x, position.y + 1.5, position.z);

    // Create racket face
    const faceGeometry = new THREE.BoxGeometry(0.3, 2, 1);

    // Different colors for each side
    const faceMaterials = [
        new THREE.MeshPhongMaterial({ color: 0x000000 }), // Front side color
        new THREE.MeshPhongMaterial({ color: 0xff0000 }), // Back side color
        new THREE.MeshPhongMaterial({ color: 0x808080 }), // Top side color
        new THREE.MeshPhongMaterial({ color: 0x996633 }), // Bottom side color
        new THREE.MeshPhongMaterial({ color: 0x808080 }), // Right side color
        new THREE.MeshPhongMaterial({ color: 0x808080 })  // Left side color
    ];

    const face = new THREE.Mesh(faceGeometry, faceMaterials);
    face.position.set(position.x, position.y + 3.5, position.z);

    // Group handle and face together
    const racket = new THREE.Group();
    racket.add(handle);
    racket.add(face);

    this.scene.add(racket);
}

render() {
    const racket1Position = new THREE.Vector3(-this.table.length / 2 -0.5, 0, 0);
    const racket2Position = new THREE.Vector3(this.table.length / 2 + 0.5, 0, 0);

    this.createRacket(racket1Position);
    this.createRacket(racket2Position);
}
    
    }
window.Racket = TableTennisRacket;

