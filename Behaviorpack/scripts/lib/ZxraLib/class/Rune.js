import { Specialist, runeData, rawRune, rawRuneStat } from "../module.js";

class Rune {
  constructor(p) {
    if(!p) throw new Error("Player source error");
    if(!(p instanceof Specialist)) throw new Error("Not a player");

    this.sp = p;
  }

  // Data Method
  getData() {
    return this.sp.getData();
  }
  setData(obj, original = false) {
    if(!obj) return new Error("Need Object");
    const data = this.getData();

    if(original == false) {
      data.rune = obj;
      this.sp.setData(data);
      return data;
    }
    this.sp.setData(obj);
    return obj;
  }

  // Get Method
  getRune() {
    return this.getData().rune || rawRune;
  }

  addRune(obj) {
    if(!obj) return;
    const key = Object.keys(obj)[0];

    if(!["runes","usedRune"].includes(key)) return;

    const data = this.getRune();
    if(key === "runes" && data.runes.includes(obj[key])) return;
    
    data[key].push(obj[key]);
    this.setData(data);
  }

  removeRune(obj) {
    if(!obj) return;
    const key = Object.keys(obj)[0];

    if(!["runes","usedRune"].include(key)) return;

    const data = this.getRune();
    data[key].splice(data.findIndex(e => e === obj[key]), 1);
    this.setData(data);
  }

  getAllUsedRuneStat() {
    let data = {...rawRuneStat};

    const rune = this.getRune().usedRune;

    if(rune.length < 1) return data;

    const runes = rune.map(e => runeData[e]);
    runes.forEach((cur, i) => {
      const objs = Object.keys(cur)
      
      if(objs.length < 1) return;

      objs.forEach(r => {
        if(["onHit","onHited","onKill","onDodge"].includes(r)) return;
        if(!(Object.keys(data).includes(r))) return;
        if(typeof cur[r] === "function") return;

        data[r] = data[r] + cur[r];
      })
    })

    return data;
  }

  getAction(name) {
    if(!name || !(["onHit","onHited","onKill","onDodge"].includes(name))) return [];

    const action = [],
      rune = this.getRune().usedRune;

    if(rune.length < 1) return action;
    rune.forEach(e => {
      const ac = runeData[e];
      if(!ac || !(Object.keys(ac).includes(name))) return;

      action.push(ac[name])
    })

    return action
  }
}

export { Rune };