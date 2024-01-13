class TableLeg{
    constructor(scene, table){
        this.scene = scene;
        this.table = table;
        this.position = new THREE.Vector3();
        this.height = this.table.width / 3;
    }

    render(){
        const legGeometry = new THREE.BoxGeometry( 0.3, this.height, 0.3 );
        const legMaterial = new THREE.MeshBasicMaterial( {color: 0x007879} );
        const leg = new THREE.Mesh( legGeometry, legMaterial );

        leg.position.set(this.position.x, this.position.y - 0.01, this.position.z);

        this.scene.add( leg );
    }
}

window.TableLeg = TableLeg;