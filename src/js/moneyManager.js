"use strict";
class MoneyManager{
	constructor(){

		this.money = 0;
		this.fakeDepositMoney(80);
		
		
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
		return new Promise((resolve, reject) =>{
			if (this.money + value < 0){
				reject();
			} else {
				this.money += value;
				this.updateText();
				resolve();
			}
		});
	}

}

module.exports = new MoneyManager();