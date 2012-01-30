

function Zombie (position) {
    this.mesh = new THREE.Mesh(
                    new THREE.CubeGeometry( 30, 30, 50),
                    new THREE.MeshLambertMaterial( { color: 0x44DD44 }) );
    this.mesh.position = position;

    var hitBox = new THREE.Mesh(
                    new THREE.CylinderGeometry( 21,21, 50,10,10),
                    new THREE.MeshBasicMaterial({wireframe: true, wireframeLinewidth : 1, color:0xFF0000})
                );
    hitBox.rotation.x = 90*Math.PI/180;
    this.mesh.add(hitBox);
}

Zombie.prototype.getMesh = function() {
    return this.mesh;
};