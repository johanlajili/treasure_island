"use strict";

let TimelineMax = require("gsap/src/uncompressed/TimelineMax");
let TweenLite = require("gsap/src/uncompressed/TweenLite");
let CSSPlugin = require("gsap/src/uncompressed/plugins/CSSPlugin");


const PROGRESS_BAR_SELECTOR = ".progress-bar";
const CONTENT_SELECTOR = ".progress-bar .content";
class ProgressBar{
	constructor(){
		this.contentElement = document.querySelector(CONTENT_SELECTOR);
		this.progressBarElement = document.querySelector(PROGRESS_BAR_SELECTOR);
		this.animateBackground();
	}

	animateBackground(){
		var tl = new TimelineMax({repeat: 100});
		tl.to(this.contentElement, 2, {
			css: {"background-position": 60 + "px"},
			ease: "Linear.easeNone"
		});
	}

	moveTo(value, total){
		TweenLite.to(this.contentElement, 0.5, {
			width: (value * 100 / total) + "%"
		});
		if (value == total){
			TweenLite.to(this.progressBarElement, 1, {
				delay: 0.5,
				scale: 1.2,
				opacity: 0
			});
		}
	}
}

module.exports = new ProgressBar();