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

        this.color = 0x007a7a; // Default color is green; 
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
        
        
        const upperLeftMaterial = new THREE.MeshPhongMaterial({ color: this.color, side: THREE.DoubleSide }); // pink
        const upperRightMaterial = new THREE.MeshPhongMaterial({ color: this.color, side: THREE.DoubleSide }); // yellow
        const lowerLeftMaterial = new THREE.MeshPhongMaterial({ color: this.color, side: THREE.DoubleSide }); // green
        const lowerRightMaterial = new THREE.MeshPhongMaterial({ color: this.color, side: THREE.DoubleSide }); // blue

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

    }

    setColor(color) {
        console.log(color);
        if (this.tableMesh) {
            this.tableMesh.material.color.setHex(color);
            this.color = color; // Update the current color
        }
    }
    setControlPoints(pointsFirst, pointsSecond) {
        this.setLegs(length, height, width, pointsFirst, pointsSecond);
    }

    setLegs(length, height, width, pointsFirst, pointsSecond){
        console.log(pointsFirst, pointsSecond)
        const legUpperLeft = new window.TableLeg(this.scene, this, height, pointsFirst, pointsSecond);
        const legUpperRight = new window.TableLeg(this.scene, this, height, pointsFirst, pointsSecond);
        const legLowerLeft = new window.TableLeg(this.scene, this, height, pointsFirst, pointsSecond);
        const legLowerRight = new window.TableLeg(this.scene, this, height, pointsFirst, pointsSecond);
        
        legUpperLeft.position.set(length / 2 - 0.5, -legUpperLeft.height / 2, -(width / 2) + 0.5);
        legUpperRight.position.set(length / 2 - 0.5, -legUpperRight.height / 2, width / 2 - 0.5);
        legLowerLeft.position.set(-(length / 2) + 0.5, -legLowerLeft.height / 2, -(width / 2) + 0.5);
        legLowerRight.position.set(-(length / 2) + 0.5, -legLowerRight.height / 2, width / 2 - 0.5);
        

        this.legMesh = [legUpperLeft, legUpperRight, legLowerLeft, legLowerRight];
        this.legMesh.forEach((leg) => {
            leg.render();
        });
    }
    


   dispose() {
    if (this.legMesh) {
        this.legMesh.forEach((leg) => {
            console.log(leg);
            
            // Check if leg has meshes
            if (leg.meshFirst && leg.meshFirst.geometry) {
                leg.meshFirst.geometry.dispose();
                leg.meshFirst.material.dispose();
                leg.meshFirst = null;
            }

            if (leg.meshSecond && leg.meshSecond.geometry) {
                this.scene.remove(leg.meshSecond);
                leg.meshSecond.geometry.dispose();
                leg.meshSecond.material.dispose();
                leg.meshSecond = null;
            }
        });
        this.legMesh = null;
    }
}

    getLength() {
        return this.length;
    }
    getWidth() {
        return this.width;
    }

    getHeight() {
        return height
    }
}

window.Table = Table;