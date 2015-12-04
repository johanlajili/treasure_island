"use strict";
let resizer = require("./js/resizer");
let preloader = require("./js/preloader");
let progressBar = require("./js/progressBar");
let Game = require("./js/Game");

const IMAGES = ("$IMAGES").split(",");


function createGame(){
	var game = new Game();
}





preloader.addImagesToPreload(IMAGES);
preloader.onLoading((loadedNumber, total)=>{
	progressBar.moveTo(loadedNumber, total);
	if (loadedNumber == total){
		createGame();
	}
});
