

function Player (position) {
    this.radius = 21;
    this.mesh = new THREE.Mesh(
                new THREE.CubeGeometry( 30, 30, 30),
                new THREE.MeshLambertMaterial( { color: 0x444444 }) );
    this.mesh.position = position;

    var hitBox = new THREE.Mesh(
                    new THREE.CylinderGeometry( this.radius,this.radius, 50,10,10),
                    new THREE.MeshBasicMaterial({wireframe: true, wireframeLinewidth : 1, color:0xFF0000})
                );
    hitBox.rotation.x = 90*Math.PI/180;
    this.mesh.add(hitBox);
}

Player.prototype.getMesh = function() {
    return this.mesh;
};
