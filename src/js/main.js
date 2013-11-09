// shim layer for requestAnimationFrame with setTimeout fallback
// author -- Paul Irish
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 45);
          };
})();


// all interface specific code wrapped into the INS(turuo) object
var INS = {
    /* array of bengali characters */
    bengaliChars: ["অ","আ","ই","ঈ","উ","ঊ","ঋ","ঌ","এ","ঐ","ও","ঔ","ক","খ","গ","ঘ","ঙ","চ","ছ","জ","ঝ","ঞ","ট","ঠ","ড","ঢ","ণ","ত","থ","দ","ধ","ন","প","ফ","ব","ভ","ম","য","র","ল","শ","ষ","স","হ","ঽ","ড়","ঢ়","য়","ৠ","ৡ","ৱ","৳"],

    /* list of updates */
    updates: 'no recent updates',

    /* background stars movement speed */
    warpSpeed: 2,

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
            // update interface
            INS.drawInterface();
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
    drawInterface: function(){
        // get the canvas element
        var canvas = document.getElementById('interface');
        var width = canvas.width = window.innerWidth;
        var height = canvas.height = window.innerHeight;
        if (canvas.getContext){
            var ctx = canvas.getContext('2d');

            // top scale
            ctx.strokeStyle = "rgba(225, 225, 255, 0.5)";
            ctx.lineWidth  = 0.5;
            ctx.shadowColor = "rgb(160, 221, 255)";
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            for (var i= width*0.18; i<width; i+=30){
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height*0.03);
                ctx.closePath();
                ctx.stroke();
            }

            ctx.strokeStyle = "rgba(225, 225, 255, 0.3)";
            for (i = (width*0.18 + 15); i<width; i+=30){
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height*0.02);
                ctx.closePath();
                ctx.stroke();
            }

            // set the style
            ctx.fillStyle = "rgba(90, 196, 255, 0.04)";
            ctx.strokeStyle = "rgba(160, 221, 255, 1)";
            ctx.lineWidth  = 1;
            ctx.shadowColor = "rgb(160, 221, 255)";
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // draw the central panel
            ctx.beginPath();
            ctx.moveTo(width*0.2, height*0.15);
            ctx.lineTo(width*0.8,height*0.15);
            ctx.lineTo(width*0.8,height*0.75);
            ctx.lineTo(width*0.7,height*0.9);
            ctx.lineTo(width*0.2,height*0.9);
            ctx.closePath();

            ctx.shadowBlur = 5;
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.fill();

            // draw the updates panel
            ctx.beginPath();
            ctx.moveTo(width*0.82, height*0.08);
            ctx.lineTo(width*0.99,height*0.08);
            ctx.lineTo(width*0.99,height*0.70);
            ctx.lineTo(width*0.82,height*0.70);
            ctx.closePath();

            ctx.shadowBlur = 2;
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.fill();

            // draw the title panel
            ctx.beginPath();
            ctx.moveTo(width*0.2, height*0.05);
            ctx.lineTo(width*0.6,height*0.05);
            ctx.lineTo(width*0.6,height*0.135);
            ctx.lineTo(width*0.2,height*0.135);
            ctx.closePath();

            ctx.shadowBlur = 5;
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.fill();

            // draw the side control panel
            ctx.beginPath();
            ctx.moveTo(width*-0.01, height*-0.01);
            ctx.lineTo(width*0.15,height*-0.01);
            ctx.lineTo(width*0.18,height*0.11);
            ctx.lineTo(width*0.18,height*0.9);
            ctx.lineTo(width*0.15,height);
            ctx.lineTo(width*0,height);
            ctx.lineTo(width*0.01,height*0.9);
            ctx.lineTo(width*0.01,height*0.1);

            ctx.closePath();

            ctx.shadowBlur = 5;
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.fill();

            // rotating circle
            //var time = new Date();
            ctx.translate(width*0.95, height*0.95);
            //ctx.rotate( ((2*Math.PI)/30)*time.getSeconds() + ((2*Math.PI)/30000)*time.getMilliseconds() + INS.warpSpeed*0.02);
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.strokeStyle = "rgba(160, 221, 255, 0.8)";
            ctx.lineWidth  = 10;

            ctx.beginPath();
            ctx.arc(0, 0, 110, 1.1* Math.PI, Math.PI*1.3, false);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, 110, 1.4 * Math.PI, Math.PI*1.6, false);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, 110, 1.7* Math.PI, Math.PI*1.9, false);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, 110, 0.8* Math.PI, Math.PI*1, false);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, 110, 0.5* Math.PI, Math.PI*0.7, false);
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
        INS.drawInterface();
        $('#main-dial').css({width: "0px", height: "0px", top: "75px", left: "82px"})
                        .show()
                        .delay('300')
                        .animate({width: "200px", height: "200px", top: "-50px", left: "-35px"}, 'normal');
});

