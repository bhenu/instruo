instruo 2014
============

This document explains briefly how the website features work and documents
the necessary functions and methods.

main structure
--------------
The site is mainly written in javascript, the graphical elements being drawn
on canvas elements.

The background is a canvas with a width and height equal to the
window.innerWidth and window.innerHeight property. These parameters are
adjusted on each redraw. The stars are done with three.js

The interface is another canvas with same characteristics.

javascript code docs
--------------------

All the required functionality is implemented with the help of methods of a
global object named **INS**. The included methods and properties are:

####.warpSpeed = 1;
defines the warp speed.

####.updates = 'some imp text to show';*
holds some text to show somewhere on the site

####.log('log output');
prints the log output to the console log.

####.warp();
increases INS.waprspeed to 100 and back

####.animate({object});
generic animation function. used by .wrap()

```js
object {
    delay: 0,  // start animation after delay

    duration: 1000,     // animation duration

    delta: function(p){ return p;}, // the delta function maps time progress
                                    // to effect progress

    step: function(d){ $('element').width = d;},    // step function maps effect
                                                    // progress to actual attribute
                                                    // parameter change

    fn:  function(){INS.log('animation done');}     // callback function
}
```

####.interGalacticSpace();
actually draws the background and animates it


####.drawInterface();
draw the interface elements on a canvas
