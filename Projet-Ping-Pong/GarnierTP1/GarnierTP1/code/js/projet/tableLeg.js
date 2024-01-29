class TableLeg {
    constructor(scene, table, height = table.width / 3, pointsFirst = null, pointsSecond = null) {
        this.scene = scene;
        this.table = table;
        this.position = new THREE.Vector3();
        this.height = height;
        this.meshFirst = null;
        this.meshSecond = null;
        this.pointsFirstBezier = [
            new THREE.Vector2(0.2, 0),
            new THREE.Vector2(0.3, this.height / 4),
            new THREE.Vector2(0.1, this.height / 2),
        ];

        this.pointsSecondBezier = [
            new THREE.Vector2(0.1, -this.height / 4), // y start for the height of the second lathe leg
            new THREE.Vector2(0.3, this.height / 2),
            new THREE.Vector2(0.1, - this.height  ), // y for the height of the leg
        ];
        if (pointsFirst && pointsSecond) {
            this.pointsFirstBezier = pointsFirst;
            this.pointsSecondBezier = pointsSecond;
        }
    }

    render() {
        const [legGeometryFirstLathe, legGeometrySecondLathe] = this.generateLegGeometries();
        const legMaterialFirst = new THREE.MeshBasicMaterial({ color: 0x007879 });
        const legMaterialSecond = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); // Use a different color for the second lathe
    
        this.meshFirst = new THREE.Mesh(legGeometryFirstLathe, legMaterialFirst);
        this.meshSecond = new THREE.Mesh(legGeometrySecondLathe, legMaterialSecond);
    
        this.meshFirst.position.set(this.position.x, this.position.y - 0.01, this.position.z);
        this.meshSecond.position.set(this.position.x, this.position.y - 0.01, this.position.z);
        

        this.scene.add(this.meshFirst);
        this.scene.add(this.meshSecond);
    }
    
    generateLegGeometries() {
        const latheSegments = 20;
        const legGeometryFirstLathe = new THREE.LatheGeometry(this.lathePoints(this.pointsFirstBezier, 20), latheSegments);
        const legGeometrySecondLathe = new THREE.LatheGeometry(this.lathePoints(this.pointsSecondBezier, 20), latheSegments);
    
        return [legGeometryFirstLathe, legGeometrySecondLathe];
    }

    generateLegGeometry() {
        const latheSegments = 20;
        const legGeometryFirstLathe = new THREE.LatheGeometry(this.lathePoints(this.pointsFirstBezier, 20), latheSegments);
        const legGeometrySecondLathe = new THREE.LatheGeometry(this.lathePoints(this.pointsSecondBezier, 20), latheSegments);
    
        const legGeometry = new THREE.Geometry();
        legGeometry.merge(legGeometryFirstLathe);
        legGeometry.merge(legGeometrySecondLathe);
    
        return legGeometry;
    }

    lathePoints(points, numDivisions) {
        const lathePoints = [];

        for (let i = 0; i <= numDivisions; i++) {
            const t = i / numDivisions;
            const point = this.getPointOnBezierCurve(points, t);
            lathePoints.push(new THREE.Vector3(point.x, point.y, 0));
        }

        return lathePoints;
    }

    getPointOnBezierCurve(points, t) {
        const invT = 1 - t;
        const p0 = points[0].clone().multiplyScalar(invT * invT);
        const p1 = points[1].clone().multiplyScalar(2 * invT * t);
        const p2 = points[2].clone().multiplyScalar(t * t);

        const result = p0.add(p1).add(p2);
        return result;
    }

    setControlPoints(points) {
        this.pointsBezier = points;
        this.dispose();
        this.render();
    }

    createFeet() {
        const footLength = 2;
        const startPoint = new THREE.Vector3(0, 0, 0);
        const endPoint = new THREE.Vector3(0, -footLength, 0);
        const footCurve = new THREE.LineCurve3(startPoint, endPoint);

        const footGeometry = new THREE.TubeGeometry(footCurve, 20, 0.1, 10, false);
        const footMaterial = new THREE.MeshBasicMaterial({ color: 0x007879 });

        const foot = new THREE.Mesh(footGeometry, footMaterial);
        foot.position.set(this.position.x, this.position.y - this.height / 2 + 0.5, this.position.z);

        this.scene.add(foot);
    }

    dispose() {
        console.log('dispose');
        if (this.meshFirst) {
            this.scene.remove(this.meshFirst);
            this.scene.remove(this.meshSecond);
            console.log('yazu');
        }
        this.scene.remove(this.meshFirst);
        this.scene.remove(this.meshSecond);

    }
}

window.TableLeg = TableLeg;