import { Specialist } from "../../../system.js";

class Dirty {
  constructor(player) {
    if (!player) return new Error("Invalid player");
    this.ipn = new Specialist(player);
  }

  getVal() {
    return this.ipn.getData().dirty.toFixed(0);
  }
  addVal(amount) {
    let data = this.ipn.getData();
    data.dirty += Number(amount);
    this.ipn.setData(data);
  }
  minVal(amount) {
    this.addValue(-Number(amount));
  }
  setVal(amount) {
    let data = this.ipn.getData();
    data.dirty = Number(amount);
    this.ipn.setData(data);
  }
  resetVal() {
    this.setVal(this.ipn.rawData.dirty);
  }
}

export { Dirty };
