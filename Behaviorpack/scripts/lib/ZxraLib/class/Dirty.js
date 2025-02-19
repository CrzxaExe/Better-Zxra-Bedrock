import { Specialist } from "../module.js";

class Dirty {
  constructor(sp) {
    if (!sp) return new Error("Invalid player");
    if(!(sp instanceof Specialist)) return new Error("No match classes");
    this.sp = sp;
  }

  getVal() {
    return this.sp.getData().dirty.toFixed(0);
  }
  addVal(amount) {
    let data = this.sl.getData();
    data.dirty += Number(amount);
    this.sp.setData(data);
  }
  minVal(amount) {
    this.addValue(-Number(amount));
  }
  setVal(amount) {
    let data = this.sp.getData();
    data.dirty = Number(amount);
    this.sp.setData(data);
  }
  resetVal() {
    this.setVal(this.sp.rawData.dirty);
  }
}

export { Dirty };
