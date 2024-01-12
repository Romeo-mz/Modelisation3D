const borneVue=36;//amplitude de deplacement de la camera
const borneSphere=3;//amplitude de deplacement de la sphere
const longCone=0.25;//pour les fleches des vecteurs
const RayonCone =0.125;

// vecteur normal non nul
let a = 0, b= 1, c = 1;
let vecN = new THREE.Vector3(a, b, c);
let vec_e1 = new THREE.Vector3(-c, -c , a+b);
let vec_e2 = new THREE.Vector3(0, 0 , 0);
// point du plan
let xA = 0, yA = 0, zA = 0;
let ptA = new THREE.Vector3(xA, yA, zA);

//borne du plan
let u0 = -4, u1 = 4;
let v0 = -3, v1 = 3;//depart de l'intervalle

 PlanPara = function (u, v, resultCalcul) {
 u = u0 + u * (u1 - u0); // intervalle en U
 v = v0 + v * (v1 - v0); // intervalle en V
 if (vecN.dot(vecN)>0.001){
  vecN.normalize();-1
  vec_e1.normalize();
  vec_e2.crossVectors(vecN,vec_e1);
 }
 let result = resultCalcul || new THREE.Vector3();
 let x = xA + u * vec_e1.x + v * vec_e2.x;
 let y = yA + u * vec_e1.y + v * vec_e2.y;
 let z = zA + u * vec_e1.z + v * vec_e2.z;
 return result.set( x, y, z );
};//fin PlanPara

function arron(n){
 return (Math.round(n*1000)/1000);
}

function tracePt(MaScene, P, CoulHexa,dimPt,bol){
 let sphereGeometry = new THREE.SphereGeometry(dimPt,12,24);
 let  sphereMaterial = new THREE.MeshBasicMaterial({color: CoulHexa });
 let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
 sphere.position.set(P.x,P.y,P.z);
 if (bol) MaScene.add(sphere);
 return sphere;
} // fin function tracePt


function PtsCourbePara(R1,R2,nb,vecN,vec_e1,pt){
  let points = new Array(nb+1);
  vecN.normalize();
  vec_e1.normalize();
  vec_e2.crossVectors(vecN,vec_e1);
  for(var k=0;k<=nb;k++){
    let t2=k/nb*2*Math.PI;
    let x0=R1*Math.cos(t2);
    let y0=R2*Math.sin(t2);
    let v1=vec_e1.clone();
    let v2=vec_e2.clone();
    v1.multiplyScalar(x0);
    v2.multiplyScalar(y0);
    points[k] = new THREE.Vector3(0,0,0);
    points[k].addVectors(v1,v2);
    points[k].addVectors(ptA,points[k]);
  }
  let PtsCbePara = new THREE.BufferGeometry().setFromPoints(points);
  let mes2d="X(t) = "+R1+" &times cos(t)<br />";
  mes2d+="Y(t) = "+R2+" &times sin(t)";
  document.getElementById("Eq2d").innerHTML=mes2d;
  let mes3d="X(t) = "+(R1*vec_e1.x)+" &times cos(t) ";
  mes3d+="+ "+(R2*vec_e2.x)+" &times sin(t) <br />";
  mes3d+="Y(t) = "+(R1*vec_e1.y)+" &times cos(t) ";
  mes3d+="+ "+(R2*vec_e2.y)+" &times sin(t) <br />";
  mes3d+="Z(t) = "+(R1*vec_e1.z)+" &times cos(t) ";
  mes3d+="+ "+(R2*vec_e2.z)+" &times sin(t) <br />";
  document.getElementById("Eq3d").innerHTML=mes3d;

  return PtsCbePara;
}//fin function PtsCourbePara

function init(){
 var stats = initStats();
    // creation de rendu et de la taille
 let rendu = new THREE.WebGLRenderer({ antialias: true });
 rendu.shadowMap.enabled = true;
 let scene = new THREE.Scene();   
 let result;
 let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
 rendu.shadowMap.enabled = true;
 rendu.setClearColor(new THREE.Color(0xFFFFFF));
 rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);
 cameraLumiere(scene,camera);
 lumiere(scene);
 repere(scene);
 //plans contenant deux axes du repere
 //planRepere(scene);
 
 let MaterialPhong = new THREE.MeshPhongMaterial({
   color: "#999900",
   opacity: 1,
   transparent: true,
   wireframe: false,
   emissive:0x224422,
   specular:"#00FFFF", 
   flatShading: true,
   shininess:30,//brillance
   side: THREE.DoubleSide,//2
 //  side: THREE.FrontSide,//0
   //side: THREE.BackSide,//1
 });


