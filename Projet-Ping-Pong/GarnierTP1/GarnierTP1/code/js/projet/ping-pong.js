// ping-pong.js
score1 = 0;
score2 = 0;
let tableLength;
let tableWidth;
let tableHeight;
let racketPosX;
let racketPosY;
let ballRadius;
let racketThick;
let ballInstance;
let controls;
let renderer; // Déclaration de renderer en tant que variable globale
let scene; // Déclaration de scene en tant que variable globale
let camera; // Déclaration de camera en tant que variable globale

function init() {
    const canvas = document.getElementById('ping-pong');

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); // Affectation de renderer en tant que variable globale
    scene = new THREE.Scene(); // Affectation de scene en tant que variable globale
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 3000); // Affectation de camera en tant que variable globale
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xFFE4E1);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    camera.position.set(20, 10, -10);
    camera.lookAt(0, 0, 0);

    const tableInstance = new window.Table(scene);
    const netInstance = new window.Net(scene, tableInstance);
    const racketInstance1 = new window.Racket(scene, tableInstance);
    const racketInstance = new window.Racket(scene, tableInstance);
    ballInstance = new window.TableTennisBall(scene, tableInstance);


    racketPosX = racketInstance.getPosX();
    racketPosY = racketInstance.getPosY();

    racketThick = racketInstance.getThickness();
    ballRadius = ballInstance.getRadius();


    ballInstance.render();
    tableInstance.render();
    netInstance.render();
    racketInstance1.render();
    racketInstance.render();

    const guiInstance = new window.Gui();

    // Add GUI menu for table color
    const tableColorFolder = guiInstance.addFolder('Table Color');
    const tableColors = {
        Green: 0x007a7a,
        Blue: 0x019ad9,
    };

    tableInstance.color = 0x007a7a; // Set the default color to Green

    const tableColorController = tableColorFolder.add(tableInstance, 'color', Object.keys(tableColors)).name('Choose Color');

    tableColorController.onChange(() => {
        tableInstance.setColor(tableColors[tableInstance.color]);
        tableInstance.render();
    });
    // Add GUI menu for Bezier control points
    const bezierFolder = guiInstance.addFolder('Bezier Control Points');
    const bezierControlPointsFirst = {
        point1: { x: 0.2, y: 0 },
        point2: { x: 0.3, y: 1 },
        point3: { x: 0.1, y: 2 },
    };

    const bezierControlPointsSecond = {
        point1: { x: 0.2, y: 0 },
        point2: { x: 0.3, y: 1 },
        point3: { x: 0.1, y: 2 },
    };

    // Create controllers for each control point
    const point1XController = bezierFolder.add(bezierControlPointsFirst.point1, 'x', 0, 5).step(1).name('Point 1 X');
    const point2XController = bezierFolder.add(bezierControlPointsFirst.point2, 'x', 0, 5).step(1).name('Point 2 X');
    const point3XController = bezierFolder.add(bezierControlPointsFirst.point3, 'x', 0, 5).step(1).name('Point 3 X');
    const point1YController = bezierFolder.add(bezierControlPointsFirst.point1, 'y', 0, 5).step(1).name('Point 1 Y');
    const point2YController = bezierFolder.add(bezierControlPointsFirst.point2, 'y', 0, 5).step(1).name('Point 2 Y');
    const point3YController = bezierFolder.add(bezierControlPointsFirst.point3, 'y', 0, 5).step(1).name('Point 3 Y');

    const point4Controller = bezierFolder.add(bezierControlPointsSecond.point1, 'y', 0, 2).step(0.1).name('Point 1 Y');
    const point5Controller = bezierFolder.add(bezierControlPointsSecond.point2, 'y', 0, 2).step(0.1).name('Point 2 Y');
    const point6Controller = bezierFolder.add(bezierControlPointsSecond.point3, 'y', 0, 2).step(0.1).name('Point 3 Y');
    
    const updateBezierCurve = () => {
        const pointsFirst = [
            new THREE.Vector2(bezierControlPointsFirst.point1.x, bezierControlPointsFirst.point1.y),
            new THREE.Vector2(bezierControlPointsFirst.point2.x, bezierControlPointsFirst.point2.y),
            new THREE.Vector2(bezierControlPointsFirst.point3.x, bezierControlPointsFirst.point3.y),
        ];
    
        const pointsSecond = [
            new THREE.Vector2(bezierControlPointsSecond.point1.x, bezierControlPointsSecond.point1.y),
            new THREE.Vector2(bezierControlPointsSecond.point2.x, bezierControlPointsSecond.point2.y),
            new THREE.Vector2(bezierControlPointsSecond.point3.x, bezierControlPointsSecond.point3.y),
        ];
    
        tableInstance.setControlPoints(pointsFirst, pointsSecond);
        tableInstance.render();
    };

    // Listen for changes in control points and update the Bezier curve
    point1XController.onChange(updateBezierCurve);
    point2XController.onChange(updateBezierCurve);
    point3XController.onChange(updateBezierCurve);
    point1YController.onChange(updateBezierCurve);
    point2YController.onChange(updateBezierCurve);
    point3YController.onChange(updateBezierCurve);

    point4Controller.onChange(updateBezierCurve);
    point5Controller.onChange(updateBezierCurve);
    point6Controller.onChange(updateBezierCurve);

    // Add GUI menu for camera position
    const cameraFolder = guiInstance.addFolder('Camera Position');
    const cameraPosition = {
        x: 20,
        y: 10,
        z: -10,
    };

    const cameraXController = cameraFolder.add(cameraPosition, 'x', -150, 150).step(1).name('X Position');
    const cameraYController = cameraFolder.add(cameraPosition, 'y', -150, 150).step(1).name('Y Position');
    const cameraZController = cameraFolder.add(cameraPosition, 'z', -150, 150).step(1).name('Z Position');

    cameraXController.onChange(() => {
        camera.position.x = cameraPosition.x;
    });

    cameraYController.onChange(() => {
        camera.position.y = cameraPosition.y;
    });

    cameraZController.onChange(() => {
        camera.position.z = cameraPosition.z;
    });

    // Update the camera position initially
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    camera.lookAt(0, 0, 0);

    tableWidth = tableInstance.getWidth();
    tableLength = tableInstance.getLength();
    tableHeight = tableInstance.getHeight();


    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}


    


