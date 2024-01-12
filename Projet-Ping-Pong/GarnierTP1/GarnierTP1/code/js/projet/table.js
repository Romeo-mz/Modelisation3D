// table.js
// Function to create and display the table

export function createTable(scene) {
    const tableGeometry = new THREE.BoxGeometry(10, 10, 10);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0xaaffaa });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);

    return table;
}

function createNet() {

}

function createLegs() {

}

function createFeet() { 

}

function drawWhiteLines() {

}
