"use strict";

var buzz = require("node-buzz");

class AudioManager{
	constructor(){

	}
	playMusic(musicPath){
		this.music = new buzz.sound(musicPath,{
			loop: true
		});
		this.music.play();
	}
	stopMusic(){
		if (this.music){
			this.music.stop();
		}
	}
	playSound(soundPath){
		var sound = new buzz.sound(soundPath);
		sound.play();
	}
}

module.exports = new AudioManager();