(function(){


    var cube = function( mat )
    {
        this.rfnc  = { 
            x: (x)=>{ return x+.1 },
            y: (y)=>{ return Math.sin( y - .1); },
            z: (z)=>{ return Math.cos( z + .1); },
        }
        this.geom  = new THREE.BoxGeometry( 1, 1, 1 );
        this.mesh  = new THREE.Mesh( this.geom, mat );
        this.vents = {};
        this.mesh.scale.multiply( new THREE.Vector3( .1, .1, .1 ) );
        console.log( this.mesh.rotation )
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
        this.boxes  = [];
        this.scene  = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.camera.position.z = 15;

        this.renderer = new THREE.WebGLRenderer({});
        this.renderer.setClearColor( '#fff' );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        
        this.mat = new THREE.MeshBasicMaterial( { color: '#406030' } );

        var c = new cube( this.mat );
        c.on( 'die', (c) => {
            let i = this.boxes.indexOf( c );
            if( i > -1 ){
                this.boxes.splice( i, 1 );
            }
        } );
        this.boxes.push( c );
        this.scene.add( c.mesh );
        this.animate();
    };

    fib.prototype.animate = function()
    {

        // this.camera.position.z -= .5;
        this.renderer.render( this.scene, this.camera );
        this.boxes.forEach( (x) => { x.update(); } );
        console.log( 'here!' )

        if( this.boxes.length ){
            setTimeout( this.animate.bind( this ), 50);
        }
    };

    window.fib = new fib();
})();