// table.js
// Function to create and display the table
const length = 25;
const width = 15;
const height = 0.2;

class Table{
    constructor(scene){
        this.scene = scene;
        this.length = length;
        this.width = width;
        this.tableMesh = null;
        this.legMesh = null;
        this.height = height;

        // Initialize legs array
        this.legs = [new window.TableLeg(scene, this, height)];

        // Initialize light
        this.light = new THREE.AmbientLight(0xffffff);
    }
    setLength(length){
        this.length = length;
        this.dispose();
        this.render(); 
    }
    render(){

        const geometry = new THREE.BoxGeometry(this.length,  width, height);
        const material = new THREE.MeshPhongMaterial({ color: "rgb(255, 255, 255)", side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);

        // plane.position.set(0, 0, 0);
        // Rotate the plane so it's horizontal
        plane.rotation.x = Math.PI / 2;
        this.scene.add(plane);
        this.tableMesh = plane;

        const field = [];

        const upperLeftMaterial = new THREE.MeshPhongMaterial({ color: 0xf7b9c1, side: THREE.DoubleSide }); // pink
        const upperRightMaterial = new THREE.MeshPhongMaterial({ color: 0xb9c1f7, side: THREE.DoubleSide }); // yellow
        const lowerLeftMaterial = new THREE.MeshPhongMaterial({ color: 0xf7f7b9, side: THREE.DoubleSide }); // green
        const lowerRightMaterial = new THREE.MeshPhongMaterial({ color: 0xc1f7b9, side: THREE.DoubleSide }); // blue

        const upperLeftEdge = new THREE.Mesh(new THREE.PlaneGeometry((this.length / 2) - 1, (width / 2) - 0.5), upperLeftMaterial);
        const upperRightEdge = new THREE.Mesh(new THREE.PlaneGeometry((this.length / 2) - 1, (width / 2) - 0.5), upperRightMaterial);
        const lowerLeftEdge = new THREE.Mesh(new THREE.PlaneGeometry((this.length / 2) - 1, (width / 2) - 0.5), lowerLeftMaterial);
        const lowerRightEdge = new THREE.Mesh(new THREE.PlaneGeometry((this.length / 2) - 1, (width / 2) - 0.5), lowerRightMaterial);

        
        upperLeftEdge.position.set(this.length / 4, height, -(width / 4));
        upperRightEdge.position.set(this.length / 4, height, width / 4);
        lowerLeftEdge.position.set(-(this.length / 4), height, -(width / 4));
        lowerRightEdge.position.set(-(this.length / 4), height, width / 4);

        field.push(upperLeftEdge, upperRightEdge, lowerLeftEdge, lowerRightEdge);
        
        field.forEach((edge) => {
            edge.rotation.x = Math.PI / 2;
            this.scene.add(edge);
        })

        // Create the legs
        this.setLegs(this.length, this.height, this.width)
    }

    setLegs(length, height, width){
        const legs = [];

        const legUpperLeft = new window.TableLeg(this.scene, this, height);
        const legUpperRight = new window.TableLeg(this.scene, this, height);
        const legLowerLeft = new window.TableLeg(this.scene, this, height);
        const legLowerRight = new window.TableLeg(this.scene, this, height);

        legUpperLeft.position.set(length / 2 - 0.5, -legUpperLeft.height / 2, -(width / 2) + 0.5);
        legUpperRight.position.set(length / 2 - 0.5, -legUpperLeft.height / 2, width / 2 - 0.5);
        legLowerLeft.position.set(-(length / 2) + 0.5, -legUpperLeft.height / 2, -(width / 2) + 0.5);
        legLowerRight.position.set(-(length / 2) + 0.5, -legUpperLeft.height / 2, width / 2 - 0.5);
        
        this.legMesh = [legUpperLeft, legUpperRight, legLowerLeft, legLowerRight];
        this.legMesh.forEach((leg) => {
            leg.render();
        });
    }

    setHeights(height) {
        this.dispose()

        this.setLegs(this.length, height, this.width)
    }

    setLatheControlPoints(latheIndex, points) {
        if (this.legs && this.legs[latheIndex]) {
            this.legs[latheIndex].setControlPoints(points);
            this.dispose();
            this.render();
        }
    }

    setLightProperties(intensity, color) {
        this.scene.remove(this.light);
        this.light = new THREE.AmbientLight(0xffffff, intensity);
        this.light.color.set(color);
        this.scene.add(this.light);
    }

    dispose() {
        if (this.tableMesh) {
            this.scene.remove(this.tableMesh);
            this.tableMesh.geometry.dispose();
            this.tableMesh.material.dispose();
            this.tableMesh = null;
        }

        if (this.legMesh) {
            this.legMesh.forEach((leg) => {
                this.scene.remove(leg.mesh);
            });
            this.legMesh = null;
        }
    }
    
}

window.Table = Table;