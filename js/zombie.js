

function Zombie (position) {
    this.radius = 21;
    this.life = 3;
    this.isPassive = false;
    this.speed = 20;
    this.targetPlayer;
    this.mesh = new THREE.Mesh(
                    new THREE.CubeGeometry( 30, 30, 50),
                    new THREE.MeshLambertMaterial( { color: 0x44DD44 }) );
    this.mesh.position = position;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

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

Zombie.prototype.setTarget = function(player) {
    this.targetPlayer = player;
};

Zombie.prototype.update = function (delta, zombies, bullets){
    //Movement to target
    var offX = this.targetPlayer.mesh.position.x - this.mesh.position.x;
    var offY = this.targetPlayer.mesh.position.y - this.mesh.position.y;

    var zangle = Math.atan2(offY,offX);
    this.mesh.rotation.z = zangle;
    var step = new THREE.Vector3(Math.cos(zangle)*this.speed*delta,Math.sin(zangle)*this.speed*delta,0); 
    this.mesh.position.addSelf(step);

    //HitTest with player
    offX = this.targetPlayer.mesh.position.x - this.mesh.position.x;
    offY = this.targetPlayer.mesh.position.y - this.mesh.position.y;
    var pdist = Math.sqrt(offX*offX + offY*offY);
    zangle = Math.atan2(offY,offX);

    var pradii = this.radius+this.targetPlayer.radius;
    if(pdist != 0){
        if(pdist < pradii){
            //var point = new THREE.Vector3(zoffX,zoffY,0);
            this.mesh.position.x = this.targetPlayer.mesh.position.x-(pradii * Math.cos(zangle));
            this.mesh.position.y = this.targetPlayer.mesh.position.y-(pradii * Math.sin(zangle));
        }
    }

    //hitTest with bullets
    this.hitTestBullets(bullets);

    //hitTest with zombies
    this.hitTestZombies(zombies);
    


}

Zombie.prototype.hitTestZombies = function(zombies) {
    for (var j = 0; j < zombies.length; j++) {

            var zoffX = zombies[j].mesh.position.x - this.mesh.position.x;
            var zoffY = zombies[j].mesh.position.y - this.mesh.position.y;

            var dist = Math.sqrt(zoffX*zoffX + zoffY*zoffY);
            var cangle = Math.atan2(zoffY, zoffX);
            var radii = this.radius+zombies[j].radius;
            if(dist != 0){
                if(dist < radii){
                    var point = new THREE.Vector3(zoffX,zoffY,0);
                    zombies[j].mesh.position.x = this.mesh.position.x+(radii * Math.cos(cangle));
                    zombies[j].mesh.position.y = this.mesh.position.y+(radii * Math.sin(cangle));
                }
            }
        };
}


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
