

function Bullet (player) {
    this.sourcePos = player.mesh.position;
    this.radius = 2;
    this.strength = 70;
    this.speed = 25;
    this.range = 1000;
    this.isPassive = false;
    this.direction = player.mesh.rotation.z;


    var xStep = Math.cos(this.direction);
    var yStep = Math.sin(this.direction);


    /*var geometry = new THREE.Geometry();

    var vector = player.mesh.position.clone();

    geometry.vertices.push( new THREE.Vertex( vector ) );
    var vector2 = vector.clone();

    vector2.x +=xStep*10;
    vector2.y +=yStep*10;

    geometry.vertices.push( new THREE.Vertex( vector2 ) );
    this.mesh = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xAAAAAA , linewidth:3} ) );*/

    this.mesh = new THREE.Mesh(
                new THREE.SphereGeometry(this.radius,5,5),
                new THREE.MeshLambertMaterial( { color: 0xFF0000 }) );

    this.stepVector = new THREE.Vector3(xStep*=this.speed,yStep*=this.speed,0);

    this.startPoint =  player.mesh.position.clone();
    this.mesh.position = player.mesh.position.clone();
}

Bullet.prototype.update = function(delta) {
    if(this.startPoint.distanceTo(this.mesh.position) > this.range){
        this.isPassive = true;
        return;
    }
    this.mesh.position.addSelf(this.stepVector);
};
