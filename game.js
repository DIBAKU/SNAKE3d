var camera, scene, renderer, container,eingabe,canvasDown,currentCanvasRow,currentCanvasCol,ctx,c,difficulty,score,fruit,cHeight,beginningBlockNumber,gameLost,direction,doUpdatem, geometry, material, material2, materialsnake, materialsnakehead, geometrysnake, texturesnake, texturesnakehead, edges, edges2, edges3, edges4, mesh,meshes, geometry2, material2, mesh2, geometry3, material3, mesh3, geometry4, material4, mesh4, texture, helper, controls, OrbitControls, sun;

$(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
	
    meshes = [];
	doUpdate = true;
    direction = "u";
    gameLost = -1;
    beginningBlockNumber = 3;
    cHeight ;//offset 0.3? 0.5?
    fruit = [];
    score = 0;
    difficulty = "MEDIUM";
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    currentCanvasCol = 10;
    currentCanvasRow = 190;
    canvasDown = true;
    eingabe = true;


    container = document.getElementById("Spiel");
	
	alert("This page is in beta-testing and not related to other dibaku.de contents or services! Many functions are not implemented and not every bug is fixed yet.");

	
    init();
    animate();
	
});



    function init() {

        document.addEventListener("keydown", onDocumentKeyDown, false);

        camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 10 );
        camera.position.z = cHeight;
        camera.position.x = 0.5;
        camera.position.y = 1;
        camera.rotation.x = Math.PI/2 ;
        scene = new THREE.Scene();

        scene = new THREE.Scene();




        //Skybox
        // materialSB = new THREE.MeshNormalMaterial();
        texture = new THREE.TextureLoader().load( 'seamless space.PNG' );
        materialSB = new THREE.MeshBasicMaterial( { map: texture } );

        sky = new THREE.BoxGeometry( 0.1, 18 , 18);
        skybox = new THREE.Mesh( sky, materialSB );
        skybox.position.x = -6;
        skybox.position.z = 0.1;

        sky2 = new THREE.BoxGeometry( 0.1, 18, 18);
        skybox2= new THREE.Mesh( sky2, materialSB );
        skybox2.position.x = 6;
        skybox2.position.z = 0.1;

        sky3 = new THREE.BoxGeometry(18, 0.1, 18);
        skybox3 = new THREE.Mesh( sky3, materialSB );
        skybox3.position.y = -6;
        skybox3.position.z = 0.1;

        sky4 = new THREE.BoxGeometry(18, 0.1, 18);
        skybox4 = new THREE.Mesh( sky4, materialSB );
        skybox4.position.y = 6;
        skybox4.position.z = 0.1;

        sky5 = new THREE.BoxGeometry(18, 18, 0.1);
        skybox5= new THREE.Mesh( sky5, materialSB );
        skybox5.position.y = 0;
        skybox5.position.z = -6;

        // Sun
        var loader = new THREE.TextureLoader();
        loader.load( 'texture_sun_prev2.jpg',
                function ( texture ) {
                    var geometry = new THREE.SphereGeometry(3, 40, 40 );
                    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
                    sun = new THREE.Mesh( geometry, material );
                    sun.position.z = -4.5;
                    scene.add( sun );
                    sun.rotation.x += -0.00045;
                    sun.rotation.y += 0.0009;
                } );

        scene.add( skybox );
        scene.add( skybox2 );
        scene.add( skybox3 );
        scene.add( skybox4 );
        scene.add( skybox5 );

        texture = new THREE.TextureLoader().load( 'bricks2.jpg' );

//            geometry = new THREE.BoxGeometry( 2.5, 2.5);


        geometry = new THREE.BoxGeometry( 3.51, 0.1, 0.28);

//        material = new THREE.MeshNormalMaterial();
        material = new THREE.MeshBasicMaterial( { color: 0xff9000 } );
        material2 = new THREE.MeshBasicMaterial( { color: 0xff6100 } );
