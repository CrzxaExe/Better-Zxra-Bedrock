import { world } from "@minecraft/server";
import { Specialist, Entity, Items } from "../system.js";
export {
	Cooldown,
	status
}

class Cooldown {
	constructor(player) {
		this.plyr = new Specialist(player)
	}
	getData() {
		return this.plyr.getData()
	}
	setData(obj) {
		this.plyr.setData(obj)
	}
	getAllCd() {
		return this.getData().cd
	}
	getCd(name) {
		let data = this.getData(), find = data.cd.find(e => e.name == name)

		if(!find) return { error: true }
		return find
	}
	cd(name, dur) {
		if(!name) return new Error("Cd what?")
		let data = this.getCd(name), duration = dur || 0

		if(data.error !== true) return { name: name, duration: data.duration, skill: false }
		this.addCd(name, duration)
		return { name, duration, skill: true }
	}
	isCd(nm, dur = 1) {
		if(!nm) return new Error("Cd what?")
		let data = this.cd(nm, dur)
		
		if(data.skill !== true) return true
		return false
	}
	addCd(nm, dur) {
		if(!nm) return new Error("Cd what?")
		let name = nm, duration = dur || 1, data = this.getData(), find = data.cd.find(e => e.name == name)

		if(!find) {
			if(!data.cd) data.cd = []
			data.cd.push({ name, duration })
			this.setData(data)
		} else {
			let index = data.cd.findIndex(e => e.name == name)
			data.cd[index].duration = duration
			this.setData(data)
		}
	}
	setCd(nm, dur) {
		let data = this.getData(), find = data.cd.findIndex(e => e.name == nm)
		find === -1 ? data.cd.push({ name: nm, duration: Number(dur) }) : data.cd[find].duration = Math.max(data.cd[find].duration, Number(dur))

		this.setData(data)
	}
	minCd(nm, dur) {
		if(!nm) return new Error("Cd what?")
		let name = nm, duration = dur || 0, data = this.getData(), find = data.cd.findIndex(e => e.name == name)

		if(find == undefined) return
		data.cd[find].duration - duration <= 0 ? data.cd.splice(find, 1) : data.cd[find].duration -= duration;
		this.setData(data)
	}
	removeCd(name) {
		if(!name) return new Error("Cd what?")
		let data = this.getData(), find = data.cd.findIndex(e => e.name == name)

		if(!find) return
		data.cd.splice(find, 1)
		this.setData(data)
	}
}
	
class status {
	constructor(entity) {
		if(!entity) throw new Error("Invalid data or entity")
		this.ent = new Entity(entity)
	}
	// Method
	getData() {
		return this.ent.getDataEnt()
	}
	setData(obj) {
		this.ent.setDataEnt(obj)
	}
	getAll() {
		return this.getData().status
	}
	clearAll() {
		let data = this.getData()
		data.status = []
		this.setData(data)
	}
	getStatus(name) {
		if(!name) return
		let find = this.getAll().find(e => e.name == name)

		if(!find) return { error: true }
		return find
	}
	hasStatusName(name) {
		if(!name) return
	    return this.getAll().some(e => e.name == name)
	}
	getStatusBy(finder) {
		return this.getAll().find(e => finder[Object.keys(finder)[0]] == e[Object.keys(finder)[0]])
	}
	addStatus(name, dur, lib) {
		if(!name) return new Error("Status What?")
		let duration = dur || 1, type = lib.type || "none", decay = lib.decay || "time", stack = Boolean(lib.stack) || false, lvl = Number(lib.lvl) || 1, data = this.getData(), find = data.status.findIndex(e => e.name == name)

		if(find == -1) {
			data.status.push({ name, duration, type, stack, lvl, decay })
		} else {
			if(data.status[find].stack == false) {
                data.status[find].lvl = Math.max(data.status[find].lvl, lvl)
                data.status[find].duration = Math.max(data.status[find].duration, duration)
            } else {
            	data.status[find].lvl += lvl
                data.status[find].duration = Math.max(data.status[find].duration, duration)
            }
		}
		this.setData(data)
	}
	minStatus(name, dur) {
		if(!name) return
		let duration = dur || 1, data = this.getData(), find = data.status.findIndex(e => e.name == name)

		if(find === -1) return
		data.status[find].duration - duration <= 0 ? data.status.splice(find, 1) : data.status[find].duration -= duration;
		this.setData(data)
	}
	removeStatus(name) {
		if(!name) return
		let data = this.getData(), find = data.status.findIndex(e => e.name == name)

		if(find === -1) return
		data.status.splice(find, 1)
		this.setData(data)
	}
	statusEffect(obj) {
		switch(obj.type) {
			
		}
	}
	// Damage Up Status
	dmgStat(plus = false) {
		return this.getData().status.filter(e => e.type == "damage").reduce((all, cur) => all +=  Number(cur.lvl) * 0.01, 1);
	}
	// Skill Up Status
	skillStat() {
		return this.getData().status.filter(e => e.type == "skill").reduce((all, cur) => all += cur.lvl * 0.01, this.dmgStat());
	}
	// Stamina Recovery Status
	staminaUpStat() {
		return this.getData().status.filter(e => e.type == "stamina_up").reduce((all, cur) => all += cur.lvl * 0.01, 1);
    }
    // Fragile Status
    fragileStat() {
        return this.getData().status.filter(e => e.type == "fragile").reduce((all, cur) => cur.lvl * 0.01 + 1 > all ? all = cur.lvl * 0.01 + 1, 1);
    }
	
}