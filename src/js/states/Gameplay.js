"use strict";
let PIXI = require("../libs/pixi.min");
let TweenLite = require("gsap/src/uncompressed/TweenLite");
let TimelineMax = require("gsap/src/uncompressed/TimelineMax");
let easing = require("gsap/src/uncompressed/easing/EasePack");
let balance = require("../balance.json");
let audioManager = require("../audioManager");

const GAMEPLAY_SPRITES = [
	{
	    name: "gameplay_background",
	    position: {
	        x: 728,
	        y: 409.5
	    }
	}, 
	{
	    name: "stone_base",
	    position: {
	        x: 728,
	        y: 402
	    }
	}, 
];


class Menu {
    constructor(game) {
        this.game = game;
        this.sprites = {};
        this.texts = {};
        GAMEPLAY_SPRITES.forEach((object) => {
        	let imageName = object.name;
            this.sprites[imageName] = new PIXI.Sprite.fromImage(`resources/assets/images/${imageName}.png`);
            this.sprites[imageName].position = new PIXI.Point(object.position.x, object.position.y);
            this.sprites[imageName].anchor = new PIXI.Point(0.5, 0.5);
        });

    }

    draw() {
    	audioManager.playMusic("resources/assets/audio/game.mp3");
        this.stateContainer = new PIXI.Container();
        this.game.stage.addChild(this.stateContainer);
        GAMEPLAY_SPRITES.forEach((object) =>{
        	 this.stateContainer.addChild(this.sprites[object.name]); 
        });

        this.animate();
        this.listenToInteractivity();
    }

    animate(){
    	TweenLite.from(this.sprites.gameplay_background, 1, {alpha: 0});
    	TweenLite.from(this.sprites.stone_base.position, 3, {y: "-=" + this.game.height*2, "ease": "Bounce.easeInOut", delay: 2, onStart:()=>{
    		setTimeout(()=>{
    			audioManager.playSound("resources/assets/audio/fall.wav");
    		}, 1500);
    		setTimeout(()=>{
    			audioManager.playSound("resources/assets/audio/impact.wav");
    		}, 2000);
    		setTimeout(()=>{
    			audioManager.playSound("resources/assets/audio/impact.wav");
    		}, 2600);
    		setTimeout(()=>{
    			audioManager.playSound("resources/assets/audio/impact.wav");
    		}, 2900);
    	}});
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