//            material = new THREE.MeshBasicMaterial({color : 0xcccccc, wireframe : true});
        mesh = new THREE.Mesh( geometry, material );
        mesh.position.y = 1.755;
        mesh.position.x = 0.05;

        geometry2 = new THREE.BoxGeometry( 3.51, 0.1, 0.28);
        mesh2 = new THREE.Mesh( geometry2, material);
        mesh2.position.y = -1.655;
        mesh2.position.x = 0.05;

        geometry3 = new THREE.BoxGeometry( 0.1, 3.51, 0.28);
        mesh3 = new THREE.Mesh( geometry3, material2 );
        mesh3.position.x = 1.755;
        mesh3.position.y = 0.05;

        geometry4 = new THREE.BoxGeometry( 0.1, 3.51, 0.28);
        mesh4 = new THREE.Mesh( geometry4, material2 );
        mesh4.position.x = -1.655;
        mesh4.position.y = 0.05;

        edges = new THREE.EdgesHelper( mesh, 0x000000);
        edges.material.linewidth = 1;
        edges.position.x = 0.05;
        edges.position.y = 1.755;

        edges2 = new THREE.EdgesHelper( mesh2, 0x000000);
        edges2.material.linewidth = 1;
        edges2.position.x = 0.05;
        edges2.position.y = -1.655;

        edges3 = new THREE.EdgesHelper( mesh3, 0x000000);
        edges3.material.linewidth = 1;
        edges3.position.x = 1.755;
        edges3.position.y = 0.05;

        edges4 = new THREE.EdgesHelper( mesh4, 0x000000);
        edges4.material.linewidth = 1;
        edges4.position.x = -1.655;
        edges4.position.y = 0.05;

        scene.add( mesh );
        scene.add( mesh2 );
        scene.add( mesh3 );
        scene.add( mesh4 );
        scene.add(edges);
        scene.add(edges2);
        scene.add(edges3);
        scene.add(edges4);

        geometrysnake = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
        texturesnake = new THREE.TextureLoader().load( 'schlange.jpg' );
        texturesnakehead = new THREE.TextureLoader().load( 'kopf.jpg' );
        materialsnake = new THREE.MeshBasicMaterial({ map: texturesnake});
        materialsnakehead = new THREE.MeshBasicMaterial({map: texturesnakehead});
