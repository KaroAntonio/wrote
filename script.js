var table = [],
	words;

$.getJSON( "assets/words.json", function( data ) {
	words = data;
	titles = Object.keys(words);

	//Init Words
	for (var i = 0; i < 500; i++) {
		table.push([genWord(),"","",0,i]);
	}
	console.log(table);
	init();
	animate();
 });

var camera, scene, renderer;
var geometry, material, mesh;
var groups = [];

var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };


function init() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 2500;

	scene = new THREE.Scene();

	// Init Objects Randomly
	for ( var i = 0; i < table.length; i ++ ) {

		var item = table[ i ];

		var element = document.createElement( 'div' );
		element.className = 'element';

		var symbol = document.createElement( 'div' );
		symbol.className = 'symbol';
		symbol.textContent = item[ 0 ];
		element.appendChild( symbol );

		var object = new THREE.CSS3DObject( element );
		object.position.x = Math.random() * 4000 - 2000;
		object.position.y = Math.random() * 4000 - 2000;
		object.position.z = Math.random() * 4000 - 2000;

		scene.add( object );

		objects.push( object );

	}

	// table

	var vector = new THREE.Vector3();
	for ( var i = 0; i < objects.length; i ++ ) {

		var item = table[ i ];


		var phi = Math.acos( -1 + ( 2 * i ) / l );
		var theta = Math.sqrt( l * Math.PI ) * phi;

		var object = new THREE.Object3D();
		object.position.x = ( item[ 3 ] * 160 ) - 400;
		object.position.y = - ( item[ 4 ] * 100 ) + 2000;
		object.position.z = 0;
		object.rotation.z = i/200 * Math.PI;

		targets.table.push( object );

	}

	// sphere
	var vector = new THREE.Vector3();

	for (var i = 0; i < 3; i++ ) {
		var group = new THREE.Object3D();//create an empty container
		groups.push(group);
		scene.add(group);
	}

	for ( var i = 0, l = objects.length; i < l; i ++ ) {

		var phi = Math.acos( -1 + ( 2 * i ) / l );
		var theta = Math.sqrt( l * Math.PI ) * phi;

		var object = new THREE.Object3D();
		var object = objects[i];
		groups[i%groups.length].add( object );

		object.position.x = 1000 * Math.cos( theta ) * Math.sin( phi );
		object.position.y = 1000 * Math.sin( theta ) * Math.sin( phi );
		object.position.z = 1000 * Math.cos( phi );

		vector.copy( object.position ).multiplyScalar( 2 );

		object.lookAt( vector );

		targets.sphere.push( object );

	}
	
	// helix

	var vector = new THREE.Vector3();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {


		var phi = i * 0.175 + Math.PI;

		var object = new THREE.Object3D();

		object.position.x = 1100 * Math.sin( phi );
		object.position.y = - ( i * 8 ) + 450;
		object.position.z = 1100 * Math.cos( phi );

		vector.copy( object.position );
		vector.x *= 2;
		vector.z *= 2;

		object.lookAt( vector );

		targets.helix.push( object );

	}

	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = 0;
	document.getElementById( 'container' ).appendChild( renderer.domElement );

	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.5;
	controls.addEventListener( 'change', render );
	window.addEventListener( 'resize', onWindowResize, false );

}

function transform( targets, duration ) {

	TWEEN.removeAll();

	for ( var i = 0; i < objects.length; i ++ ) {

		var object = objects[ i ];
		var target = targets[ i ];

		new TWEEN.Tween( object.position )
			.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

		new TWEEN.Tween( object.rotation )
			.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

	}

	new TWEEN.Tween( this )
		.to( {}, duration * 2 )
	//	.onUpdate( render )
		.start();

	}

function genWord() {
	var w = words[titles[0]],
		i1 = Math.floor(Math.random() * w.length);
	return w[i1];
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

	groups[0].rotation.x += 0.005;
	groups[1].rotation.y += 0.005;
	groups[2].rotation.z += 0.005;

	TWEEN.update();
	controls.update();
	render();

}

function render() {

	renderer.render( scene, camera );

}

