// ping-pong.js

function init() {
    
    const canvas = document.getElementById('ping-pong');
    const renderer = new THREE.WebGLRenderer({ canvas , antialias: true});
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 3000);
    
    const controls = new THREE.OrbitControls( camera, renderer.domElement );

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xFFE4E1);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    camera.position.set(20, 10, -10);
    camera.lookAt(0, 0, 0);

    // Create the table
    const tableInstance = new window.Table(scene);
    tableInstance.render();

    const tableWidth = tableInstance.getWidth();
    const tableLength = tableInstance.getLength();
    const tableHeight = tableInstance.getHeight();
    
    
    // Create the net
    const netInstance = new window.Net(scene, tableInstance);
    netInstance.render();

    // Create the racket
    const racketInstance = new window.Racket(scene, tableInstance);
    racketInstance.render();

    const racketPosX = racketInstance.getPosX();
    const racketPosY = racketInstance.getPosY();

    const racketThick = racketInstance.getThickness();


    // Create the ball
    const ballInstance = new TableTennisBall(scene, tableInstance);
    ballInstance.render();

    const ballRadius = ballInstance.getRadius();

    ball = ballInstance.ball

    
 
 //********************************************************
 //
 //  D E B U T     SIMULATION
 //
 //********************************************************

/*     
    nbExchange =  Math.floor(Math.random() * 20); 
    redScore = 0;
    yellowScore = 0;

    while(redScore != 11 || yellowScore != 11)
    {
        const finalCombinedCurve = new THREE.CurvePath();

        debutService = Math.floor(Math.random() * tableWidth/2);
        otherSide = Math.floor(Math.random() * tableWidth/2);
        finalCombinedCurve.add(service());

    } */
    
    

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

        console.log(whichOne);
    }

    score1 = 0;
    score2 = 0;

    random = Math.random() * (15 - 6) + 6;
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
                console.log(i,"droit");
                mod1 +=1;

            } 
            else if (i%2==1)
            {
                result = diagonale(lastcurve, mod2);
                console.log(i,"diagonale");
                mod2 +=1;
            }
            
            a = result.combinedCurve
            lastcurve = result.lastcurve
            
        
            combinedCurve.add(a); 
            
            
        }
        
        fail(lastcurve);

        if (random % 2 == 0)
        {
            score1 += 1;
        }
        else{
            score2 +=1;
        }

        console.log(score1,score2);
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

        animate(); // Start the animation loop
    
    

 
 //********************************************************
 //
 //         FIN SIMULATION
 //********************************************************
    
    // Set the curve for the ball
    
}




document.addEventListener('DOMContentLoaded', function () {
    init();
    // Votre code existant ici...

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
