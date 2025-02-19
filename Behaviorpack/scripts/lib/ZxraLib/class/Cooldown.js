class Cooldown {
  constructor(sp) {
    if(!sp) throw new Error("Player Source Error");
    this.sp = sp
  }

  // Data Method
  getData() {
    return this.sp.getData();
  }
  setData(obj, original = false) {
    if(!obj) return new Error("Need Object");
    const data = this.getData();

    if(original == false) {
      data.cd = obj;
      this.sp.setData(data);
      return data;
    }
    this.sp.setData(obj);
    return obj;
  }
  
  // Find Method
  getAllCd() {
    return this.getData().cd || [];
  }
  getCd(name) {
    if(!name) return;
    return this.getAllCd().find(e => e.name === name);
  }
  hasCd(name) {
    if(!name) return;
    return this.getAllCd().some(e => e.name === name);
  }

  // Operation Method
  addCd(name, duration = 1) {
    if(!name) return;
    const data = this.getAllCd(), findIndex = data.findIndex(e => e.name === name);

    if(findIndex === -1) {
      data.push({ name, duration });
    } else {
      data[findIndex].duration = Math.max(data[findIndex].duration, duration);
    }
    this.setData(data);
  }
  cd(name, duration = 1) {
    if(!name) return false;
    if(this.hasCd(name)) return true;
    this.addCd(name, duration)
    return false;
  }
  minCd(name, amount = 1) {
    if(!name) return;
    const data = this.getAllCd(), findIndex = data.findIndex(e => e.name === name);

    if(this.sp.status().getAllStatusBy({ type: "silence" }).length > 0) return;

    if(findIndex === -1) return;
    if(data[findIndex].duration < amount) {
      this.removeCd(name)
      return;
    }
    data[findIndex].duration -= amount;
    this.setData(data);
  }
  removeCd(name) {
    if(!name) return;
    const data = this.getAllCd(), findIndex = data.findIndex(e => e.name === name);

    if(findIndex === -1) return;
    data.splice(findIndex, 1);
    this.setData(data);
  }
}

export { Cooldown };