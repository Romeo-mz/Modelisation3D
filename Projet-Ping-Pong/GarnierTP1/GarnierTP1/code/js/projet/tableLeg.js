class TableLeg {
    constructor(scene, table) {
        this.scene = scene;
        this.table = table;
        this.position = new THREE.Vector3();
        this.height = this.table.width / 3;
    }

    render() {
        // Define the points for the lathe geometry
        const pointsFirstLathe = [
            new THREE.Vector2(0.2, 0),
            new THREE.Vector2(0.3, this.height / 4),
            new THREE.Vector2(0.1, this.height / 2)
        ];

        const pointsSecondLathe = [
            new THREE.Vector2(0.1, this.height/2),
            new THREE.Vector2(0.5, this.height / 4),
            new THREE.Vector2(0.1,  -(this.height) / 2)
        ];
        
        // Create the first lathe geometry
        const legGeometryFirstLathe = new THREE.LatheGeometry(pointsFirstLathe);

        // Create the second lathe geometry
        const legGeometrySecondLathe = new THREE.LatheGeometry(pointsSecondLathe);

        // Merge the two lathe geometries
        const legGeometry = new THREE.Geometry();
        legGeometry.merge(legGeometryFirstLathe);
        legGeometry.merge(legGeometrySecondLathe);

        // Create the material and mesh for the leg
        const legMaterial = new THREE.MeshBasicMaterial({ color: 0x007879 });
        const leg = new THREE.Mesh(legGeometry, legMaterial);

        // Position the leg
        leg.position.set(this.position.x, this.position.y - 0.01, this.position.z);

        // Add the leg to the scene
        this.scene.add(leg);
        this.createFeet();
    }

    createFeet() {
        const startPoint = new THREE.Vector3(0, -(this.height) / 4, 0);
        const endPoint = new THREE.Vector3(0, this.height / 4, 0);
        const footCurve = new THREE.LineCurve3(startPoint, endPoint);

        const footGeometry = new THREE.TubeGeometry(footCurve, 20, 0.1, 10, false);

        const footMaterial = new THREE.MeshBasicMaterial({ color: 0x007879 });

        const foot = new THREE.Mesh(footGeometry, footMaterial);

        foot.position.set(this.position.x, this.position.y * 2 , this.position.z);

        this.scene.add(foot);
    }
}

window.TableLeg = TableLeg;