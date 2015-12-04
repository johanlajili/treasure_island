"use strict";
let PIXI = require("../libs/pixi.min");
let TweenLite = require("gsap/src/uncompressed/TweenLite");
let TimelineMax = require("gsap/src/uncompressed/TimelineMax");
let easing = require("gsap/src/uncompressed/easing/EasePack");
let balance = require("../balance.json");
let audioManager = require("../audioManager");

class Menu {
    constructor(game) {
        this.game = game;
        this.sprites = {};
        this.texts = {};

    }

    draw() {
    	audioManager.playMusic("resources/assets/audio/game.mp3");
        this.stateContainer = new PIXI.Container();
        this.game.stage.addChild(this.stateContainer);
        this.animate();
        this.listenToInteractivity();
    }

    animate(){
    	
    }

    listenToInteractivity(){
   

    }
    
    clean(){
    	return new Promise((resolve, reject)=>{
	    	TweenLite.to(this.stateContainer.position, 4, {y: this.game.height, delay: 0.5, ease: Power4.easeOut, onComplete: ()=>{
	    		this.game.stage.removeChild(this.stateContainer);
	    		resolve();
	    	}});
    	});
    }
}

module.exports = Menu;
