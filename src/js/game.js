"use strict";

let PIXI = require("./libs/pixi.min");
let StateClasses = { 
	menu : require("./states/Menu"),
	gameplay : require("./states/Gameplay")
};


let TweenLite = require("gsap/src/uncompressed/TweenLite");
class Game{
	constructor(args = {}){
		let that = this;
		that.canvas = document.querySelector("canvas");
		this.width = 1456;
		this.height = 819;
		this.onChangeMoney = args.onChangeMoney;
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
		this.changeState("menu");
	}
	createStates(){
		this.states = {};
		this.states.menu = new StateClasses.menu(this);
		this.states.gameplay = new StateClasses.gameplay(this);
	}
	drawState(stateName, args){
		this.states[stateName].draw(args);
	}
	resetState(stateName, args){
		this.states[stateName] = new StateClasses[stateName](this);
	}
	addMoney(value){
		if (this.onChangeMoney){
			this.onChangeMoney(value);
		}
	}
	removeMoney(value){
		if (this.onChangeMoney){
			return this.onChangeMoney(-value);
		}
	}
	changeState(stateName, args = {}){
		var promises = [];
		if (this.currentState){
			let cleaningPromise =this.states[this.currentState].clean();
			promises.push(cleaningPromise);
			cleaningPromise.then(()=>{
				this.resetState(this.currentState);
			});
		}
		Promise.all(promises).then(()=>{
			this.currentState = stateName;
			this.drawState(stateName, args);
		});
	}
}

module.exports = Game;