"use strict";
class MoneyManager{
	constructor(){

		this.money = 0;
		this.fakeDepositMoney(100);
		
		
		document.querySelector(".deposit").addEventListener("click", ()=>{
			this.fakeDepositMoney(parseInt(this.money)+20);
		});
	}
	updateText(){
		document.querySelector(".money").innerText = this.money+"£";
	}
	fakeDepositMoney(value){
		this.money = Math.min(value, 150);
		this.updateText();
	}
	addMoney(value){
		this.money += value;
		this.updateText();
	}

}

module.exports = new MoneyManager();