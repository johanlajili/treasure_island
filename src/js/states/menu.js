"use strict";
let PIXI = require("../libs/pixi.min");
const MENU_SPRITES = [
	{
	    name: "title_treasure",
	    position: {
	        x: 188,
	        y: 74
	    }
	}, 
	// {
	//     name: "title_island",
	//     position: {
	//         x: 0,
	//         y: 0
	//     }
	// }, 
	// {
	//     name: "treasure",
	//     position: {
	//         x: 0,
	//         y: 0
	//     }
	// }, 
	// {
	//     name: "instructions",
	//     position: {
	//         x: 0,
	//         y: 0
	//     }
	// }, 
	// {
	//     name: "secondary_instructions",
	//     position: {
	//         x: 0,
	//         y: 0
	//     }
	// }, 
	// {
	//     name: "play_button",
	//     position: {
	//         x: 0,
	//         y: 0
	//     }
	// }, 
	// {
	//     name: "play_button_over",
	//     position: {
	//         x: 0,
	//         y: 0
	//     }
	// }, 
	// {
	//     name: "left_arrow",
	//     position: {
	//         x: 0,
	//         y: 0
	//     }
	// }, 
	// {
	//     name: "right_arrow",
	//     position: {
	//         x: 0,
	//         y: 0
	//     }
	// }
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
        
    }
}

module.exports = Menu;
