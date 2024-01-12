// Function to create and display the table

export function createTable() {
    const tableGeometry = new THREE.BoxGeometry(100, 10, 50);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
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