//        materialsnakehead = new THREE.MeshBasicMaterial({ color: 0xff0000});

        for(var i = 0; i < beginningBlockNumber;i++){
            if (i == 0) { meshes[i] = new THREE.Mesh(geometrysnake, materialsnakehead);}
            else {meshes[i] = new THREE.Mesh( geometrysnake, materialsnake );}
            scene.add(meshes[i]);
            meshes[i].position.x = -i*0.11;

        }

        helper = new THREE.GridHelper( 3.31, 30, 0x444444, 0x888888);
        helper.position.x = 0.05;
        helper.position.y = 0.05;
        helper.position.z = -0.055;
        helper.material.opacity = 100;
        helper.material.transparent = true;
        helper.rotation.x = Math.PI/2;
        helper.rotation.y = 0;
        scene.add( helper );


        genFruits();


        renderer = new THREE.WebGLRenderer( { antialias: true } );
        let size = Math.min(container.offsetHeight, container.offsetWidth);
        renderer.setSize( size, size);
        container.appendChild( renderer.domElement );

        renderer.render( scene, camera );
        canvasInit();


    }

    function canvasInit(){

        c.width = innerWidth;
        c.height = innerHeight;

        ctx.fillStyle="#FF0000";
        ctx.fillRect(10,10,50,50);
        ctx.fillStyle="#00FF00";
        ctx.fillRect(10,70,50,50);
        ctx.fillRect(10,130,50,50);
    }
    function canvasRefresh(){
		if(meshes.length < 40){ 
			ctx.fillStyle="#00FF00";
			if(currentCanvasRow + 50 > c.height){
				currentCanvasRow -= 60;
				currentCanvasCol += 60;
				canvasDown = !canvasDown;
			}else if(currentCanvasRow < 10){
				//alert("ende");
				currentCanvasCol += 60;
				canvasDown = !canvasDown;
				currentCanvasRow += 60;
			}
			ctx.fillRect(currentCanvasCol,currentCanvasRow,50,50);
			if(canvasDown){currentCanvasRow += 60;
			}else{
				currentCanvasRow -= 60;
			}
		}
		

    }
		
	function enterFullscreen(element) {
	    if(element.requestFullscreen) {
		    element.requestFullscreen();
	    } else if(element.mozRequestFullScreen) {
		    element.mozRequestFullScreen();
	    } else if(element.msRequestFullscreen) {
		    element.msRequestFullscreen();
	    } else if(element.webkitRequestFullscreen) {
		    element.webkitRequestFullscreen();
	    }
	}
		
	function exitFullscreen() {
		if(document.exitFullscreen) {
			document.exitFullscreen();
		} else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if(document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}

		
	function goFullScreen(){
		enterFullscreen(document.getElementById("Spiel"));
		//alert(innerWidth + "  " + innerHeight);
		setTimeout(function(){
			document.getElementById("div_guiLeft").style.display = "block";
			document.getElementById("div_guiRigth").style.display = "block";
			camera.aspect = window.innerWidth / window.innerHeight;
    		camera.updateProjectionMatrix();
			renderer.setSize(innerWidth,innerHeight);
			//For touchScreens:
			window.onclick = function(e){
				
				
				if (eingabe === false) {
					if(e.screenX < innerWidth / 2){
						if (direction == "u") {
							direction = "l";
						} else if (direction == "d") {
							direction = "r";
						} else if (direction == "l") {
							direction = "d";
						} else if (direction == "r") {
							direction = "u";
						}
                		eingabe = true;
					}else{
						if (direction == "u") {
							direction = "r";
						} else if (direction == "d") {
							direction = "l";
						} else if (direction == "l") {
							direction = "u";
						} else if (direction == "r") {
							direction = "d";
						}
						eingabe = true;
					}
				}
			};
			
		},1000);
	}
		
	function leaveFullscreen(){
		exitFullscreen();
		//alert(innerWidth + "  " + innerHeight);
		setTimeout(function(){
			camera.aspect = 1;
    		camera.updateProjectionMatrix();
			let size = Math.min(container.offsetHeight, container.offsetWidth);
        	renderer.setSize( size, size);
		},1000);
	}	
		
	

    function startGameLoop(){

        direction = "u";

        if(difficulty == "EASY"){
            diff = 350;
        }else if(difficulty == "MEDIUM"){
            diff = 200;
        }else if(difficulty == "HARD"){
            diff = 90;
        }else{
            diff = 200;
        }


        setInterval(function() {
            doUpdate = true;
        }, diff);
		goFullScreen();
    }

    function setDifficulty(diff){
        difficulty = diff;
        var lbl_gui = document.getElementById("lbl_gui");
        lbl_gui.innerHTML = lbl_gui.innerHTML = "SCORE: " + score + "<br>DIFFICULTY: " + difficulty;

    }


    function genFruits(){
        for (var z = fruit.length; z < 5; z++) {
            geometryfruit = new THREE.SphereGeometry(0.05, 32, 32);
            materialfruit = new THREE.MeshBasicMaterial( {color: 0xff0000} );
            fruit[z] = new THREE.Mesh(geometryfruit, materialfruit);
            fruit[z].position.x = THREE.Math.randInt(1, 30) * 0.11 - 1.6505;
            fruit[z].position.y = THREE.Math.randInt(1, 30) * 0.11 - 1.6505;
            scene.add(fruit[z]);
        }
    }

    function takeBodyParts(){
        for(var i = meshes.length - 1; i > 0;i--){
            meshes[i].position.x = meshes[i-1].position.x;
            meshes[i].position.y = meshes[i-1].position.y;
        }
    }

    function right(){

        console.log("GO RIGHT");
        takeBodyParts();
        meshes[0].position.x += 0.11;
    }

    function left(){
        console.log("GO LEFT");

        takeBodyParts();

        meshes[0].position.x -= 0.11;
    }

    function up(){
        console.log("GO UP");

        takeBodyParts();

        meshes[0].position.y += 0.11;
    }

    function down(){
        console.log("GO DOWN");

        takeBodyParts();
        meshes[0].position.y -= 0.11;
    }

    function addOneBlock(){

        incrementScore();
        meshes[meshes.length] = new THREE.Mesh( geometrysnake, materialsnake );
        scene.add(meshes[meshes.length - 1]);
        meshes[meshes.length - 1].position.x = meshes[meshes.length - 2].position.x;
        meshes[meshes.length - 1].position.y = meshes[meshes.length - 2].position.y;

    }

    function incrementScore(){
        score+=100;
        canvasRefresh();
        var lbl_fsGUI = document.getElementById("lbl_fsGUI");
        lbl_fsGUI.innerHTML = "<b>SCORE:<br>" + score + "<br>LENGTH:<br>" + (score/100 + 3) + "</b>";
    }



    function cameraHeight() {
        var diffRate = 1;
        var limit = 1.2;
        if(difficulty == "EASY") {
            diffRate= 0.1;
        }else if(difficulty == "MEDIUM"){
            diffRate = 0.05;
        }else if(difficulty == "HARD") {
            limit = 0.2;
        }

        if (difficulty == "HARD") {
            cHeight = 0.2;
        }

        else if (meshes.length * diffRate < limit) {
            cHeight = meshes.length * diffRate;
            if (difficulty == "MEDIUM" && cHeight < 0.3) cHeight = 0.3;
        }

        return cHeight;
    }

    function cameraUpdate() {
        if (gameLost === -1) {

            camera.position.z = cameraHeight();

            if (direction == "r") {
                camera.position.x = meshes[0].position.x - cameraHeight();
                camera.position.y = meshes[0].position.y;
                camera.rotation.x = 0;
                camera.rotation.y = 315 * Math.PI / 180;
                camera.rotation.z = 270 * Math.PI / 180;


            } else if (direction == "l") {
                camera.position.x = meshes[0].position.x + cameraHeight();
                camera.position.y = meshes[0].position.y;
                camera.rotation.x = 0;
                camera.rotation.y = 45 * Math.PI / 180;
                camera.rotation.z = 90 * Math.PI / 180;

            } else if (direction == "u") {
                camera.position.x = meshes[0].position.x;
                camera.position.y = meshes[0].position.y - cameraHeight();
                camera.rotation.x = Math.PI / 4;
                camera.rotation.y = 0;
                camera.rotation.z = 0;

            } else if (direction == "d") {
                camera.position.x = meshes[0].position.x;
                camera.position.y = meshes[0].position.y + cameraHeight();
                camera.rotation.x = 315 * Math.PI / 180;
                camera.rotation.y = 0;
                camera.rotation.z = 180 * Math.PI / 180;

            }
        }
    }


    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        //alert(keyCode);
        if (eingabe === false) {
            if (keyCode == 37) { //LEFT

                if (direction == "u") {
                    direction = "l";
                } else if (direction == "d") {
                    direction = "r";
                } else if (direction == "l") {
                    direction = "d";
                } else if (direction == "r") {
                    direction = "u";
                }
                eingabe = true;

            } else if (keyCode == 39) { //RIGHT

                if (direction == "u") {
                    direction = "r";
                } else if (direction == "d") {
                    direction = "l";
                } else if (direction == "l") {
                    direction = "u";
                } else if (direction == "r") {
                    direction = "d";
                }
                eingabe = true;

            }
            else if (keyCode == 32) {

                startGameLoop();
            }
        }
    }

    function animate() {

        requestAnimationFrame( animate );

        sun.rotation.x += -0.00045;
        sun.rotation.y += 0.0009;


        if (doUpdate) {

            if (gameLost !== -1) {
                if (gameLost < meshes.length) {
                    if(gameLost == 0){
                        var lbl_lostScore = document.getElementById("lbl_lostScore");
                        lbl_lostScore.innerHTML = score;
						leaveFullscreen();
                        $('#modal3').modal('open');
                    }
                    scene.remove(meshes[gameLost]);
                    gameLost++;


                }else{


                }
            }

            else {

                for (var z1 = 0; z1 <= 4; z1++){
                    var firstBB = new THREE.Box3().setFromObject(meshes[0]);
                    var secondBB = new THREE.Box3().setFromObject(fruit[z1]);
//                    var collision = firstBB.isIntersectionBox(secondBB);
                    if (firstBB.isIntersectionBox(secondBB)){
                        addOneBlock();
                        scene.remove(fruit[z1]);
                        fruit.splice(z1, 1);
                        genFruits();
                    }
                }

                var headBB = new THREE.Box3().setFromObject(meshes[0]);
                var northBB = new THREE.Box3().setFromObject(mesh);
                var southBB = new THREE.Box3().setFromObject(mesh2);
                var eastBB = new THREE.Box3().setFromObject(mesh3);
                var westBB = new THREE.Box3().setFromObject(mesh4);


                if (headBB.isIntersectionBox(northBB) || headBB.isIntersectionBox(southBB) || headBB.isIntersectionBox(eastBB) || headBB.isIntersectionBox(westBB)){
                    gameLost = 0;
                }

                console.log(direction);

                if (direction == "r") {
                    right();
                } else if (direction == "l") {
                    left();
                } else if (direction == "u") {
                    up();
                } else if (direction == "d") {
                    down();
                }

                cameraUpdate();

                for (var i = 1; i < meshes.length; i++) {
                    if (meshes[i].position.x == meshes[0].position.x && meshes[i].position.y == meshes[0].position.y) {
                        gameLost = 0;
                        //refreshTime = 10;
                    }
                }

            }
            doUpdate = false;
            eingabe = false;
        }
        cameraUpdate();
        renderer.render( scene, camera );


    }