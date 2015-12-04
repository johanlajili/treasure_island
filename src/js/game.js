"use strict";

let PIXI = require("./libs/pixi.min");
let Menu = require("./states/Menu");
let TweenLite = require("gsap/src/uncompressed/TweenLite");
class Game{
	constructor(){
		let that = this;
		that.canvas = document.querySelector("canvas");
		this.width = 1456;
		this.height = 819;
		that.renderer = new PIXI.WebGLRenderer(this.width, this.height, {view: that.canvas});
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
		this.drawState("menu");
	}
	createStates(){
		this.states = {};
		this.states.menu = new Menu(this);
	}
	drawState(stateName){
		this.states[stateName].draw();
	}
}

module.exports = Game;