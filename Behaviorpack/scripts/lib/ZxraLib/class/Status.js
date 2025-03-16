class Status {
  constructor(ent) {
    if(!ent) throw new Error("Entity Source Error");
    this.ent = ent
  }

  // Data Method
  getData() {
    return this.ent.getDataEnt();
  }
  setData(obj, original = false) {
    if(!obj) return new Error("Need Object");
    const data = this.getData();

    if(original == false) {
      data.status = obj;
      this.ent.setDataEnt(data);
      return data;
    }
    this.ent.setDataEnt(obj);
    return obj;
  }
  
  // Status Method
  getAll() {
    return this.getData().status || []
  }
  clearAll() {
    const data = this.getData();
    data.status = [];
    this.setData(data);
    return data;
  }

  // Find Method
  getStatus(name) {
    if(!name) return;
    return this.getAll().find(e => e.name === name);
  }
  getAllStatusBy(finder) {
    if(!finder) return;
    let data = this.getAll();
    Object.keys(finder).forEach(e => {
      data = data.filter(r => r[e] === finder[e]);
    })
    return data || [];
  }
  hasStatus(finder) {
    if(!finder) return false;
    const data = this.getAllStatusBy(finder);
    if(data.length > 0) return true;
    return false;
  }
  hasStatusName(names, split = true) {
    if(!names) return false;
    const data = this.getAll();
    if(typeof names === "string") {
      return data.some(e => e.name === names);
    }

    if(!Array.isArray(names)) return false;
    const filtered = names.reduce((all, cur) => all.push(data.some(e => e.name === cur)),[])

    if(split) return filtered;
    return filtered.every(e => e === true);
  }

  // Operation Method
  addStatus(name, duration = 1, { type = "none", decay = "time", stack, lvl = 1 }) {
    if(!name) return;

    switch(type) {
      case "silence":
        this.ent.entity.addTag("silence");
        break;
    }

    let newStack = Boolean(stack) || false;
    const data = this.getAll(),
      findIndex = data.findIndex(e => e.name === name);

    if(findIndex === -1) {
      data.push({ name, duration, type, stack, lvl, decay });
    } else {
      data[findIndex].duration = Math.max(data[findIndex].duration, duration);
      if(!data[findIndex].stack) {
        data[findIndex].lvl = Math.max(data[findIndex].lvl, lvl);
      } else {
        data[findIndex].lvl += lvl;
      }
    }

    this.setData(data);
  }
  addStatusMany(status) {
    if(!status) return;
    if(Array.isArray(status)) {
      status.forEach(e => {
        if(typeof e !== "object") return;
        if(!e.name) return;
        const { name, duration = 1, type = "none", lvl = 1, decay = "time", stack = false } = e;

        this.addStatus(name, duration, { type, lvl, decay, stack })
      })
    }
    
    if(typeof status !== "object") return;
    if(!status.name) return;
    const { name, duration = 1, type = "none", lvl = 1, decay = "time", stack = false } = status;

    this.addStatus(name, duration, { type, lvl, decay, stack })
  }
  minStatus(name, duration = 1) {
    if(!name) return;
    const data = this.getAll(), findIndex = data.findIndex(e => e.name === name);

    if(findIndex === -1) return;
    if(data[findIndex].duration < duration) {
      this.removeStatus(name);
      return;
    }
    data[findIndex].duration -= duration;
    this.setData(data);
  }
  minLvlStatus(name, lvl = 1) {
    if(!name) return;
    const data = this.getAll(), findIndex = data.findIndex(e => e.name === name);

    if(findIndex === -1) return;
    if(data[findIndex].lvl <= lvl) {
      this.removeStatus(name);
      return;
    }
    data[findIndex].lvl -= lvl;
    this.setData(data);
  }
  removeStatus(name) {
    if(!name) return false;
    const data = this.getAll(), findIndex = data.findIndex(e => e.name === name);

    if(findIndex === -1) return false;

    switch(data[findIndex].type) {
      case "silence":
        this.ent.entity.removeTag("silence");
        break;
      case "mudrock_shield":
        this.ent.entity.triggerEvent("cz:shield_break");
        break;
    }

    data.splice(findIndex, 1);
    this.setData(data);
    return true;
  }
  
  // Calculation Method
  normalCalcStatus(finder, startingNumber = 0) {
    return this.getAllStatusBy(finder).reduce((all, cur) => all += cur.lvl, startingNumber)
  }
  decimalCalcStatus(finder, startingNumber = 1, perLvl = 0.1, most = false) {
    let top = startingNumber;
    const data = this.getAllStatusBy(finder);
    
    if(data.length < 1) return top;
    
    data.forEach(e => {
      if(most) {
        top = Math.max(top, startingNumber + perLvl * e.lvl);
      } else {
        top += perLvl * e.lvl;
      }
    })
    return top;
  }

  // Misc Method
  statusEffect() {
  }
}

export { Status };