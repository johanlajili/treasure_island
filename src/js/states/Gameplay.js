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
	{
	    name: "start",
	    position: {
	        x: 741,
	        y: 368
	    }
	},
];

const GRID_INFORMATIONS = {
	width: 8,
	height: 8,
	cellWidth: 76,
	cellHeight: 63,
	origin : {
		x: 423,
		y: 92
	}
};

const SPECIAL_DIRT_SKINS = {
	"2" : 1,
	"1" : 2 
};




class Gameplay {
    constructor(game) {
        this.game = game;
        this.lottery = this.getLottery();
        this.digIndex = 0;
        console.log(this.lottery);
        this.sprites = {};
        this.texts = {};
        this.blocks = [];
        GAMEPLAY_SPRITES.forEach((object) => {
        	let imageName = object.name;
            this.sprites[imageName] = new PIXI.Sprite.fromImage(`resources/assets/images/${imageName}.png`);
            this.sprites[imageName].position = new PIXI.Point(object.position.x, object.position.y);
            this.sprites[imageName].anchor = new PIXI.Point(0.5, 0.5);
        });
        for (let row=0; row<GRID_INFORMATIONS.height; row++){
        	for (let column=0; column<GRID_INFORMATIONS.width; column++){
				let sprite = new PIXI.Sprite.fromImage('resources/assets/images/Dirt_Block.png');
				sprite.position = new PIXI.Point(GRID_INFORMATIONS.origin.x + column*GRID_INFORMATIONS.cellWidth, GRID_INFORMATIONS.origin.y + row*GRID_INFORMATIONS.cellHeight);
        		sprite.life = 3; //custom property;

        		this.blocks.push(sprite);
        	}
        }

    }

    draw() {
        this.stateContainer = new PIXI.Container();
        this.game.stage.addChild(this.stateContainer);
       	this.stateContainer.addChild(this.sprites.gameplay_background);
       	this.stateContainer.addChild(this.sprites.stone_base);
        this.blocks.forEach((sprite) =>{
        	this.stateContainer.addChild(sprite);
        });
        this.stateContainer.addChild(this.sprites.start);
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
    	var blockFall = new TimelineMax();
    	blockFall.staggerFrom(this.blocks.map((sprite)=>sprite.position), 1.8, {y: "-=" + this.game.height, ease: "Power4.easeIn", delay: 5, onStart:()=>{
    		setTimeout(()=>{audioManager.playSound("resources/assets/audio/dirt.wav");}, 1600);
    	}}, 0.05);
    	TweenLite.from(this.sprites.start, 2, {x: "+=" + this.game.width, delay: 8, ease: "Power4.easeIn", onComplete: ()=>{
    		audioManager.playMusic("resources/assets/audio/game.mp3");
    	}});
    	TweenLite.to(this.sprites.start, 2, {x: "-=" + this.game.width, delay: 12, ease: "Power4.easeOut"});
    }

    listenToInteractivity(){
   		this.blocks.forEach((sprite)=>{
   			sprite.interactive = true;
   			sprite.click = sprite.tap = (event)=>{
   				sprite.life--;
				if (sprite.life in SPECIAL_DIRT_SKINS){
					audioManager.playSound("resources/assets/audio/dig.wav");
					sprite.texture = new PIXI.Texture.fromImage(`resources/assets/images/Dirt_Block_${SPECIAL_DIRT_SKINS[sprite.life]}.png`);
				} else if (sprite.life === 0){
					audioManager.playSound("resources/assets/audio/dig.wav");
					this.createParticleOnSprite(sprite, true);

					this.stateContainer.removeChild(sprite);
                    let itemFound = this.lottery[this.digIndex];

                    if (itemFound){
                        let item = new PIXI.Sprite.fromImage(`resources/assets/images/${itemFound}.png`);
                        this.stateContainer.addChild(item);
                        item.anchor = new PIXI.Point(0.5, 0.5);
                        item.position = new PIXI.Point(sprite.position.x + GRID_INFORMATIONS.cellWidth/2, sprite.position.y + GRID_INFORMATIONS.cellHeight/2);    
                    }
                    this.digIndex++;


				}
				this.createParticleOnSprite(sprite);
   			};
   		});

    }
    createParticleOnSprite(sprite, zoneParticle=false){
    	let numberOfParticle = zoneParticle ? 100 : 20;
    	for (let i=0; i<numberOfParticle; i++){
			let particle = new PIXI.Sprite.fromImage("resources/assets/images/particle.png");
			let particleOffset = {x: 0, y: 0};
			if (zoneParticle){
				particleOffset.x += ~~(Math.random()*GRID_INFORMATIONS.cellWidth) - GRID_INFORMATIONS.cellWidth/2;
				particleOffset.y += ~~(Math.random()*GRID_INFORMATIONS.cellHeight) - GRID_INFORMATIONS.cellHeight/2;
			}

			this.stateContainer.addChild(particle);
			particle.anchor = new PIXI.Point(0.5, 0.5);
			
			particle.position = new PIXI.Point(sprite.position.x + GRID_INFORMATIONS.cellWidth/2 + particleOffset.x, sprite.position.y + GRID_INFORMATIONS.cellHeight/2 + particleOffset.y);
			TweenLite.to(particle, 1, {
				alpha: 0,
				onComplete: ()=>{
					this.stateContainer.removeChild(particle);
				}
			});
			TweenLite.to(particle.position, 1, {
				x: "+=" + (Math.random()*100 - 50),
				y: "+=" + (Math.random()*100 - 50)
			});
		}
    }
    getLottery(){
        let totalShots = [];
        let totalIndexesAvailable = [];
        for (let i=0; i<GRID_INFORMATIONS.width * GRID_INFORMATIONS.height; i++){
            totalIndexesAvailable.push(i);
        }
        function placeItem(itemName){
            for (let i=0; i<balance.items[itemName]; i++){
            let tempIndex = ~~(Math.random()*totalIndexesAvailable.length);
            let realIndex = totalIndexesAvailable.splice(tempIndex, 1)[0];
            totalShots[realIndex] = itemName;
            }
        }
        
        placeItem("jewel");
        placeItem("star");
        placeItem("skull");

        return totalShots;
        
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

module.exports = Gameplay;
