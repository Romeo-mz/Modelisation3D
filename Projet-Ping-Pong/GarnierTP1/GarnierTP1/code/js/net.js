const depth = 1;
const numberOfWires = 5; // Nombre de fils dans le filet

class Net {
    constructor(scene, table) {
        this.scene = scene;
        this.table = table;
        this.depth = depth;
    }

    render() {
        
        // Créer les fils horizontaux pour le filet
        const wireGeometry = new THREE.BoxGeometry(0.1, 0.1, this.table.width - 0.1);
        const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });

        for (let i = 0; i < numberOfWires; i++) {
            const wire = new THREE.Mesh(wireGeometry, wireMaterial);

            // Positionner chaque fil en fonction de la hauteur du filet
            wire.position.x = 0;
            wire.position.y = (depth - 0.3) / (numberOfWires - 1) * i + 0.1;
            wire.position.z = 0;

            this.scene.add(wire);
        }

        // Créer les fils verticaux pour le filet
        const wireVerticalGeometry = new THREE.BoxGeometry(0.1, depth - 0.3, 0.1);
        const wireVerticalMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });

        for (let i = 0; i < numberOfWires * 8; i++) {
            const wireVertical = new THREE.Mesh(wireVerticalGeometry, wireVerticalMaterial);

            // Positionner chaque fil en fonction de la longueur du filet

            wireVertical.position.x = 0;
            wireVertical.position.y = depth / 2;
            wireVertical.position.z = (this.table.width - 0.1) / (numberOfWires * 8 - 1) * i - (this.table.width / 2);
            this.scene.add(wireVertical);
        }

        // Ajouter les pieds du filet
        const netLegMaterial = new THREE.MeshBasicMaterial({ color: 0x007879 });
        const netLegLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, depth + 0.1, 0.1), netLegMaterial);
        const netLegRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, depth + 0.1, 0.1), netLegMaterial);

        netLegLeft.position.x = 0;
        netLegLeft.position.y = depth / 2;
        netLegLeft.position.z = -(this.table.width / 2);

        netLegRight.position.x = 0;
        netLegRight.position.y = depth / 2;
        netLegRight.position.z = this.table.width / 2;

        this.scene.add(netLegLeft);
        this.scene.add(netLegRight);
    }
}

window.Net = Net;
