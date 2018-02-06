(function(){

    //file:///home/user/Documents/fibwebgl/index.html
    let w = 0;
    let h = 0;

    var cube = function( mat, i, n )
    {
        let size  = Math.min( w / n, 2 )
        let seed  = Math.random() * .3;
        this.rfnc = { 
            x: (x)=>{ return x + seed },
            y: (y)=>{ return Math.sin( y - seed); },
            z: (z)=>{ return Math.cos( z + seed); },
        }
        this.geom  = new THREE.BoxBufferGeometry( size * .5, size * .5, size * .5 );
        this.mesh  = new THREE.Mesh( this.geom, mat );
        this.vents = {};
        this.mesh.scale.multiply( new THREE.Vector3( .1, .1, .1 ) );

        this.mesh.position.x = (i - n * .5 ) * size;

        this.animfnc = this.scalefnc;
    }

    cube.prototype.update = function()
    {
        Object.keys( this.rfnc ).forEach( (k) => {
            this.mesh.rotation[k] = this.rfnc[k]( this.mesh.rotation[k] );
        });
        this.animfnc();
    };

    cube.prototype.scalefnc = function()
    {
        if( this.mesh.scale.x < 1 ){
            this.mesh.scale.add( new THREE.Vector3( .05, .05, .05 ) );
        }
        else{
            this.trigger( 'drop' );
            this.animfnc = this.dropfnc;
        }
    };

    cube.prototype.dropfnc = function()
    {
        if( this.mesh.position.y > -h ){
            this.mesh.position.y -= .2;
        }
        else {
            this.trigger( 'die' );
        }
    };

    cube.prototype.trigger = function(id)
    {
        var next = this.vents[id];
        while( next ){
            next.callback( this );
            next = next.next;
        }
    };

    cube.prototype.on = function(id, callback)
    {
        this.vents[id] = {
            callback: callback,
            next:     this.vents[id] || null
        };
    };


    var fib = function(){ };

    fib.prototype.init = function()
    {
        this.seq    = [0, 1];
        this.boxes  = [];
        this.scene  = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.camera.position.z = 15;
        
        h = 2 * Math.tan( .5 * this.camera.fov * Math.PI / 180 ) * 15;
        w = h * this.camera.aspect;
        this.camera.position.y = h * -.45;

        this.renderer = new THREE.WebGLRenderer({});
        this.renderer.setClearColor( '#fff' );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        let light = new THREE.AmbientLight( 0x404040, 5 );
        this.scene.add( light );

        let dirlight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirlight.position.set( 1, 1, 1 ).normalize();
        this.scene.add( dirlight );

        this.mat = new THREE.MeshStandardMaterial( { color: '#60cf40' } );

        this.increment();
        this.animate();
    };

    fib.prototype.increment = function()
    {
        let n = this.seq[0] + this.seq[1];
        let dropping = 0;
        // now create n elements!
        for( var i=0; i < n; i++ ){
            let c = new cube( this.mat, i, n );
            c.on( 'drop', (c) => {
                if( ++dropping == n ){
                    this.increment();
                }
            });
            c.on( 'die', (c) => {
                let i = this.boxes.indexOf( c );
                if( i > -1 ){
                    this.boxes.splice( i, 1 );
                }
            } );
            this.boxes.push( c );
            this.scene.add( c.mesh );
        }

        this.seq.unshift( n );
        if( this.seq.length > 14 ){
            this.seq = [0, 1];
        }
    };

    fib.prototype.animate = function()
    {
        this.renderer.render( this.scene, this.camera );
        this.boxes.forEach( (x) => { x.update(); } );
        if( this.boxes.length ){
            setTimeout( this.animate.bind( this ), 50);
        }
    };

    window.fib = new fib();
})();