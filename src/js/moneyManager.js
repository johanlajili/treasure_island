"use strict";
class MoneyManager{
	constructor(){

		this.money = 0;
		this.changeMoney(100);
		
		
		document.querySelector(".deposit").addEventListener("click", ()=>{
			this.changeMoney(parseInt(this.money)+20);
		});
	}
	updateText(){
		document.querySelector(".money").innerText = this.money+"£";
	}
	changeMoney(value){
		this.money = Math.min(value, 150);
		this.updateText();
	}

}

module.exports = new MoneyManager();