

function Zombie (position) {
    this.radius = 21;
    this.life = 3;
    this.isPassive = false;
    this.mesh = new THREE.Mesh(
                    new THREE.CubeGeometry( 30, 30, 50),
                    new THREE.MeshLambertMaterial( { color: 0x44DD44 }) );
    this.mesh.position = position;

    var hitBox = new THREE.Mesh(
                    new THREE.CylinderGeometry( this.radius,this.radius, 50,10,10),
                    new THREE.MeshBasicMaterial({wireframe: true, wireframeLinewidth : 1, color:0xFF0000})
                );
    hitBox.rotation.x = 90*Math.PI/180;
    this.mesh.add(hitBox);
}

Zombie.prototype.getMesh = function() {
    return this.mesh;
};


Zombie.prototype.hitTestBullets = function(bullets) {
    for (var i = 0; i < bullets.length; i++) {

        var dist = this.mesh.position.distanceTo(bullets[i].mesh.position);
        if(dist < this.radius){
            bullets[i].isPassive = true;
            this.life--;

            //fallback
            var angle = Math.atan2(
                this.mesh.position.y - bullets[i].sourcePos.y,
                this.mesh.position.x - bullets[i].sourcePos.x
            );

            this.mesh.position.addSelf(new THREE.Vector3(
                Math.cos(angle)*bullets[i].strength,
                Math.sin(angle)*bullets[i].strength,0));


            if(this.life <= 0){
                this.isPassive = true;
            }
        }
    };
};
