//tableLeg.js

class TableLeg {
    constructor(scene, table, height = this.table.width / 3) {
        this.scene = scene;
        this.table = table;
        this.position = new THREE.Vector3();
        this.height = height;//this.table.width / 3;

        this.mesh = null;


        this.pointsFirstLathe = [
            new THREE.Vector2(0.2, 0), // Bottom of the leg
            new THREE.Vector2(0.3, this.height / 4), // Start of the taper
            new THREE.Vector2(0.1, this.height / 2), // Middle of the leg
        ];
        
        this.pointsSecondLathe = [
            new THREE.Vector2(0.1, -this.height), // Top of the leg
            new THREE.Vector2(0.5, this.height / 4), // Middle of the leg
            new THREE.Vector2(0.1, -(this.height) / 2), // Start of the taper
        ];
    }
   

    render() {
        // Define the points for the lathe geometry
        // const pointsFirstLathe = [
        //     new THREE.Vector2(0.2, 0),
        //     new THREE.Vector2(0.3, this.height / 4),
        //     new THREE.Vector2(0.1, this.height / 2),
        // ];

        // const pointsSecondLathe = [
        //     new THREE.Vector2(0.1, this.height/2),
        //     new THREE.Vector2(0.5, this.height / 4),
        //     new THREE.Vector2(0.1,  -(this.height) / 2)
        // ];

        // Create the first lathe geometry
        const legGeometryFirstLathe = new THREE.LatheGeometry(this.pointsFirstLathe);

        // Create the second lathe geometry
        const legGeometrySecondLathe = new THREE.LatheGeometry(this.pointsSecondLathe);

        // Merge the two lathe geometries
        const legGeometry = new THREE.Geometry();
        legGeometry.merge(legGeometryFirstLathe);
        legGeometry.merge(legGeometrySecondLathe);

        // Create the material and mesh for the leg
        const legMaterial = new THREE.MeshBasicMaterial({ color: 0x007879 });
        this.mesh = new THREE.Mesh(legGeometry, legMaterial);
        
        // Position the leg
        this.mesh.position.set(this.position.x, this.position.y - 0.01, this.position.z);

        // Add the leg to the scene
        this.scene.add(this.mesh);
        this.createFeet();
    }

    setControlPointsFirst(points) {
        this.pointsFirstLathe = points;
        this.dispose();
        this.render();
    }
    setControlPointsSecond(points) {
        this.pointsSecondLathe = points;
        this.dispose();
        this.render();
    }
    createFeet() {
        const footLength = 2; // Adjust this value as needed
        const startPoint = new THREE.Vector3(0, 0, 0); // Start at the bottom of the leg
        const endPoint = new THREE.Vector3(0, -footLength, 0); // End at footLength units below the leg
        const footCurve = new THREE.LineCurve3(startPoint, endPoint);
    
        const footGeometry = new THREE.TubeGeometry(footCurve, 20, 0.1, 10, false);
        const footMaterial = new THREE.MeshBasicMaterial({ color: 0x007879 });
    
        // Create the foot and position it at the bottom of the leg
        const foot = new THREE.Mesh(footGeometry, footMaterial);
        foot.position.set(this.position.x, this.position.y - this.height / 2 + 0.5, this.position.z);
    
        // Add the foot to the scene
        this.scene.add(foot);
    }
    dispose() {
        if (this.mesh) {
            console.log('dispose');
            this.scene.remove(this.mesh);
    
            // Dispose of legGeometry
            if (this.mesh.geometry) {
                console.log('dispose geometry');
                this.mesh.geometry.dispose();
            }
    
            // Dispose of legMaterial
            if (this.mesh.material) {
                console.log('dispose material');
                // Check if the material has a dispose method before calling it
                if (this.mesh.material.dispose) {
                    this.mesh.material.dispose();
                }
            }
    
            this.mesh = null;

        }
    }
    
    
    
}

window.TableLeg = TableLeg;