let NbeU = 100, NbeV = 100; //Nbre de pts dans les cotes du pave


let PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
 //PlanGeom.center();
let PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
PlanPhong.castShadow = true;
PlanPhong.receiveShadow = true;
scene.add(PlanPhong);
 
//ajout
 let R1=2;
 let R2=1.5;
 let nb=100;
 let epaiCbe = 3;
 let dimPt=0.05;
 let PtsTab = PtsCourbePara(R1,R2,nb,vecN,vec_e1);
 let ProprieteCbe = new THREE.LineBasicMaterial( {
  color:"#FF0000",
  linewidth:epaiCbe
 } );
 let courbePara = new THREE.Line( PtsTab, ProprieteCbe );
 scene.add(courbePara);
 let vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
 let vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
 let vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
 let pointA = tracePt(scene, ptA, 0x000000,dimPt,false);
 scene.add(pointA);
 scene.add(vecteurN);
 scene.add(vecteurE1);
 scene.add(vecteurE2);

 
 //********************************************************
 //
 //  D E B U T     M E N U     G U I
 //
 //********************************************************
 var gui = new dat.GUI();//interface graphique utilisateur
  // ajout du menu dans le GUI
 let menuGUI = new function () {
   this.cameraxPos = camera.position.x;
   this.camerayPos = camera.position.y;
   this.camerazPos = camera.position.z;
   this.cameraZoom = 1;
   //pb avec camera lockAt
   this.cameraxDir = 0;//camera.getWorldDirection().x;
   this.camerayDir = 0;//camera.getWorldDirection().y;
   this.camerazDir = 0;//camera.getWorldDirection().z;
   this.cameraFar = 100; //distance du plan le plus loin
   this.cameraNear = 0.1; //distance du plan le plus proche
   this.cameraFov = 90;// angle de vision de 90°
/************************************************************
 *
 * K L E I N   G E O M E T R I Q U E
 * 
 *
 ************************************************************/
 this.coef_a = vecN.x;
 this.coef_b = vecN.y;
 this.coef_c = vecN.z;
 this.coef_xa = ptA.x;
 this.coef_ya = ptA.y;
 this.coef_za = ptA.z;
 this.Ufin = u1;
 this.Vfin = v1;
 this.NbPtU = NbeU;
 this.NbPtV = NbeV;
 this.Vini = v0;
 this.Uini = v0;
/*************************************************************
 *
 *
 *      I L L U M I N A T I O N
 * 
 *
 ************************************************************/
   this.AffichagePhong = true;//.visible;
   this.CouleurPhong = MaterialPhong.color.getStyle();
   this.opacitePhong = MaterialPhong.opacity;
   this.emissivePhong = MaterialPhong.emissive.getHex();
   this.specularPhong = MaterialPhong.specular.getStyle();
   this.brillancePhong = MaterialPhong.shininess;
   if (MaterialPhong.wireframe)
    this.FilDeFer = 'Oui';
    else this.FilDeFer = 'Non';
   if (MaterialPhong.flatShading)
    this.lissage = 'Oui';
    else this.lissage = 'Non';
   switch (MaterialPhong.side){
    case 1 : this.faces = 'Avant'; break;
    case 0 : this.faces = 'Arriere'; break;
    case 2 : this.faces = 'DeuxFaces';
   }

   //pour actualiser dans la scene   
   this.actualisation = function () {
    //posCamera();
    cameraLumiere(scene,camera);
    reAffichage();
   }; // fin this.actualisation
 }; // fin de la fonction menuGUI
 /**********************************************************
  * 
  * 
  *  Ajout dans le menu
  * 
  * 
  * ********************************************************/
 // ajout de la camera dans le menu
 ajoutCameraGui(gui,menuGUI,camera)
 // sphere geometrique
 let guiPlanGeom = gui.addFolder("Plan : géométrie");
 // valeur des parametres 
 guiPlanGeom.add(menuGUI,'coef_a',-5,5).onChange(function(){
   if (PlanPhong) scene.remove(PlanPhong); 
   a = menuGUI.coef_a; 
   vecN = new THREE.Vector3(a, b, c);
   vec_e1 = new THREE.Vector3(-c, -c , a+b); 
   if (vecN.dot(vecN)>0.001){
    vecN.normalize();
    vec_e1.normalize();
    vec_e2.crossVectors(vecN,vec_e1);
    menuGUI.coeff_a = vecN.x;
    menuGUI.coeff_b = vecN.y;
    menuGUI.coeff_c = vecN.z;
    guiPlanGeom.updateDisplay();
   }
   PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
   PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
   scene.add(PlanPhong);
   //actualisation de la courbe
   if (courbePara) scene.remove(courbePara);
   PtsTab = PtsCourbePara(R1,R2,nb,vecN,vec_e1);
   courbePara = new THREE.Line( PtsTab, ProprieteCbe );
   scene.add(courbePara);
   if (vecteurN) scene.remove(vecteurN);
   if (vecteurE1) scene.remove(vecteurE1);
   if (vecteurE2) scene.remove(vecteurE2);
   vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
   vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
   vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
   scene.add(vecteurN);
   scene.add(vecteurE1);
   scene.add(vecteurE2);
 }); 
 guiPlanGeom.add(menuGUI,'coef_b',-5,5).onChange(function(){
   if (PlanPhong) scene.remove(PlanPhong); 
   b = menuGUI.coef_b; 
   vecN = new THREE.Vector3(a, b, c);
   vec_e1 = new THREE.Vector3(-c, -c , a+b); 
   if (vecN.dot(vecN)>0.001){
    vecN.normalize();
    vec_e1.normalize();
    vec_e2.crossVectors(vecN,vec_e1);
    menuGUI.coeff_a = vecN.x;
    menuGUI.coeff_b = vecN.y;
    menuGUI.coeff_c = vecN.z;
    guiPlanGeom.updateDisplay();
   }
   PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
   PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
   scene.add(PlanPhong);
   //actualisation de la courbe
   if (courbePara) scene.remove(courbePara);
   PtsTab = PtsCourbePara(R1,R2,nb,vecN,vec_e1);
   courbePara = new THREE.Line( PtsTab, ProprieteCbe );
   scene.add(courbePara);
   if (vecteurN) scene.remove(vecteurN);
   if (vecteurE1) scene.remove(vecteurE1);
   if (vecteurE2) scene.remove(vecteurE2);
   vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
   vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
   vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
   scene.add(vecteurN);
   scene.add(vecteurE1);
   scene.add(vecteurE2);
 }); 
 guiPlanGeom.add(menuGUI,'coef_c',-5,5).onChange(function(){
   if (PlanPhong) scene.remove(PlanPhong); 
   c = menuGUI.coef_c; 
   vecN = new THREE.Vector3(a, b, c);
   vec_e1 = new THREE.Vector3(-c, -c , a+b); 
   if (vecN.dot(vecN)>0.001){
    vecN.normalize();
    vec_e1.normalize();
    vec_e2.crossVectors(vecN,vec_e1);
    menuGUI.coeff_a = vecN.x;
    menuGUI.coeff_b = vecN.y;
    menuGUI.coeff_c = vecN.z;
    guiPlanGeom.updateDisplay();
   }
   document.getElementById('result').innerHTML+='<br /> menuGUI.coeff_a = '+menuGUI.coeff_a;
   document.getElementById('result').innerHTML+='<br /> menuGUI.coeff_b = '+menuGUI.coeff_b;
   document.getElementById('result').innerHTML+='<br /> menuGUI.coeff_c = '+menuGUI.coeff_c+'<hr />'; 
   PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
   PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
   scene.add(PlanPhong);
   //actualisation de la courbe
   if (courbePara) scene.remove(courbePara);
   PtsTab = PtsCourbePara(R1,R2,nb,vecN,vec_e1);
   courbePara = new THREE.Line( PtsTab, ProprieteCbe );
   scene.add(courbePara);
   if (vecteurN) scene.remove(vecteurN);
   if (vecteurE1) scene.remove(vecteurE1);
   if (vecteurE2) scene.remove(vecteurE2);
   vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
   vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
   vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
   scene.add(vecteurN);
   scene.add(vecteurE1);
   scene.add(vecteurE2);
 }); 
 // point ptA
 guiPlanGeom.add(menuGUI,'coef_xa',-5,5).onChange(function(){
   if (PlanPhong) scene.remove(PlanPhong); 
   xA = menuGUI.coef_xa; 
   ptA.x= menuGUI.coef_xa;
   PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
   PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
   scene.add(PlanPhong);
   //actualisation de la courbe
   if (courbePara) scene.remove(courbePara);
   PtsTab = PtsCourbePara(R1,R2,nb,vecN,vec_e1);
   courbePara = new THREE.Line( PtsTab, ProprieteCbe );
   scene.add(courbePara);
   if (vecteurN) scene.remove(vecteurN);
   if (vecteurE1) scene.remove(vecteurE1);
   if (vecteurE2) scene.remove(vecteurE2);
   vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
   vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
   vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
   scene.add(vecteurN);
   scene.add(vecteurE1);
   scene.add(vecteurE2);
   if (pointA) scene.remove(pointA);
   pointA = tracePt(scene, ptA, 0x000000,dimPt,false);
   scene.add(pointA);
 }); 
 guiPlanGeom.add(menuGUI,'coef_ya',-5,5).onChange(function(){
   if (PlanPhong) scene.remove(PlanPhong); 
   yA = menuGUI.coef_ya; 
   ptA.y= menuGUI.coef_ya;
   PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
   PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
   scene.add(PlanPhong);
   //actualisation de la courbe
   if (courbePara) scene.remove(courbePara);
   PtsTab = PtsCourbePara(R1,R2,nb,vecN,vec_e1);
   courbePara = new THREE.Line( PtsTab, ProprieteCbe );
   scene.add(courbePara);
   if (vecteurN) scene.remove(vecteurN);
   if (vecteurE1) scene.remove(vecteurE1);
   if (vecteurE2) scene.remove(vecteurE2);
   vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
   vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
   vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
   scene.add(vecteurN);
   scene.add(vecteurE1);
   scene.add(vecteurE2);
   if (pointA) scene.remove(pointA);
   pointA = tracePt(scene, ptA, 0x000000,dimPt,false);
   scene.add(pointA);
 }); 
 guiPlanGeom.add(menuGUI,'coef_za',-5,5).onChange(function(){
   if (PlanPhong) scene.remove(PlanPhong); 
   zA = menuGUI.coef_za; 
   ptA.z= menuGUI.coef_za;
   PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
   PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
   scene.add(PlanPhong);
   //actualisation de la courbe
   if (courbePara) scene.remove(courbePara);
   PtsTab = PtsCourbePara(R1,R2,nb,vecN,vec_e1);
   courbePara = new THREE.Line( PtsTab, ProprieteCbe );
   scene.add(courbePara);
   if (vecteurN) scene.remove(vecteurN);
   if (vecteurE1) scene.remove(vecteurE1);
   if (vecteurE2) scene.remove(vecteurE2);
   vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
   vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
   vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
   scene.add(vecteurN);
   scene.add(vecteurE1);
   scene.add(vecteurE2);
   if (pointA) scene.remove(pointA);
   pointA = tracePt(scene, ptA, 0x000000,dimPt,false);
   scene.add(pointA);
 }); 

 //Debut de l'intervalle pour u
 guiPlanGeom.add(menuGUI,'Uini',-5,5).onChange(function(){
   if (PlanPhong) scene.remove(PlanPhong); 
   u0 = menuGUI.Uini; 
   PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
   PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
   scene.add(PlanPhong);
   //actualisation de la courbe
   if (courbePara) scene.remove(courbePara);
   PtsTab = PtsCourbePara(R1,R2,nb,vecN,vec_e1);
   courbePara = new THREE.Line( PtsTab, ProprieteCbe );
   scene.add(courbePara);
   if (vecteurN) scene.remove(vecteurN);
   if (vecteurE1) scene.remove(vecteurE1);
   if (vecteurE2) scene.remove(vecteurE2);
   vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
   vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
   vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
   scene.add(vecteurN);
   scene.add(vecteurE1);
   scene.add(vecteurE2);
 }); 
 //fin de l'intervalle pour u
 guiPlanGeom.add(menuGUI,'Ufin',-5,5).onChange(function(){
   if (PlanPhong) scene.remove(PlanPhong); 
   u1 = menuGUI.Ufin; 
   PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
   PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
   scene.add(PlanPhong);
   //actualisation de la courbe
   if (courbePara) scene.remove(courbePara);
   PtsTab = PtsCourbePara(R1,R2,nb,vecN,vec_e1);
   courbePara = new THREE.Line( PtsTab, ProprieteCbe );
   scene.add(courbePara);
   if (vecteurN) scene.remove(vecteurN);
   if (vecteurE1) scene.remove(vecteurE1);
   if (vecteurE2) scene.remove(vecteurE2);
   vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
   vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
   vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
   scene.add(vecteurN);
   scene.add(vecteurE1);
   scene.add(vecteurE2);
 }); 
 //Debut de l'intervalle pour v
 
 guiPlanGeom.add(menuGUI,'Vini',-5,5).onChange(function(){
   if (PlanPhong) scene.remove(PlanPhong); 
   v0 = menuGUI.Vini; 
   PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
   PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
   scene.add(PlanPhong);
   //actualisation de la courbe
   if (courbePara) scene.remove(courbePara);
   PtsTab = PtsCourbePara(R1,R2,nb,vecN,vec_e1);
   courbePara = new THREE.Line( PtsTab, ProprieteCbe );
   scene.add(courbePara);
   if (vecteurN) scene.remove(vecteurN);
   if (vecteurE1) scene.remove(vecteurE1);
   if (vecteurE2) scene.remove(vecteurE2);
   vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
   vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
   vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
   scene.add(vecteurN);
   scene.add(vecteurE1);
   scene.add(vecteurE2);
 });  
 //fin de l'intervalle pour v
 guiPlanGeom.add(menuGUI,'Vfin',-5,5).onChange(function(){
   if (PlanPhong) scene.remove(PlanPhong); 
   v1 = menuGUI.Vfin; 
   PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
   PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
   scene.add(PlanPhong);
   //actualisation de la courbe
   if (courbePara) scene.remove(courbePara);
   PtsTab = PtsCourbePara(R1,R2,nb,vecN,vec_e1);
   courbePara = new THREE.Line( PtsTab, ProprieteCbe );
   scene.add(courbePara);
   if (vecteurN) scene.remove(vecteurN);
   if (vecteurE1) scene.remove(vecteurE1);
   if (vecteurE2) scene.remove(vecteurE2);
   vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
   vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
   vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
   scene.add(vecteurN);
   scene.add(vecteurE1);
   scene.add(vecteurE2);
 }); 
 
 guiPlanGeom.add(menuGUI,'NbPtU',5,20).onChange(function(){
   if (PlanPhong) scene.remove(PlanPhong); 
   menuGUI.NbPtU = Math.floor(menuGUI.NbPtU);
   NbeU = menuGUI.NbPtU; 
   PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
   PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
   scene.add(PlanPhong);
   //actualisation de la courbe
   if (courbePara) scene.remove(courbePara);
   PtsTab = PtsCourbePara(R1,R2,nb,vecN,vec_e1);
   courbePara = new THREE.Line( PtsTab, ProprieteCbe );
   scene.add(courbePara);
   if (vecteurN) scene.remove(vecteurN);
   if (vecteurE1) scene.remove(vecteurE1);
   if (vecteurE2) scene.remove(vecteurE2);
   vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
   vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
   vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
   scene.add(vecteurN);
   scene.add(vecteurE1);
   scene.add(vecteurE2);
 }); 
 guiPlanGeom.add(menuGUI,'NbPtV',5,20).onChange(function(){
   if (PlanPhong) scene.remove(PlanPhong); 
   menuGUI.NbPtV = Math.floor(menuGUI.NbPtV);
   NbeV = menuGUI.NbPtV; 
   PlanGeom = new THREE.ParametricGeometry(PlanPara, NbeU, NbeV);
   PlanPhong = new THREE.Mesh(PlanGeom, MaterialPhong);
   scene.add(PlanPhong);
   if (vecteurN) scene.remove(vecteurN);
   if (vecteurE1) scene.remove(vecteurE1);
   if (vecteurE2) scene.remove(vecteurE2);
   vecteurN = new THREE.ArrowHelper( vecN, ptA, vecN.length(), 0xFF9900, longCone, RayonCone );
   vecteurE1 = new THREE.ArrowHelper( vec_e1, ptA, vec_e1.length(), 0xFF00FF, longCone, RayonCone );
   vecteurE2 = new THREE.ArrowHelper( vec_e2, ptA, vec_e2.length(), 0x00FFFF, longCone, RayonCone );
   scene.add(vecteurN);
   scene.add(vecteurE1);
   scene.add(vecteurE2);
   //actualisation de la courbe

 }); 

 
 /*************************************************
  * 
  *     P H O N G 
  * 
  * 
  * *************************************************/
 // ajout de PlanPhong dans le menu du GUI
 let guiPlanPhong = gui.addFolder("Plan : Phong"); 
 // mettre 'PlanPhong' comme dans 'this.AffichagePhong'
 gui.add(menuGUI,'AffichagePhong').onChange(function (e) {
   if (!e) scene.remove(PlanPhong);                                                                                                           else scene.add(PlanPhong);
 });//fin cochage  Phong
 guiPlanPhong.addColor(menuGUI,'CouleurPhong').onChange(function (e) {
  MaterialPhong.color.setStyle(e);
    });
 //emissivite
 guiPlanPhong.addColor(menuGUI,'emissivePhong').onChange(function (e) {

  MaterialPhong.emissive= new THREE.Color(e);
    });
 //specularPhong
 guiPlanPhong.addColor(menuGUI,'specularPhong').onChange(function (e) {

  MaterialPhong.specular= new THREE.Color(e);
    });
 //brillance
 guiPlanPhong.add(menuGUI,'brillancePhong',0,200).onChange(function (e) {

  MaterialPhong.shininess = e;
    });
 //FilDeFer
 guiPlanPhong.add(menuGUI,'FilDeFer',['Oui','Non']).onChange(function (e) {

   if (e=='Oui') 
    MaterialPhong.wireframe = true;
    else MaterialPhong.wireframe = false;                                 
   //document.getElementById('result').innerHTML+="<br /> flatSchading : "+MaterialPhong.flatShading;
    });
 //lissage = MaterialPhong.flatShading;
 guiPlanPhong.add(menuGUI,'lissage',['Oui','Non']).onChange(function (e) {

   if (e=='Oui') 
    MaterialPhong.flatShading = true;
    else MaterialPhong.flatShading = false;                                 
   document.getElementById('result').innerHTML+="<br /> flatSchading : "+MaterialPhong.flatShading;
    });
 //opacity
 guiPlanPhong.add(menuGUI,'opacitePhong',0,1).onChange(function (e) {
  MaterialPhong.opacity=e;
    }); 
 guiPlanPhong.add(menuGUI,'faces',['Avant','Arriere','DeuxFaces']).onChange(function (e) {
  if (e=='Avant') 
   MaterialPhong.side=1;
   else if (e=='Arriere') 
     MaterialPhong.side=0;
     else MaterialPhong.side=2;
  document.getElementById("result").innerHTML+="<br /> faces : "+MaterialPhong.side;
    //side: THREE.DoubleSide,//2
 //  side: THREE.FrontSide,//0
  // side: THREE.BackSide,//1
    }); 
 
 //side: THREE.FrontSide,MaterialPhong.side
 //Gouraud  
 
 //ajout du menu pour actualiser l'affichage 
 gui.add(menuGUI, "actualisation");
 menuGUI.actualisation();
 //********************************************************
 //
 //  F I N     M E N U     G U I
 //
 //********************************************************
 renduAnim();
 
  // definition des fonctions idoines
 function posCamera(){
  camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom),menuGUI.camerayPos*testZero(menuGUI.cameraZoom),menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
  camera.lookAt(menuGUI.cameraxDir,menuGUI.camerayDir,menuGUI.camerazDir);
  actuaPosCameraHTML();
 }
 
 function actuaPosCameraHTML(){
  document.forms["controle"].PosX.value=testZero(menuGUI.cameraxPos);
  document.forms["controle"].PosY.value=testZero(menuGUI.camerayPos);
  document.forms["controle"].PosZ.value=testZero(menuGUI.camerazPos); 
  document.forms["controle"].DirX.value=testZero(menuGUI.cameraxDir);
  document.forms["controle"].DirY.value=testZero(menuGUI.camerayDir);
  document.forms["controle"].DirZ.value=testZero(menuGUI.camerazDir);
 } // fin fonction posCamera
  // ajoute le rendu dans l'element HTML
 document.getElementById("webgl").appendChild(rendu.domElement);
   
  // affichage de la scene
 rendu.render(scene, camera);
  
 
 function reAffichage() {
  setTimeout(function () { 
   if (PlanPhong) scene.remove(PlanPhong);
   if (courbePara) scene.remove(courbePara);
   posCamera();//PlanPhong.parameters.radius = 2;//
   scene.add(PlanPhong);
   scene.add(courbePara);
  }, 200);// fin setTimeout(function ()
    // render using requestAnimationFrame
  rendu.render(scene, camera);
 }// fin fonction reAffichage()
 
 
  function renduAnim() {
    stats.update();

    /*if (menuGUI.rotateResult && result) {
      result.rotation.y += 0.04;
      //      result.rotation.x+=0.04;
      result.rotation.z -= 0.005;
    }*/

    // render using requestAnimationFrame
    requestAnimationFrame(renduAnim);
// ajoute le rendu dans l'element HTML
    rendu.render(scene, camera);
  }
 
} // fin fonction init()
