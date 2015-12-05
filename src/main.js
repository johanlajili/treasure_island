"use strict";

let es6Polyfill = require('6to5/polyfill');

let resizer = require("./js/resizer");
let preloader = require("./js/preloader");
let progressBar = require("./js/progressBar");
let moneyManager = require("./js/moneyManager");

let Game = require("./js/Game");

const IMAGES = ("$IMAGES").split(",");
const AUDIO = ("$AUDIO").split(",");

function createGame(){
	var game = new Game({
		onChangeMoney: (value)=>{
			return moneyManager.addMoney(value);
		}
	});
}

preloader.addImagesToPreload(IMAGES);
preloader.addAudioToPreload(AUDIO);
moneyManager.updateText();
preloader.onLoading((loadedNumber, total)=>{
	progressBar.moveTo(loadedNumber, total);
	if (loadedNumber == total){
		setTimeout(function(){
			createGame();
		}, 1000);
	}
});