function service()
    {
        debut= Math.floor(Math.random() * tableWidth/2);
        other = Math.floor(Math.random() * tableWidth/2);

        start = ((-tableLength/2)-((tableLength*debut)/(2*(Math.abs(debut+other+0.01))))+tableLength/4)/(-tableLength/(2*(Math.abs(debut+other+0.01))));
        
        

        otherSideLength = start + other

        controlPoint1 = start - 1/6*otherSideLength;

        controlPoint2 = start - 4/9*otherSideLength;
        controlPoint3 = start - 5/9*otherSideLength;

        middlePoint = start - 2/3*otherSideLength;

        controlPoint4 = -start + 7/9*otherSideLength;
        controlPoint5 = -start + 8/9*otherSideLength;

        controlPoint6 = -start + 10/9*otherSideLength;

        endWidth = 4/3*otherSideLength - start;

        a = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-((tableLength/2) +racketPosX - racketThick - ballRadius/2), racketPosY,start),
            new THREE.Vector3(-3*(tableLength/8), racketPosY, controlPoint1),
            new THREE.Vector3(-tableLength/4, ballRadius+ tableHeight,debut));
            
        

        b = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-tableLength/4, ballRadius+ tableHeight,debut),
            new THREE.Vector3(-tableLength/4, racketPosY/2,controlPoint2),
            new THREE.Vector3(-tableLength/8, racketPosY, controlPoint3),
            new THREE.Vector3(0, racketPosY,middlePoint));
        

        c = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, racketPosY,middlePoint),
            new THREE.Vector3(tableLength/8, racketPosY,-controlPoint4),
            new THREE.Vector3(tableLength/4, racketPosY/2, -controlPoint5),
            new THREE.Vector3(tableLength/4, ballRadius+ tableHeight,-other));
            

        d = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(tableLength/4, ballRadius+ tableHeight,-other),
            new THREE.Vector3(3*(tableLength/8), racketPosY, -controlPoint6),
            new THREE.Vector3((tableLength/2) +racketPosX - racketThick - ballRadius/2, racketPosY,-endWidth));
            
        
        
        const combinedCurve = new THREE.CurvePath();
        combinedCurve.add(a);
        combinedCurve.add(b);
        combinedCurve.add(c);
        combinedCurve.add(d);
 
        return {
            curveD: d,
            combinedCurve: combinedCurve
        };
    }

    

    function droit(lastVector,mod)
    {
        if (mod%2==0)
        {
           signe = 1
        }
        else 
        {
            signe = -1
        }

        otherSide = Math.floor(Math.random() * tableWidth/2);
        debut = lastVector.getPointAt(1).z;

        pente = (3*tableLength)/(4*Math.abs((debut+signe*otherSide+0.01)));

        if (otherSide < -debut || (otherSide > debut && debut >0))
        {
            pente = -pente
        }
        origine = tableLength/2 + pente*(-debut);

        controlPoint1 = (tableLength/4 - origine)/pente;

        middlePoint = -(origine)/pente;

        controlPoint2 = (-tableLength/12 - origine)/pente;
        controlPoint3 = (-tableLength/6 - origine)/pente;

        jointWidth = (-tableLength/4 - origine)/pente;

        controlPoint4 = (-3*tableLength/8 - origine)/pente;

        endWidth = (-tableLength/2 - origine)/pente;



        a = new THREE.QuadraticBezierCurve3(
            lastVector.getPointAt(1),
            new THREE.Vector3(tableLength/4, racketPosY, controlPoint1),
            new THREE.Vector3(0, 3*racketPosY/4, middlePoint));

        b = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 3*racketPosY/4, middlePoint),
            new THREE.Vector3(0, 3*racketPosY/4,controlPoint2),
            new THREE.Vector3(-tableLength/8, racketPosY/2, controlPoint3),
            new THREE.Vector3(-tableLength/4, ballRadius+ tableHeight,-signe*otherSide));
            

        c = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-tableLength/4, ballRadius+ tableHeight,-signe*otherSide),
            new THREE.Vector3(-3*(tableLength/8), racketPosY, controlPoint4),
            new THREE.Vector3(-((tableLength/2) +racketPosX - racketThick - ballRadius/2), racketPosY,endWidth));
        
        
        const combinedCurve = new THREE.CurvePath();
        
        combinedCurve.add(a);
        combinedCurve.add(b);
        combinedCurve.add(c);      
    
        return {
            lastcurve: c,
            combinedCurve: combinedCurve
        };
    }

    

    function diagonale(lastVector,mod)
    {
        if (mod%2==0)
        {
           signe = 1
        }
        else 
        {
            signe = -1
            
        }
        otherSide = Math.floor(Math.random() * tableWidth/2);
        debut = lastVector.getPointAt(1).z;
        

        pente = (3*tableLength)/(4*((-debut+signe*otherSide+0.01)));

        
        origine = (-tableLength/2) - (pente*(debut));

        

        controlPoint1 = (-tableLength/4 - origine)/pente;

        middlePoint = -(origine)/pente;

        

        controlPoint2 = (tableLength/12 - origine)/pente;
        controlPoint3 = (tableLength/6 - origine)/pente;

        jointWidth = (tableLength/4 - origine)/pente;

        controlPoint4 = (3*tableLength/8 - origine)/pente;

        endWidth = (tableLength/2 - origine)/pente;



        a = new THREE.QuadraticBezierCurve3(
            lastVector.getPointAt(1),            
            new THREE.Vector3(-tableLength/4, racketPosY, controlPoint1),
            new THREE.Vector3(0, 3*racketPosY/4, middlePoint));

        b = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 3*racketPosY/4, middlePoint),
            new THREE.Vector3(0, 3*racketPosY/4,controlPoint2),
            new THREE.Vector3(tableLength/8, racketPosY/2, controlPoint3),
            new THREE.Vector3(tableLength/4, ballRadius+ tableHeight,signe*otherSide));
            

        c = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(tableLength/4, ballRadius+ tableHeight,signe*otherSide),
            new THREE.Vector3(3*(tableLength/8), racketPosY, controlPoint4),
            new THREE.Vector3(((tableLength/2) +racketPosX - racketThick - ballRadius/2), racketPosY,endWidth));

        const combinedCurve = new THREE.CurvePath();
        combinedCurve.add(a);
        combinedCurve.add(b);
        combinedCurve.add(c);
        

    
        return {
            lastcurve: c,
            combinedCurve: combinedCurve
        };
    }
    function inTheNet(lastVector)
    {
        
        randomnet = Math.floor(Math.random() * tableWidth/2)
        randomSide = Math.random();
        if(randomSide < 0.5)
        {
            randomnet = -randomnet
        }
        start = lastVector.getPointAt(1)
        a = new THREE.LineCurve3(start, new THREE.Vector3(0, ballRadius+ tableHeight,randomnet))
        const combinedCurve = new THREE.CurvePath();
        combinedCurve.add(a);

        return{

         combinedCurve : combinedCurve
        }

    }

    function outside(lastVector)
    {
        
        randomLength = Math.floor(Math.random() * tableLength/4)
        randomWidth =  Math.floor(Math.random() * tableWidth/2)
        randomSide = Math.random();
        if(randomSide < 0.5)
        {
            randomWidth = -randomWidth
        }
        start = lastVector.getPointAt(1)
        a = new THREE.LineCurve3(start, new THREE.Vector3(-lastVector.getPointAt(1).x-randomLength, ballRadius+ tableHeight,randomWidth))
        const combinedCurve = new THREE.CurvePath();
        combinedCurve.add(a);
        return{

         combinedCurve : combinedCurve
        }

    }

    
