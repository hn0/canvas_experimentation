(function(){


    var cube = function( mat, pos )
    {
        let seed = Math.random() * .3;
        this.rfnc  = { 
            x: (x)=>{ return x + seed },
            y: (y)=>{ return Math.sin( y - seed); },
            z: (z)=>{ return Math.cos( z + seed); },
        }
        this.geom  = new THREE.BoxBufferGeometry( 1, 1, 1 );
        this.mesh  = new THREE.Mesh( this.geom, mat );
        this.vents = {};
        this.mesh.scale.multiply( new THREE.Vector3( .1, .1, .1 ) );

        // how it will look with many of them?
        this.mesh.position.x = (pos == 1) ? -1 : 1;
    }

    cube.prototype.update = function()
    {
        if( this.mesh.scale.x < 1 ){
            this.mesh.scale.add( new THREE.Vector3( .05, .05, .05 ) );
            Object.keys( this.rfnc ).forEach( (k) => {
                this.mesh.rotation[k] = this.rfnc[k]( this.mesh.rotation[k] );
            });
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
        this.seq    = [1, 1];
        this.boxes  = [];
        this.scene  = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.camera.position.z = 15;

        this.renderer = new THREE.WebGLRenderer({});
        this.renderer.setClearColor( '#fff' );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        
        this.mat = new THREE.MeshLambertMaterial( { color: '#406030' } );

        this.increment();
        this.animate();
    };

    fib.prototype.increment = function()
    {
        let n = this.seq[0] + this.seq[1];

        // now create n elements!
        for( var i=0; i < n; i++ ){
            let c = new cube( this.mat, (i+1) / n );
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
        if( this.seq.length > 5 ){
            this.seq = [1, 1];
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