"use strict";

let PIXI = require("./libs/pixi.min");
let Menu = require("./states/Menu");
let Gameplay = require("./states/Gameplay");
let TweenLite = require("gsap/src/uncompressed/TweenLite");
class Game{
	constructor(){
		let that = this;
		that.canvas = document.querySelector("canvas");
		this.width = 1456;
		this.height = 819;
		that.renderer = new PIXI.autoDetectRenderer(this.width, this.height, {view: that.canvas});
		that.stage = new PIXI.Container();
		var sprite = new PIXI.Sprite.fromImage('resources/assets/images/background.png');
		TweenLite.from(sprite, 1, {alpha: 0});
		that.stage.addChild(sprite);

		function run(){
			requestAnimationFrame(run);
			that.renderer.render(that.stage);
		}
		requestAnimationFrame(run);
		this.createStates();
		this.changeState("gameplay");
	}
	createStates(){
		this.states = {};
		this.states.menu = new Menu(this);
		this.states.gameplay = new Gameplay(this);
	}
	drawState(stateName){
		this.states[stateName].draw();
	}
	changeState(stateName){
		var promises = [];
		if (this.currentState){
			promises.push(this.states[this.currentState].clean());
		}
		Promise.all(promises).then(()=>{
			this.currentState = stateName;
			this.drawState(stateName);
		});
	}
}

module.exports = Game;