function fail(lastcurve)
    {
        whichOne = Math.random();
        if (whichOne < 0.5)
        {
            result = outside(lastcurve);
        }
        else{
            result = inTheNet(lastcurve);
        }
        const combinedCurve = new THREE.CurvePath();
        a = result.combinedCurve;
        combinedCurve.add(a);
        return {
            
            combinedCurve: combinedCurve
        };
        
    }



function runIteration()
    {
       
        random = Math.floor(Math.random() * (15 - 6) + 6);
        mod1=0;
        mod2=0
        const combinedCurve = new THREE.CurvePath();

        serviceResult= service();
        lastcurve = serviceResult.curveD;
        a = serviceResult.combinedCurve;
        combinedCurve.add(a);
        

        for (let i = 0; i < random-1; i++) {
            if (i % 2 == 0) {
                result = droit(lastcurve, mod1);
                mod1 +=1;

            } 
            else if (i%2==1)
            {
                result = diagonale(lastcurve, mod2);
                mod2 +=1;
            }
            
            a = result.combinedCurve
            lastcurve = result.lastcurve
            
        
            combinedCurve.add(a); 
            
            
        }
        
        result = fail(lastcurve);
        a = result.combinedCurve
        combinedCurve.add(a); 

        if (random % 2 == 0)
        {
            score1 += 1;
        }
        else{
            score2 +=1;
        }
        
        console.log("Jaune : "+score1,"Rouge : " +score2);
        ballInstance.setCurve(combinedCurve);

        // Start the ball animation
        ballInstance.startAnimation();

        // Your animation/rendering loop here
        function animate() {
            requestAnimationFrame(animate);
            
            ballInstance.updateBallPosition(Date.now());

            // Rotate the table
            // table.rotation.y += 0.01;
            // table.rotation.x += 0.01;
            controls.update();
            // Render the scene with the camera
            renderer.render(scene, camera);
        }
        console.log(random)
        animate(); // Start the animation loop
    
    }




document.addEventListener('DOMContentLoaded', function () {

    // Sélectionnez le bouton par son ID
    const startButton = document.getElementById('startButton');

    // Ajoutez un gestionnaire d'événements pour le clic sur le bouton
    startButton.addEventListener('click', function () {
        // Appelez votre fonction runIteration ici
        runIteration();
    });

    // Démarrez l'animation après le chargement de la page
    runIteration(); 
});
