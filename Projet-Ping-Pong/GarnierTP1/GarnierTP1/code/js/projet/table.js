// table.js
// Function to create and display the table
const length = 25;
const width = 15;

class Table{
    constructor(scene){
        this.scene = scene;
        this.length = length;
        this.width = width;
    }

    render(){
        const geometry = new THREE.PlaneGeometry(length, width);
        const material = new THREE.MeshPhongMaterial({ color: "rgb(255, 255, 255)", side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);

        // plane.position.set(0, 0, 0);
        // Rotate the plane so it's horizontal
        plane.rotation.x = Math.PI / 2;
        this.scene.add(plane);

        const field = [];

        const upperLeftMaterial = new THREE.MeshPhongMaterial({ color: 0xf7b9c1, side: THREE.DoubleSide }); // pink
        const upperRightMaterial = new THREE.MeshPhongMaterial({ color: 0xb9c1f7, side: THREE.DoubleSide }); // yellow
        const lowerLeftMaterial = new THREE.MeshPhongMaterial({ color: 0xf7f7b9, side: THREE.DoubleSide }); // green
        const lowerRightMaterial = new THREE.MeshPhongMaterial({ color: 0xc1f7b9, side: THREE.DoubleSide }); // blue

        const upperLeftEdge = new THREE.Mesh(new THREE.PlaneGeometry((length / 2) - 1, (width / 2) - 0.5), upperLeftMaterial);
        const upperRightEdge = new THREE.Mesh(new THREE.PlaneGeometry((length / 2) - 1, (width / 2) - 0.5), upperRightMaterial);
        const lowerLeftEdge = new THREE.Mesh(new THREE.PlaneGeometry((length / 2) - 1, (width / 2) - 0.5), lowerLeftMaterial);
        const lowerRightEdge = new THREE.Mesh(new THREE.PlaneGeometry((length / 2) - 1, (width / 2) - 0.5), lowerRightMaterial);

        upperLeftEdge.position.set(length / 4, 0.01, -(width / 4));
        upperRightEdge.position.set(length / 4, 0.01, width / 4);
        lowerLeftEdge.position.set(-(length / 4), 0.01, -(width / 4));
        lowerRightEdge.position.set(-(length / 4), 0.01, width / 4);

        field.push(upperLeftEdge, upperRightEdge, lowerLeftEdge, lowerRightEdge);

        field.forEach((edge) => {
            edge.rotation.x = Math.PI / 2;
            this.scene.add(edge);
        })

        // Create the legs
        const legs = [];

        const legUpperLeft = new window.TableLeg(this.scene, this);
        const legUpperRight = new window.TableLeg(this.scene, this);
        const legLowerLeft = new window.TableLeg(this.scene, this);
        const legLowerRight = new window.TableLeg(this.scene, this);

        legUpperLeft.position.set(length / 2 - 0.5, -legUpperLeft.height / 2, -(width / 2) + 0.5);
        legUpperRight.position.set(length / 2 - 0.5, -legUpperLeft.height / 2, width / 2 - 0.5);
        legLowerLeft.position.set(-(length / 2) + 0.5, -legUpperLeft.height / 2, -(width / 2) + 0.5);
        legLowerRight.position.set(-(length / 2) + 0.5, -legUpperLeft.height / 2, width / 2 - 0.5);
        
        legs.push(legUpperLeft, legUpperRight, legLowerLeft, legLowerRight);

        legs.forEach((leg) => {
            leg.render();
            console.log(leg);
        });

    }

}

window.Table = Table;