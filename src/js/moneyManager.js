"use strict";
class MoneyManager{
	constructor(){
		this.money = localStorage.getItem("money");
		if (!this.money){
			this.changeMoney(100);
		}
		
		
		document.querySelector(".deposit").addEventListener("click", ()=>{
			this.changeMoney(parseInt(this.money)+20);
		});
	}
	updateText(){
		document.querySelector(".money").innerText = this.money+"£";
	}
	changeMoney(value){
		this.money = Math.min(value, 150);
		localStorage.setItem("money", this.money);
		this.updateText();
	}

}

module.exports = new MoneyManager();