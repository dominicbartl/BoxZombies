

function Player (position) {
    this.radius = 21;
    this.speed = 40;
    this.life = 100;
    this.DEG_RAD = Math.PI/180;
    this.direction = 0;
    this.mesh = new THREE.Mesh(
        new THREE.CubeGeometry( 30, 30, 60),
        new THREE.MeshLambertMaterial( { color: 0x444444 })
    );
    this.mesh.position = position;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    /*var hitBox = new THREE.Mesh(
        new THREE.CylinderGeometry( this.radius,this.radius, 50,10,10),
        new THREE.MeshBasicMaterial({wireframe: true, wireframeLinewidth : 1, color:0xFF0000})
    );
    hitBox.rotation.x = 90*Math.PI/180;
    this.mesh.add(hitBox);*/
}

Player.prototype.update = function(delta){
    this.angle*=(Math.PI/180);
    if(this.shouldMove){
        var step = new THREE.Vector3(
            Math.cos(this.direction)*this.speed*delta,
            Math.sin(this.direction)*this.speed*delta,
            0
        );
        this.mesh.position.addSelf(step);
    }
}

Player.prototype.getMesh = function() {
    return this.mesh;
};

Player.prototype.move = function(up,left,down,right) {
    
        if(up){
            this.direction = 90*this.DEG_RAD;
            if(left) this.direction = 45*this.DEG_RAD;
            else if(right) this.direction = 135*this.DEG_RAD;
                
        }else
            if(down){
                this.direction = 270*this.DEG_RAD;

                if(left) this.direction = 315*this.DEG_RAD;
                else if(right) this.direction = 225*this.DEG_RAD;

            }else if(left)
                this.direction = 0*this.DEG_RAD;

                else if(right)
                this.direction = 180*this.DEG_RAD;
    
};
