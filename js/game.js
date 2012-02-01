
var camera, scene, renderer,
geometry, material, projector, mouse3D;

var camAngle = 55;
var camDist = 450;

//Setup stats
var stats = new Stats();

//Align top-left
stats.getDomElement().style.position = 'absolute';
stats.getDomElement().style.left = '0px';
stats.getDomElement().style.top = '0px';

var camOffset = new THREE.Vector3(0,-300,300);

var floor;

var player;
var bullets = [];
        var zombies = [];

        window.onload = init;


        function init() {

            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
            
            camera.lookAt(new THREE.Vector3(0,0,0));
            
            scene.add( camera );

            // add subtle ambient lighting
            var ambientLight = new THREE.AmbientLight(0x555555);
            scene.add(ambientLight);
     
            // add directional light source
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);

            scene.fog = new THREE.FogExp2( 0xFFFFFF, 0.0005 );

            
            // material
            /*var textureCanvas = THREE.ImageUtils.loadTexture(tex_stone, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);

            var material = new THREE.MeshBasicMaterial({
                map: textureCanvas
            });
            textureCanvas.needsUpdate = true;
            textureCanvas.repeat.set( 1000, 1000 );*/

            //GROUND
            var imageCanvas = document.createElement( "canvas" ),
                    context = imageCanvas.getContext( "2d" );

            imageCanvas.width = imageCanvas.height = 128;

            context.fillStyle = "#444";
            context.fillRect( 0, 0, 128, 128 );

            context.fillStyle = "#fff";
            context.fillRect( 0, 0, 64, 64);
            context.fillRect( 64, 64, 64, 64 );

            var textureCanvas = new THREE.Texture( imageCanvas, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping );
            materialCanvas = new THREE.MeshBasicMaterial( { map: textureCanvas } );

                textureCanvas.needsUpdate = true;
                textureCanvas.repeat.set( 1000, 1000 );

            floor = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100), materialCanvas );
            floor.scale.set(1000,1000,1000);
            scene.add( floor );


            //Player
            player = new Player(new THREE.Vector3(0,0,30));
            scene.add(player.mesh);

            updateCamera();
            spawnZombie(0);


            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setSize( window.innerWidth, window.innerHeight );

            projector = new THREE.Projector();

            document.body.appendChild( renderer.domElement );
            document.body.appendChild( stats.getDomElement() );

            window.addEventListener("keydown",onKeyDown);
            window.addEventListener("keyup",onKeyUp);
            window.addEventListener("mousemove",onMouseMove);
            window.addEventListener("mouseup", onMouseUp);

            animate();

        }

        var speed = 5;

        function movePlayer(){
            if(move){
                player.mesh.rotation.z = angle*(Math.PI/180);
                player.mesh.position.x +=Math.cos(player.mesh.rotation.z)*speed;
                player.mesh.position.y +=Math.sin(player.mesh.rotation.z)*speed;
                updateCamera();
            }
        }


        function spawnZombie(amount){
            for(var i = 0; i <= amount; i++){
                var zomb = new Zombie(new THREE.Vector3(Math.random()*600, Math.random()*600,25));
                zombies.push(zomb);
                scene.add(zomb.getMesh());
            }
        }

        function updateZombies(){
            for (var i = 0; i < zombies.length; i++) {
                if(zombies[i].isPassive){
                    scene.remove(zombies[i].mesh);
                    zombies.splice(i,1);
                    console.log("PASSIVE");
                    continue;
                }


                var offX = player.mesh.position.x - zombies[i].mesh.position.x;
                var offY = player.mesh.position.y - zombies[i].mesh.position.y;

                var zangle = Math.atan2(offY,offX);
                zombies[i].mesh.rotation.z = zangle;
                var step = new THREE.Vector3(Math.cos(zangle),Math.sin(zangle),0);
                zombies[i].mesh.position.addSelf(step);

                offX = player.mesh.position.x - zombies[i].mesh.position.x;
                offY = player.mesh.position.y - zombies[i].mesh.position.y;
                var pdist = Math.sqrt(offX*offX + offY*offY);
                zangle = Math.atan2(offY,offX);

                var pradii = zombies[i].radius+21;
                if(pdist != 0){
                    if(pdist < pradii){
                        var point = new THREE.Vector3(zoffX,zoffY,0);
                        zombies[i].mesh.position.x = player.mesh.position.x-(pradii * Math.cos(zangle));
                        zombies[i].mesh.position.y = player.mesh.position.y-(pradii * Math.sin(zangle));
                    }
                }

                zombies[i].hitTestBullets(bullets);

                for (var j = 0; j < zombies.length; j++) {

                    var zoffX = zombies[j].mesh.position.x - zombies[i].mesh.position.x;
                    var zoffY = zombies[j].mesh.position.y - zombies[i].mesh.position.y;

                    var dist = Math.sqrt(zoffX*zoffX + zoffY*zoffY);
                    var cangle = Math.atan2(zoffY, zoffX);
                    var radii = zombies[i].radius+zombies[j].radius;
                    if(dist != 0){
                        if(dist < radii){
                            var point = new THREE.Vector3(zoffX,zoffY,0);
                            zombies[j].mesh.position.x = zombies[i].mesh.position.x+(radii * Math.cos(cangle));
                            zombies[j].mesh.position.y = zombies[i].mesh.position.y+(radii * Math.sin(cangle));
                        }
                    }
                };

            };
        }


        function updateCamera(){
            camera.position.x = player.mesh.position.x;
            camera.position.y = player.mesh.position.y-camDist*Math.cos(camAngle*(Math.PI/180));
            camera.position.z = player.mesh.position.z+camDist*Math.sin(camAngle*(Math.PI/180));
            camera.lookAt(player.mesh.position);
        }




        function shoot(){
            var bullet = new Bullet(player);
            bullets.push(bullet);
            scene.add(bullet.mesh);
        }

        function updateBullets(){
            for (var i = 0; i < bullets.length; i++) {
                if(!bullets[i].isPassive)
                    bullets[i].update(1);
                else{
                    scene.remove(bullets[i].mesh);
                    bullets.splice(i,1);
                }
            };
        }



        var pressedW,pressedA,pressedS,pressedD,pressedUp,pressedLeft,pressedDown,pressedRight,move,spacePressed;
        var W = 87;
        var A = 65;
        var S = 83;
        var D = 68;

        var up = 38;
        var right = 37;
        var down = 40;
        var left = 39;

        var space = 32;

        function onKeyDown(evt){
            console.log(evt.keyCode);
            switch(evt.keyCode){
                case W:
                pressedW=true;
                break;

                case A:
                pressedA = true;
                camAngle++;
                break;

                case S:
                pressedS = true;
                camAngle--;
                break;

                case D:
                pressedD = true;
                break;

                case up:
                pressedUp=true;
                break;

                case right:
                pressedRight = true;
                break;

                case down:
                pressedDown = true;
                break;

                case left:
                pressedLeft = true;
                break;

                case space:
                spacePressed=true;
                break;
            }

            updateCamera();
        }

        function onKeyUp(evt){
           
           switch(evt.keyCode){
                case W:
                pressedW=false;
                break;

                case A:
                pressedA = false;
                break;

                case S:
                pressedS = false;
                break;

                case D:
                pressedD = false;
                break;

                 case up:
                pressedUp=false;
                break;

                case right:
                pressedRight = false;
                break;

                case down:
                pressedDown = false;
                break;

                case left:
                pressedLeft = false;
                break;

                case space:
                spacePressed = false;
                break;
            }
        }

        function onMouseMove(event){
             mouse3D = new THREE.Vector3(
                 ( event.clientX / window.innerWidth ) * 2 - 1,
                 - ( event.clientY / window.innerHeight ) * 2 + 1,
                 0.5 );
        }

        function onMouseUp(event){
            
        }

        function animate() {

            // note: three.js includes requestAnimationFrame shim
            requestAnimationFrame( animate );
            input();
            movePlayer();
            updateZombies();
            updateBullets();
            render();

            stats.update();

        }

        function render() {
            renderer.render( scene, camera );
        }

        var angle= 0;
        function input(){
            //Keyboard
            /*if(pressedW){
                player.mesh.position.y+=3;
                camera.position.y+=3;
            }
            if(pressedS){
                player.mesh.position.y-=3;
                camera.position.y-=3;
            }
            if(pressedA){
                player.mesh.position.x-=3;
                camera.position.x-=3;
            }
            if(pressedD){
                player.mesh.position.x+=3;
                camera.position.x+=3;
            }*/


            move = pressedUp || pressedLeft || pressedDown || pressedRight;
            if(pressedUp){
                angle = 90;

                if(pressedLeft) angle = 45;
                else if(pressedRight) angle = 135;
                               
            }else if(pressedDown){
                    angle = 270;

                    if(pressedLeft) angle = 315;
                    else if(pressedRight) angle = 225;
                            
                }else if(pressedLeft)
                        angle = 0;

                    else if(pressedRight)
                            angle = 180;

            if(spacePressed) shoot();
            
        }


function spawnForm(){
    var amount = document.getElementById("amount").value;
    spawnZombie(amount);
}