class Ball {
    constructor(scene, table) {
        this.scene = scene;
        this.table = table;
        this.radius = 0.25;
        this.ball = null;
        this.curve = null;
        this.animationStartTime = 0;
        this.animationDuration = 1500; // 1.5 secondes
    }

    createBall(position) {
        const ballGeometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xfecd4c });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.position.set(position.x, position.y + 1.5, position.z);

        this.scene.add(this.ball);
    }

    render() {
        const ballPosition = new THREE.Vector3(0, 0, 0); // Set the initial position of the ball
        this.createBall(ballPosition);
    }

    updateBallPosition(time) {
        const t = (time - this.animationStartTime) / this.animationDuration;
    
    const clampedT = Math.min(Math.max(t, 0), 1);

    const position = this.curve.getPointAt(clampedT);
    this.ball.position.copy(position);

    if (t >= 1 && t<1.0001) {
        console.log("Animation terminée");
    }
    }

    startAnimation() {
        this.animationStartTime = Date.now();
    }

    setCurve(curve) {
        this.curve = curve;
    }

    getRadius() {
        return this.radius;
    }
}

window.TableTennisBall = Ball;
