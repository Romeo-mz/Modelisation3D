export function sphere(r, n, oppacity, color){
    const geometry = new THREE.SphereGeometry(r, n, n);
    const material = new THREE.MeshPhongMaterial({color: color, oppacity: oppacity })
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
}