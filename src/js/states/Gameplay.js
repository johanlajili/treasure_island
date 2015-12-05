"use strict";
let PIXI = require("../libs/pixi.min");
let TweenLite = require("gsap/src/uncompressed/TweenLite");
let TimelineMax = require("gsap/src/uncompressed/TimelineMax");
let easing = require("gsap/src/uncompressed/easing/EasePack");
let balance = require("../balance.json");
let audioManager = require("../audioManager");

const GAMEPLAY_SPRITES = [
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
    {
        name: "stop",
        position: {
            x: 1260,
            y: 745
        }
    }
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

const GAMEPLAY_TEXTS = [
    {
        name: "earnedMoney",
        position: {
            x:100,
            y:100
        },
        font:  "80px Impact",
        color: "white",
        strokeColor: "black",
        strokeThickness: 4,
        align: "center"
    }
];


class Gameplay {
    constructor(game) {
        this.interactive = false;
        this.game = game;
        this.digIndex = 0;
        this.earnedMoneyValue = 0;
        this.lottery = this.getLottery();
        console.log(this.lottery);
        this.sprites = {};
        this.texts = {};
        this.blocks = [];
        this.textures = {};
        GAMEPLAY_SPRITES.forEach((object) => {
            let imageName = object.name;
            this.sprites[imageName] = new PIXI.Sprite.fromImage(`resources/assets/images/${imageName}.png`);
            this.sprites[imageName].position = new PIXI.Point(object.position.x, object.position.y);
            this.sprites[imageName].anchor = new PIXI.Point(0.5, 0.5);
        });
        this.textures["Dirt_Block_1"] = new PIXI.Texture.fromImage(`resources/assets/images/Dirt_Block_1.png`);
        this.textures["Dirt_Block_2"] = new PIXI.Texture.fromImage(`resources/assets/images/Dirt_Block_2.png`);
        for (let row=0; row<GRID_INFORMATIONS.height; row++){
        	for (let column=0; column<GRID_INFORMATIONS.width; column++){
				let sprite = new PIXI.Sprite.fromImage('resources/assets/images/Dirt_Block.png');
				sprite.position = new PIXI.Point(GRID_INFORMATIONS.origin.x + column*GRID_INFORMATIONS.cellWidth, GRID_INFORMATIONS.origin.y + row*GRID_INFORMATIONS.cellHeight);
        		sprite.life = 3; //custom property;

        		this.blocks.push(sprite);
        	}
        }

        GAMEPLAY_TEXTS.forEach((object) => {
            let textName = object.name;
            this.texts[textName] = new PIXI.Text("", {font: object.font, fill: object.color, stroke: object.strokeColor, strokeThickness: object.strokeThickness, align: object.align});
            this.texts[textName].position = new PIXI.Point(object.position.x, object.position.y);
            this.texts[textName].anchor = new PIXI.Point(0.5, 0.5);
        });

    }

    draw(args) {
        console.log("draw")
        this.ticketValue = args.ticketValue;
        this.stateContainer = new PIXI.Container();
        this.game.stage.addChild(this.stateContainer);
       	this.stateContainer.addChild(this.sprites.stone_base);
        this.blocks.forEach((sprite) =>{
        	this.stateContainer.addChild(sprite);
        });
        this.stateContainer.addChild(this.sprites.start);
        this.stateContainer.addChild(this.sprites.stop);
        window.stop = this.sprites.stop;
        GAMEPLAY_TEXTS.forEach((object) =>{
             this.stateContainer.addChild(this.texts[object.name]); 
        });
        this.animate();
        this.listenToInteractivity();
    }

    animate(){
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
        TweenLite.from(this.sprites.stop, 1, {x: this.game.width + 200, delay: 11});
    	TweenLite.from(this.sprites.start, 2, {x: "+=" + this.game.width, delay: 8, ease: "Power4.easeIn"});
        TweenLite.to(this.sprites.start, 2, {x: "-=" + this.game.width, delay: 11, ease: "Power4.easeOut"});
        setTimeout(()=>{
            this.interactive = true;
            audioManager.playMusic("resources/assets/audio/game.mp3");
            this.refreshTexts();
        }, 11000);
    }

    listenToInteractivity(){
   		this.blocks.forEach((sprite)=>{
   			sprite.interactive = true;
   			sprite.click = sprite.tap = (event)=>{
                if (this.interactive){
                    sprite.life--;
                    if (sprite.life in SPECIAL_DIRT_SKINS){
                        audioManager.playSound("resources/assets/audio/dig.wav");
                        sprite.texture = this.textures[`Dirt_Block_${SPECIAL_DIRT_SKINS[sprite.life]}`];
                    } else if (sprite.life === 0){
                        audioManager.playSound("resources/assets/audio/dig.wav");
                        this.createParticleOnSprite(sprite, true);

                        this.stateContainer.removeChild(sprite);
                        let itemFound = this.lottery[this.digIndex];

                        if (itemFound){
                            if (itemFound == "skull"){
                                this.interactive = false;
                            }
                            let item = new PIXI.Sprite.fromImage(`resources/assets/images/${itemFound}.png`);
                            this.stateContainer.addChild(item);
                            item.anchor = new PIXI.Point(0.5, 0.5);
                            item.position = new PIXI.Point(sprite.position.x + GRID_INFORMATIONS.cellWidth/2, sprite.position.y + GRID_INFORMATIONS.cellHeight/2);    
                            item.scale = new PIXI.Point(0.8, 0.8);
                            TweenLite.to(item.position, 1, {
                                x: this.texts.earnedMoney.position.x,
                                y: this.texts.earnedMoney.position.y,
                                ease: "Power4.easeIn",
                                onComplete: ()=>{
                                    if (itemFound == "jewel"){
                                        audioManager.playSound("resources/assets/audio/coin.mp3");
                                        this.earnedMoneyValue += this.ticketValue * 0.2;
                                    } else if (itemFound == "star"){
                                        audioManager.playSound("resources/assets/audio/yeah.mp3");
                                        this.earnedMoneyValue *= 2;
                                    } else if (itemFound == "skull"){
                                        audioManager.playSound("resources/assets/audio/gameover.wav");

                                        this.earnedMoneyValue = 0;
                                        this.quit();
                                        
                                    }
                                    this.stateContainer.removeChild(item);
                                    this.refreshTexts();
                                }
                            });

                        }
                        this.digIndex++;
                    }
                    this.createParticleOnSprite(sprite);
                }
   			};
   		});
        this.sprites.stop.interactive = true;
        this.sprites.stop.click = this.sprites.stop.tap = (event) =>{
            if (this.interactive){
                this.interactive = false;
                this.game.addMoney(this.earnedMoneyValue);
                this.quit();
            }
        };

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
    refreshTexts(){
        this.texts.earnedMoney.text = this.earnedMoneyValue + "£";
    }
    quit(){
        this.game.changeState("menu", {
            noAnimation: true
        });
    }
    clean(){
        audioManager.stopMusic();
    	return new Promise((resolve, reject)=>{
	    	TweenLite.to(this.stateContainer.position, 2, {y: this.game.height, delay: 0.5, ease: Power1.easeInOut, onComplete: ()=>{
	    		this.game.stage.removeChild(this.stateContainer);
	    		resolve();
	    	}});
    	});
    }
}

module.exports = Gameplay;
