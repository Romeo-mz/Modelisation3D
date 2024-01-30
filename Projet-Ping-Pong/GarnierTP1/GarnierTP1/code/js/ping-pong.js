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
let initialTime;

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
    netInstance.render();
    racketInstance1.render();
    racketInstance.render();
    tableInstance.render();
    // Define control points for different parts of the leg
    const legControlPoints = {
        upper: [{ x: 1, y: 0 }, { x: 1, y: 0.2 }, { x: 0.15, y: 0.4 }],
        middle: [{ x: 0.15, y: 0.4 }, { x: 0.1, y: 0.6 }, { x: 0.1, y: 0.8 }],
        lower: [{ x: 0.1, y: 0.8 }, { x: 0.05, y: 8 }, { x: 0, y: 1 }]
    };

    // Define positions for the legs
    const legPositions = [
        { x: -tableInstance.length / 2 + 1.5, y: 1, z: -tableInstance.width / 2 + 1.5 },
        { x: -tableInstance.length / 2 + 1.5, y: 1, z: tableInstance.width / 2 - 1.5 },
        { x: tableInstance.length / 2 - 1.5, y: 1, z: -tableInstance.width / 2 + 1.5 },
        { x: tableInstance.length / 2 - 1.5, y: 1, z: tableInstance.width / 2 - 1.5 }
    ];

    // Initialize an array to store the table legs
    let tableLegs = [];

    // Define materials
    const materials = {
        leg: new THREE.MeshLambertMaterial({ color: 0x007a7a }),
    };

    // Function to convert points to THREE.Vector2
    function convertPoints(points) {
        return points.map(p => new THREE.Vector2(p.x, p.y));
    }

    // Function to create a lathe object
    function createLatheObject(points, material) {
        const geometry = new THREE.LatheGeometry(points, 32);
        return new THREE.Mesh(geometry, material);
    }

    // Function to create a table leg
    function createTableLeg(position) {
        const leg = new THREE.Object3D();

        // Add parts to the leg
        leg.add(createLatheObject(convertPoints(legControlPoints.lower), materials.leg));
        leg.add(createLatheObject(convertPoints(legControlPoints.middle), materials.leg));
        leg.add(createLatheObject(convertPoints(legControlPoints.upper), materials.leg));

        // Set rotation and position
        leg.rotation.x = Math.PI;
        leg.position.set(position.x, position.y - 1, position.z);

        // Add leg to the scene
        scene.add(leg);

        return leg;
    }

    // Function to create all table legs
    function createTableLegs() {
        // Clean up old table legs
        tableLegs.forEach(leg => {
            scene.remove(leg);
            leg.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });

        // Reset table legs array
        tableLegs = [];

        // Create new table legs
        legPositions.forEach(position => {
            const leg = createTableLeg(position);
            tableLegs.push(leg);
        });
    }

    // Function to update table legs
    function updateTableLegs() {
        createTableLegs();
    }

    // Create table legs
    createTableLegs(tableInstance);

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

    // Create the main "Leg" folder
    var legFolder = guiInstance.addFolder('Leg');

    // Create a function to add control points for a specific leg section
    function addLegControlPoints(folderName, controlPoints) {
        var folder = legFolder.addFolder(folderName + ' Lathe Points');
        controlPoints.forEach((point, index) => {
            folder.add(point, 'x', 0, 5).step(1).name(`Point ${index + 1} X`).onChange(updateTableLegs);
        });
    }

    addLegControlPoints('Lower', legControlPoints.lower);
    addLegControlPoints('Middle', legControlPoints.middle);
    addLegControlPoints('Upper', legControlPoints.upper);

    // Create the "Leg Material" subfolder
    const legMaterialFolder = legFolder.addFolder('Leg Material');
    legMaterialFolder.addColor(materials.leg, 'color').onChange(value => {
        materials.leg.color = new THREE.Color(value);
    });


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

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    tableWidth = tableInstance.getWidth();
    tableLength = tableInstance.getLength();
    tableHeight = tableInstance.getHeight();
    


   
    initialTime = ballInstance.animationDuration;
}




function service()
    {
        debut= Math.random() * tableWidth/2;
        other = Math.random() * tableWidth/2;

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

        otherSide = Math.random() * tableWidth/2;
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
        otherSide = Math.random() * tableWidth/2;
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

        
        
        ballInstance.setCurve(combinedCurve);

       

        ballInstance.animationDuration = initialTime * random;
            
        const animationDuration = ballInstance.animationDuration;

        console.log(animationDuration);

        // Start the ball animation
        ballInstance.startAnimation();

        // Your animation/rendering loop here
        function animate() {
           
            requestAnimationFrame(animate);
            
            ballInstance.updateBallPosition(Date.now());

           
            
            if (Date.now() - ballInstance.animationStartTime >= animationDuration) {
                updateScoreTable(score1,score2)
            }
           
            
                
            controls.update();
            // Render the scene with the camera
            renderer.render(scene, camera);
        }
        console.log(random)
        animate(); // Start the animation loop

        
        console.log("Jaune : "+score1,"Rouge : " +score2);
        
      
    }

    // Après chaque lancer
    function updateScoreTable(score1,score2) {
        const teamYellowCell = document.getElementById('teamYellowScore');
        const teamRedCell = document.getElementById('teamRedScore');
    
        // Mettez à jour les scores dans les cellules
        teamYellowCell.textContent = score1;
        teamRedCell.textContent = score2;
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
