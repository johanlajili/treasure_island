"use strict";
let resizer = require("./js/resizer");
let preloader = require("./js/preloader");
let progressBar = require("./js/progressBar");
const IMAGES = ("$IMAGES").split(",");
preloader.addImagesToPreload(IMAGES);
preloader.onLoading((loadedNumber, total)=>{
	progressBar.moveTo(loadedNumber, total);
});
