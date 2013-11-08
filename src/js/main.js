// shim layer for requestAnimationFrame with setTimeout fallback
// author -- Paul Irish
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 50);
          };
})();


// all interface specific code wrapped into the INS(turuo) object
var INS = {

    /* generic animation function */
    animate: function(opts) {
        var start = new Date();
        var id = setInterval(function() {
            var timePassed = new Date() - start;
            var progress = timePassed / opts.duration;

            if (progress > 1) {
                progress = 1;
            }

            var delta = opts.delta(progress);

            opts.step(delta);

            if (progress === 1) {
                clearInterval(id);
                // run completion callback
                opts.fn();
            }

        }, opts.delay || 10);
    },

    /* list of updates */
    updates: 'no recent updates',

    /* background stars movement speed */
    warpSpeed: 2,

    /* creat the background */
    interGalacticSpace: function() {
        // define global variables
        var particles = [];
        var WIDTH = window.innerWidth;
            HEIGHT = window.innerHeight;

        // set some camera attributes
        var VIEW_ANGLE = 150,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 0.1,
            FAR = 4000,
            CAMERA_DISTANCE = 1000;

        // save particle speed
        var SPEED = INS.warpSpeed;

        // setup the camera, scene, etc.
        var init = function() {

            // creat the camera
            camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
            // move the camera backwards so we can see stuff!
            camera.position.z = CAMERA_DISTANCE;

            // creat the scene and add the camera to the scene
            scene = new THREE.Scene();
            scene.add(camera);

            // setup the renderer
            renderer = new THREE.CanvasRenderer();
            renderer.setSize(WIDTH, HEIGHT);

            // atach the renderer to the page
            $('#inter-galactic-space').append(renderer.domElement);

            // draw the particles
            draw();

            // render 40 times a second
            update();

            // update function

        };

        var update = function() {
            // update the scene in case of a viewport resize
            WIDTH = window.innerWidth;
            HEIGHT = window.innerHeight;
            renderer.setSize(WIDTH, HEIGHT);

            // update particle position
            updateParticles();

            // render the scene
            renderer.render(scene, camera);

            // update central display
            INS.drawCentralDisplayPanel();

            // wait for 1000/30 milisecond and repeat
            requestAnimFrame(update);
        };

        var draw = function() {

            var particle, material;

            // we're gonna move from z position -1000 (far away)
            // to 1000 (where the camera is) and add a random particle at every pos.
            for ( var zpos= -2000; zpos < 1000; zpos+=20 ) {

                // we make a particle material and pass through the
                // colour and custom particle render function we defined.
                material = new THREE.ParticleCanvasMaterial( { color: 0xA66EFF, program: particleRender } );
                // make the particle
                particle = new THREE.Particle(material);

                // give it a random x and y position between -4000 and 4000
                particle.position.x = ((Math.random() > 0.5)? -1 : 1) * (Math.random() * 5000 + 1000) ;
                particle.position.y = ((Math.random() > 0.5)? -1 : 1) * (Math.random() * 5000 + 1000);

                // set its z position
                particle.position.z = zpos;

                // scale it up a bit
                particle.scale.x = particle.scale.y = 10;

                // add it to the scene
                scene.add( particle );

                // and to the array of particles.
                particles.push(particle);
            }
        };

        var particleRender = function( ctx ) {
            // there isn't a built in circle particle renderer
            // so we have to define our own.
            // we get passed a reference to the canvas context
            ctx.beginPath();
            // and we just have to draw our shape at 0,0 - in this
            // case an arc from 0 to 2Pi radians or 360º - a full circle!
            ctx.arc( 0, 0, 2.5, 0, Math.PI * 2, true );

            // set style for shadow
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fill();
        };

        var updateParticles = function() {
            // get speed
            SPEED = INS.warpSpeed;

            // iterate through every particle
            for(var i=0; i<particles.length; i++) {

                particle = particles[i];

                // and move it forward dependent on the mouseY position.
                particle.position.z += SPEED ;

                // if the particle is too close move it to the back
                    if(particle.position.z>1000) {
                        particle.position.z-=3000;
                    }
            }
        };

        // resize background on window resize
        window.onresize = function(event) {
            WIDTH = window.innerWidth;
            HEIGHT  = window.innerHeight;
            renderer.setSize(WIDTH, HEIGHT);

            INS.log('window resized');
            };

        // initiale the galaxy
        init();
    },

    /* change warp speed for a moment to give the feel of a space warp */
    warp: function () {


        $("#central-display-panel div").fadeOut(300, function() {
            INS.animate({
                delay: 0,
                duration: 1000,
                delta: function(p){
                    if (p < 0.7) {
                        return p + 0.4;
                    }
                    else {
                        return (1-p);
                    }

                    return p;
                },
                step: function(delta){
                    INS.warpSpeed  = 300*delta + 2;
                },
                fn: function() {
                    $("#central-display-panel div").fadeIn();
                }
            });
        });
    },

    /* draw the central-display-panel background */
    drawCentralDisplayPanel: function(){
        // get the canvas element
        var container = $("#central-display-panel");
        var canvas = document.getElementById('central-display-panel-background');
        canvas.width = container.width();
        canvas.height = container.height();
        if (canvas.getContext){
            var ctx = canvas.getContext('2d');

            // draw the background
            ctx.beginPath();
            ctx.moveTo(10,10);
            ctx.lineTo((canvas.width - 10),10);
            ctx.lineTo((canvas.width - 10),canvas.height*0.8);
            ctx.lineTo(canvas.width*0.9,canvas.height -10);
            ctx.lineTo(10,canvas.height -10);
            ctx.closePath();
            ctx.fillStyle = "rgba(90, 196, 255, 0.04)";
            ctx.strokeStyle = "rgba(160, 221, 255, 1)";
            ctx.lineWidth  = 2;
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.stroke();
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fill();

            // rotating circle
            var time = new Date();
            ctx.translate(100, 100);
            ctx.rotate( ((2*Math.PI)/10)*time.getSeconds() + ((2*Math.PI)/10000)*time.getMilliseconds() + INS.warpSpeed*0.5);
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.strokeStyle = "rgba(160, 221, 255, 0.8)";
            ctx.lineWidth  = 10;

            ctx.beginPath();
            ctx.arc(0, 0, 50, 1.1* Math.PI, Math.PI*1.5, false);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, 50, 1.6 * Math.PI, Math.PI*1.95, false);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, 50, 0.05* Math.PI, Math.PI*0.4, false);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, 50, 0.5* Math.PI, Math.PI, false);
            ctx.stroke();
        }
    },

    /* log alias */
    log: function(msg) {
        console.log('instruo: ' + msg);
    }
};

$(document).ready( function(){
        INS.interGalacticSpace();
        $("#main-dial").click(INS.warp);
        INS.drawCentralDisplayPanel();
        $('#main-dial').css({width: "0px", height: "0px", top: "75px", left: "82px"})
                        .show()
                        .delay('300')
                        .animate({width: "200px", height: "200px", top: "-50px", left: "-35px"}, 'normal');
});

