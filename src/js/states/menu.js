"use strict";
let PIXI = require("../libs/pixi.min");
let TweenLite = require("gsap/src/uncompressed/TweenLite");
let easing = require("gsap/src/uncompressed/easing/EasePack");

const MENU_SPRITES = [
	{
	    name: "title_treasure",
	    position: {
	        x: 188,
	        y: 74
	    }
	}, 
	{
	    name: "title_island",
	    position: {
	        x: 697,
	        y: 160
	    }
	}, 
	{
	    name: "treasure",
	    position: {
	        x: 1035,
	        y: 72
	    }
	}, 
	{
	    name: "instructions",
	    position: {
	        x: 45,
	        y: 389
	    }
	}, 
	{
	    name: "secondary_instructions",
	    position: {
	        x: 905,
	        y: 470
	    }
	}, 
	{
	    name: "play_button",
	    position: {
	        x: 952,
	        y: 682
	    }
	}, 
	{
	    name: "left_arrow",
	    position: {
	        x: 971,
	        y: 516
	    }
	}, 
	{
	    name: "right_arrow",
	    position: {
	        x: 1224,
	        y: 516
	    }
	}
];
class Menu {
    constructor(game) {
        this.game = game;
        this.sprites = {};
        MENU_SPRITES.forEach((object) => {
        	let imageName = object.name;
            this.sprites[imageName] = new PIXI.Sprite.fromImage(`resources/assets/images/${imageName}.png`);
            this.sprites[imageName].position = new PIXI.Point(object.position.x, object.position.y);
        });
    }

    draw() {
        this.stateContainer = new PIXI.Container();
        this.game.stage.addChild(this.stateContainer);
        MENU_SPRITES.forEach((object) =>{
        	 this.stateContainer.addChild(this.sprites[object.name]); 
        });
        this.animate();
    }

    animate(){
    	TweenLite.from(this.sprites.title_treasure.position, 3, {y: -400, ease: Power3.easeIn} );
    	TweenLite.from(this.sprites.title_island.position, 3, {x: this.game.width + 200, ease: Power3.easeIn} );
    	TweenLite.from(this.sprites.treasure.position, 2, {y: -400, ease: Bounce.easeInOut, delay: 2} );
    	([this.sprites.instructions,
    	this.sprites.secondary_instructions,
    	this.sprites.play_button,
    	this.sprites.left_arrow,
    	this.sprites.right_arrow]).forEach((sprite)=>{
    		TweenLite.from(sprite, 1, {alpha: 0, delay: 4, ease: Power4.easeIn});
    	});
    }
}

module.exports = Menu;
