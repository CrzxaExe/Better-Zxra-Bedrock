import { Specialist } from "../../../system.js";

class Temp {
	constructor(player) {
		if(!player)
          throw new Error("No Player");
		this.player = new Specialist(player);
	}

	getData() {
		return this.player.getData();
	}
	setData(obj) {
		this.player.setData(obj);
	}
	getTemp() {
		return this.getData().temp;
	}
	add(amount) {
		let data = this.getData(), num = Number(amount) || 0;
		data.temp = data.temp + num;
		this.setData(data);
	}
	min(amount) {
		this.add(-Number(amount));
	}
	set(num) {
		let data = this.getData(), m = Number(num) || 0;
		data.temp = m;
		this.setData(data);
	}
	reset() {
		this.set(32);
	}
}