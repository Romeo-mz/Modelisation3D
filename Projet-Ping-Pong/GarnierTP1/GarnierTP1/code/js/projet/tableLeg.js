class TableLeg {
    constructor(scene, table, height = table.width / 3) {
        this.scene = scene;
        this.table = table;
        this.position = new THREE.Vector3();
        this.height = height;
        this.mesh = null;

        this.pointsBezier = [
            new THREE.Vector2(0.2, 0),
            new THREE.Vector2(0.3, this.height / 4),
            new THREE.Vector2(0.1, this.height / 2),
        ];
    }

    render() {
        const legGeometry = this.generateLegGeometry();
        const legMaterial = new THREE.MeshBasicMaterial({ color: 0x007879 });
        this.mesh = new THREE.Mesh(legGeometry, legMaterial);
        this.mesh.position.set(this.position.x, this.position.y - 0.01, this.position.z);

        this.scene.add(this.mesh);
        this.createFeet();
    }

    generateLegGeometry() {
        const latheSegments = 20;
        const points = this.lathePoints(this.pointsBezier, latheSegments);
        const legGeometry = new THREE.LatheGeometry(points, latheSegments);

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
        if (this.mesh) {
            this.scene.remove(this.mesh);

            if (this.mesh.geometry) {
                this.mesh.geometry.dispose();
            }

            if (this.mesh.material) {
                if (this.mesh.material.dispose) {
                    this.mesh.material.dispose();
                }
            }

            this.mesh = null;
        }
    }
}

window.TableLeg = TableLeg;
