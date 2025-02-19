import { Specialist } from "../module.js";

class Temp {
	constructor(sp) {
		if(!sp)
          throw new Error("No Specialist");
        if(!(sp instanceof Specialist))
          throw new Error("No match classes");
		this.sp = sp;
	}

	getData() {
		return this.sp.getData();
	}
	setData(obj) {
		this.sp.setData(obj);
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

export { Temp };