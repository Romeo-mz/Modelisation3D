class Ball {
    constructor(scene,table){
        this.scene = scene
        this.table = table
        this.radius = 0.25

    }

    createBall(position)
    {
        const ballGeometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xfecd4c});
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.position.set(position.x, position.y + 1.5, position.z);

        this.scene.add(ball);
    }

    render() {
        const ballPosition = new THREE.Vector3(0,0,0); // Set the initial position of the ball
        this.createBall(ballPosition);
    }
}

window.TableTennisBall = Ball;
