
const depth = 1;

class Net{
    constructor(scene, table){
        this.scene = scene;
        this.table = table;
        this.depth = depth;
    }

    render(){
        const geometry = new THREE.BoxGeometry( 0.1, depth - 0.3, this.table.width - 0.1 );
        const netMaterial = new THREE.MeshBasicMaterial( {color: 0xfffffff, transparent: true, opacity: 0.8} );
        const net = new THREE.Mesh( geometry, netMaterial );

        net.position.x = 0;
        net.position.y = depth/2 + 0.1;
        net.position.z = 0;

        this.scene.add( net );
        
        const netLegMaterial = new THREE.MeshBasicMaterial( {color: 0x007879} );
        const netLegLeft = new THREE.Mesh( new THREE.BoxGeometry( 0.1, depth + 0.1, 0.1 ), netLegMaterial );
        const netLegRight = new THREE.Mesh( new THREE.BoxGeometry( 0.1, depth + 0.1, 0.1 ), netLegMaterial );

        netLegLeft.position.x = 0;
        netLegLeft.position.y = depth/2;
        netLegLeft.position.z = -(this.table.width/2);

        netLegRight.position.x = 0;
        netLegRight.position.y = depth/2;
        netLegRight.position.z = this.table.width/2;

        this.scene.add( netLegLeft );
        this.scene.add( netLegRight );
    }
}

window.Net = Net;