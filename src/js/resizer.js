"use strict";

const CANVAS_RATIO = 16/9;
class Resizer{
	constructor(){
		this.createOptimisedResizeListener();
		window.addEventListener("optimizedResize", () =>{
		    this.resize();
		});
		this.resize();
	}
	resize(){
		let gameFrame = document.querySelector(".game-frame");
		let canvas = document.querySelector("canvas");
		let bigger = gameFrame.offsetWidth / gameFrame.offsetHeight > CANVAS_RATIO;
		if (!bigger){
			canvas.style.width = gameFrame.offsetWidth;
			canvas.style.height = canvas.offsetWidth * (1/CANVAS_RATIO);
		} else {
			canvas.style.height = gameFrame.offsetHeight;
			canvas.style.width = canvas.offsetHeight * (CANVAS_RATIO);
		}
	}
	createOptimisedResizeListener(){
		//from https://developer.mozilla.org/en-US/docs/Web/Events/resize
		(function() {
		    var throttle = function(type, name, obj) {
		        obj = obj || window;
		        var running = false;
		        var func = function() {
		            if (running) { return; }
		            running = true;
		            requestAnimationFrame(function() {
		                obj.dispatchEvent(new CustomEvent(name));
		                running = false;
		            });
		        };
		        obj.addEventListener(type, func);
		    };

		    /* init - you can init any event */
		    throttle("resize", "optimizedResize");
		})();
	}
}

module.export = new Resizer();