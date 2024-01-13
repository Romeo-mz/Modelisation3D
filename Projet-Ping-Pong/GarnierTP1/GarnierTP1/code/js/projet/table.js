// table.js
// Function to create and display the table
const length = 20;
const width = 10;
const depth = 2;

class Table{
    constructor(scene){
        this.scene = scene;
    }

    render(){
        const geometry = new THREE.PlaneGeometry(length, width);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);

        // plane.position.set(0, 0, 0);
        // Rotate the plane so it's horizontal
        plane.rotation.x = Math.PI / 2;
        this.scene.add(plane);

        const field = [];

        const fieldMaterial = new THREE.MeshPhongMaterial({ color: 0xc1f7b9, side: THREE.DoubleSide });


    }

}

window.Table = Table;