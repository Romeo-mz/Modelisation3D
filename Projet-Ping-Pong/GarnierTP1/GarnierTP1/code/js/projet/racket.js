class TableTennisRacket {
    constructor(scene, table) {
        this.scene = scene;
        this.table = table;
        this.thickness = 0.3
        this.posY = 3.5
        this.posX = 0.5
        

   }

   createRacket(position, front, back) {
    // Create racket handle
    const handleGeometry = new THREE.CylinderGeometry(0.1, 0.2, 2, 32);
    const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x996633 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(position.x, position.y + 1.5, position.z);

    // Create racket face
    const faceGeometry = new THREE.CylinderGeometry(1, 1, this.thickness, 32);
    faceGeometry.rotateZ(Math.PI / 2);

    // Different colors for each side
    const faceMaterials = [
        new THREE.MeshPhongMaterial({ color: back }), // Front side color
        new THREE.MeshPhongMaterial({ color: front }), // Back side color
        new THREE.MeshPhongMaterial({ color: 0x808080 }), // Top side color
        new THREE.MeshPhongMaterial({ color: 0x996633 }), // Bottom side color
        new THREE.MeshPhongMaterial({ color: 0x808080 }), // Right side color
        new THREE.MeshPhongMaterial({ color: 0x808080 })  // Left side color
    ];

    const face = new THREE.Mesh(faceGeometry, faceMaterials);
    face.position.set(position.x, position.y + this.posY, position.z);

    // Group handle and face together
    const racket = new THREE.Group();
    racket.add(handle);
    racket.add(face);

    this.scene.add(racket);
}


render() {
    const racket1Position = new THREE.Vector3(-this.table.length / 2 -this.posX, 0, 0);
    const racket2Position = new THREE.Vector3(this.table.length / 2 + this.posX, 0, 0);

    this.createRacket(racket1Position,0xff0000,0x000000);
    this.createRacket(racket2Position,0xffff00,0x000000);
}

getPosX() {
    return this.posX;
}
getPosY()
{
    return this.posY
}
getThickness() {
    return this.thickness;
}


    
    }
window.Racket = TableTennisRacket;

