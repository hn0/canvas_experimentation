(function(){

    var fib = function()
    {
        this.boxes = 1;
    };

    fib.prototype.init = function()
    {
        this.scene  = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.camera.position.z = 4;

        this.renderer = new THREE.WebGLRenderer({});
        this.renderer.setClearColor( '#fff' );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        this.mat = new THREE.MeshBasicMaterial( { color: '#406030' } );

        this.render();
    };

    fib.prototype.render = function()
    {
        var box  = new THREE.BoxGeometry( 1, 1, 1 );
        var cube = new THREE.Mesh( box, this.mat );

        cube.rotation.x -= 0.1;
        cube.rotation.y += 0.1;

        this.scene.add( cube );
        this.renderer.render( this.scene, this.camera );
    };

    window.fib = new fib();
})();