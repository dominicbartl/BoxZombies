

function Bullet (player) {
    this.radius = 4;
    this.speed = 25;
    this.range = 1000;
    this.isPassive = false;
    this.direction = player.mesh.rotation.z;
    this.mesh = new THREE.Mesh(
                new THREE.SphereGeometry( this.radius,10,10),
                new THREE.MeshLambertMaterial( { color: 0xFF0000 }) );
    this.startPoint = new THREE.Vector3(
        this.mesh.position.x = player.mesh.position.x,
        this.mesh.position.y = player.mesh.position.y,
        this.mesh.position.z = player.mesh.position.z
    );
}

Bullet.prototype.update = function(delta) {
    if(this.startPoint.distanceTo(this.mesh.position) > this.range){
        this.isPassive = true;
        return;
    }
    this.mesh.position.x +=Math.cos(this.direction)*this.speed;
    this.mesh.position.y +=Math.sin(this.direction)*this.speed;
};
