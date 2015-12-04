"use strict";
let PIXI = require("../libs/pixi.min");
let TweenLite = require("gsap/src/uncompressed/TweenLite");
let TimelineMax = require("gsap/src/uncompressed/TimelineMax");
let easing = require("gsap/src/uncompressed/easing/EasePack");
let balance = require("../balance.json");
let audioManager = require("../audioManager");

let currentTicketIndex = 3; //default is 10£;
const MENU_SPRITES = [
	{
	    name: "title_treasure",
	    position: {
	        x: 617,
	        y: 161
	    }
	}, 
	{
	    name: "title_island",
	    position: {
	        x: 950,
	        y: 279
	    }
	}, 
	{
	    name: "treasure",
	    position: {
	        x: 1130,
	        y: 152
	    }
	}, 
	{
	    name: "instructions",
	    position: {
	        x: 448,
	        y: 595
	    }
	}, 
	{
	    name: "secondary_instructions",
	    position: {
	        x: 1076,
	        y: 566
	    }
	}, 
	{
	    name: "play_button",
	    position: {
	        x: 1130,
	        y: 738
	    }
	}, 
	{
	    name: "left_arrow",
	    position: {
	        x: 1002,
	        y: 556
	    }
	}, 
	{
	    name: "right_arrow",
	    position: {
	        x: 1255,
	        y: 556
	    }
	}
];

const MENU_TEXTS = [
	{
		name: "jewelValue",
		position: {
			x:287,
			y:595
		},
		font:  "50px Impact",
		color: "white",
		strokeColor: "black",
		strokeThickness: 4,
		align: "center"
	},
	{
		name: "ticketValue",
		position: {
			x:1133,
			y:558
		},
		font:  "80px Impact",
		color: "white",
		strokeColor: "black",
		strokeThickness: 6,
		align: "center"
	},
	{
		name: "upToValue",
		position: {
			x:1293,
			y:637
		},
		font:  "70px Impact",
		color: "#ffd801",
		strokeColor: "black",
		strokeThickness: 6,
		align: "center"
	},
];
class Menu {
    constructor(game) {
        this.game = game;
        this.sprites = {};
        this.texts = {};

        MENU_SPRITES.forEach((object) => {
        	let imageName = object.name;
            this.sprites[imageName] = new PIXI.Sprite.fromImage(`resources/assets/images/${imageName}.png`);
            this.sprites[imageName].position = new PIXI.Point(object.position.x, object.position.y);
            this.sprites[imageName].anchor = new PIXI.Point(0.5, 0.5);
        });
        MENU_TEXTS.forEach((object) => {
        	let textName = object.name;
            this.texts[textName] = new PIXI.Text("", {font: object.font, fill: object.color, stroke: object.strokeColor, strokeThickness: object.strokeThickness, align: object.align});
            this.texts[textName].position = new PIXI.Point(object.position.x, object.position.y);
            this.texts[textName].anchor = new PIXI.Point(0.5, 0.5);

        });
        window.texts = this.texts;
        window.sprites =this.sprites;

    }

    draw() {
    	audioManager.playMusic("resources/assets/audio/menu.mp3");
        this.stateContainer = new PIXI.Container();
        this.game.stage.addChild(this.stateContainer);
        MENU_SPRITES.forEach((object) =>{
        	 this.stateContainer.addChild(this.sprites[object.name]); 
        });
        MENU_TEXTS.forEach((object) =>{
        	 this.stateContainer.addChild(this.texts[object.name]); 
        });
        this.animate();
        this.listenToInteractivity();
    }

    animate(){
    	TweenLite.from(this.sprites.title_treasure.position, 3, {y: -600, ease: "Power3.easeIn"} );
    	TweenLite.from(this.sprites.title_island.position, 3, {x: this.game.width + 400, ease: "Power3.easeIn", delay: 1.5} );
    	TweenLite.from(this.sprites.treasure.position, 2, {y: -600, ease: "Bounce.easeInOut", delay: 4} );
    	([this.sprites.instructions,
    	this.sprites.secondary_instructions,
    	this.sprites.play_button,
    	this.sprites.left_arrow,
    	this.sprites.right_arrow,
    	this.texts.jewelValue,
    	this.texts.ticketValue,
    	this.texts.upToValue
    	]).forEach((sprite)=>{
    		TweenLite.from(sprite.position, 2, {x: "-=" + this.game.width, delay: 5, ease: "Power4.easeIn"});
    	});
    	setTimeout(()=>{
    		//hack to wait for the font to be properly loaded;
        	this.refreshTexts();
    	}, 2000);
    	setTimeout(()=>{
    	    this.shakeTitle = new TimelineMax({"repeat": Infinity});

	    	this.shakeTitle.to(this.sprites.title_treasure, 0.2, {rotation: 0.1}, "+=3");
	    	this.shakeTitle.to(this.sprites.title_treasure, 0.4, {rotation: -0.1});
	    	this.shakeTitle.to(this.sprites.title_treasure, 0.2, {rotation: 0});
	    }, 5000);
    }

    listenToInteractivity(){
    	let leftArrow = this.sprites.left_arrow;
    	let rightArrow = this.sprites.right_arrow;
    	let playButton = this.sprites.play_button;
    	leftArrow.interactive = true;
    	rightArrow.interactive = true;
    	playButton.interactive = true;
    	leftArrow.mouseover = rightArrow.mouseover = playButton.mouseover = function(data){	
			data.target.scale.x = 1.1;
			data.target.scale.y = 1.1;
    	};
		leftArrow.mouseout = rightArrow.mouseout = playButton.mouseout =function(data){
			data.target.scale.x = 1;
			data.target.scale.y = 1;
		};
		leftArrow.click = () =>{
			this.changeTicketValue(-1);

		};
		rightArrow.click = () =>{
			this.changeTicketValue(1);
		};
		playButton.click = () =>{
			audioManager.playSound("resources/assets/audio/yeah.mp3");
			audioManager.stopMusic();
			this.game.changeState("gameplay");
			
		};

    }
    changeTicketValue(step){
    	var newIndex = currentTicketIndex + step;
    	if (newIndex >= 0 && newIndex < balance.ticketValues.length){
    		audioManager.playSound("resources/assets/audio/coin.mp3");
    		currentTicketIndex = newIndex;
    		this.refreshTexts();
    	} else {
    		audioManager.playSound("resources/assets/audio/nope.wav");
    	}
    }
    refreshTexts(){
    	let currentTicketValue = balance.ticketValues[currentTicketIndex];
    	this.texts.jewelValue.text = 0.2*currentTicketValue + "£";
    	this.texts.ticketValue.text = currentTicketValue + "£";
    	this.texts.upToValue.text = 8*currentTicketValue + "£";
    }
    clean(){
    	return new Promise((resolve, reject)=>{
    		this.shakeTitle.stop();
	    	TweenLite.to(this.stateContainer.position, 4, {y: this.game.height, delay: 0.5, ease: Power4.easeOut, onComplete: ()=>{
	    		this.game.stage.removeChild(this.stateContainer);
	    	}});
	    	setTimeout(()=>{
	    		//don't wait for completion of the tween to start next scene;
	    		resolve();
	    	}, 2000);
    	});
    }
}

module.exports = Menu;
