import { EffectTypes, ItemStack, system, world, Player } from "@minecraft/server";
import { Ultimate, Cooldown, status, Temp } from "./lib/classes.js";
import { Dirty, Ench, Game, leveling } from "./lib/ZxraLib/module.js";
import { Npc } from "./lib/npc-class.js";
import * as data from "./lib/data.js";

// Main Class of Weapon Pasif
export class pasif {
	static Pasif = {
		hit: [],
		hited: [],
		run: [],
		kill: []
	}

	static addHitPasif(type, callback) {
		this.Pasif.hit.push({ type, callback })
    }
    static addHitedPasif(type, callback) {
		this.Pasif.hited.push({ type, callback })
    }
    static addRunPasif(type, callback) {
		this.Pasif.hit.push({ type, callback })
    }
    static addKillPasif(type, callback) {
		this.Pasif.kill.push({ type, callback })
    }
}
// Main Class of Skill Weapon
export class weapon {
	static weapons = []

	static registerWeapon(weaponName, skill) { this.weapons.push({ weaponName, callback: skill }) }
}
// Main Class of Block UI
export class BlockUi {
	static blocks = []

	static addBlock(block, callback, item) {
		this.blocks.push({ block, item, callback })
	}
}
// Main Class of Special Item
export class specialItem {
	static item = []
	static use = []
	static con = []

	static addItem(item, callback) {
		this.item.push({ item, callback })
	}
	static useItem(item, callback) {
		this.use.push({ item, callback })
	}
	static placeItem(item, callback) {
		this.con.push({ item, callback })
	}
}
// Spawn Particle
export function spawnParticles(particle, dimension, location) {
	world.getDimension(dimension).spawnParticle(particle, location)
}

// Classes

// Item Class
export class Items {
	constructor(item) {
		if(!item) throw new Error("Invalid Item")
		this.item = item
	}

	// Method
	getDurability() {
		return this.item.getComponent("durability")
	}
	getTag() {
		return this.item.getTags()
	}
	getTier() {
		let tag = this.getTag(), gets = 0
		tag.forEach(t => t.startsWith("tier_") ? gets = Number(t.split("_")[1]) : 0)
		return Number(gets)
	}
	getType() {
		return this.getTag().find(e => data.weaponType.includes(e))
	}
	enchant() {
		return new Ench(this.item)
	}
}
// Block Class
export class Tile {
	constructor(block) {
		if(!block) throw new Error("Invalid block")
		this.block = block
		this.world = new Game(world)
		this.entity = this.world.getEntityAtBlock(this.block, "block_data")
		if(!this.entity || this.entity == undefined || this.entity == null) {
          world.getDimension(block.dimension.id).spawnEntity("cz:block_data")
          this.entity = this.world.getEntityAtBlock(this.block, "block_data")
        }

		this.data = new BlockEntity(this.entity, block)
	}

	// Power Method
	getPower() {
		let data = this.data.getData()

		if(data.power == undefined) return undefined
		return { power: data.power, text: `${Number(data.power.stored).toFixed(2)}/${data.power.max}` }
	}
	addPower(amount) {
		let data = this.data.getData(), has = this.getPower()
		amount= Number(amount)

		if(has == undefined) return
		data.power.stored + amount <= data.power.max ? data.power.stored += amount : data.power.stored = data.power.max;
		this.data.setData(data)
	}
	getPowerStatus() {
		let data = this.data.getData(), on;

		if(data.powerStatus == undefined) return undefined
		data.powerStatus == true ? on = "On": on = "Off";
		return on
	}
	switchPower(type) {
		let data = this.data.getData(), status = this.getPowerStatus()

		if(status == undefined) return Error("Not power block")
		data.powerStatus = !data.powerStatus

		switch(type) {
			case "generator":
			  data.powerStatus == false ? this.data.entity.removeTag("generator") : this.data.entity.addTag("generator")
			  break;
		}
		this.data.setData(data)
	}
	generatePower(power, fuel) {
		let data = this.data.getData()

		if(this.getFuel() == undefined || data.fuel - fuel < -0.001) return
		if(data.power == undefined) return

		this.addPower(power)
		this.minFuel(fuel)
	}
	isGenerate() {
		let power = this.getPower()
		return this.data.entity.hasTag("generator") && this.getFuel() >= 0.4 && power.power.stored < power.power.max
	}
	getVolt() {
		let data = this.data.getData(), volt = -1

		if(data.generator == undefined) return volt
		this.isGenerate() ? volt = data.generator/5 : volt = 0;
		return volt
	}
	// Fuel Method
	getFuel() {
		let data = this.data.getData()

        if(data.fuel == undefined) return undefined
        return data.fuel.toFixed(2)
	}
	addFuel(amount) {
		let data = this.data.getData()

		if(data.fuel == undefined) return
		data.fuel += Number(amount)
		this.data.setData(data)
	}
	minFuel(amount) {
		this.addFuel(-Number(amount))
	}
	
}
// Block Entity Class
export class BlockEntity {
	/*
	 * Class for Block Entity
	*/
	constructor(entity, block) {
		if(!entity || !block) throw new Error("Invalid Entity or Block")
		this.entity = entity
		this.block = block
		this.raw = data.blockData
	}

	// Data method
	getData() {
		let data = this.raw[this.block.type.id.split(":")[1]]
		if(this.entity.getDynamicProperty("block_data") !== undefined) data = JSON.parse(this.entity.getDynamicProperty("block_data"))
		return data
	}
	setData(obj) {
		this.entity.setDynamicProperty("block_data", JSON.stringify(obj))
	}
	clearData() {
		this.entity.setDynamicProperty("block_data", JSON.stringify(this.raw[this.block.type.id.split(":")[1]]))
	}
	
}
// Entity Class
export class Entity {
	/*
	 * Class for Entity
	*/
	constructor(entity) {
		if(!entity) throw new Error("Invalid Entity")
		this.entity = entity
		this.raw = {
			status: []
		}
	}

	// Data Method
	getDataEnt(name = "entitas") {
		let data = this.raw
		if(this.entity.getDynamicProperty(name) !== undefined) data = JSON.parse(this.entity.getDynamicProperty(name))
		return data
	}
	setDataEnt(obj, name = "entitas") {
		this.entity.setDynamicProperty(name, JSON.stringify(obj))
	}
	clearDataEnt(name = "entitas") {
		this.entity.setDynamicProperty(name, JSON.stringify(this.raw))
	}
	// Effect Method
	addEffect(effectArray) {
		if(effectArray.length <= 0) return
		effectArray.forEach(({ name, duration, lvl, hide }) => {
		  let particle = hide || true
          this.entity.addEffect(EffectTypes.get(name), duration, { amplifier: lvl, showParticles: particle })
        })
	}
    hasEffect(array) {
        return array.reduce((all, cur) => this.player.hasEffect(cur) ? all.push(cur) : 0, []) || []
    }
    removeEffect(array) {
		array.forEach(i => this.entity.removeEffect(i))
	}
	hasDebuffEffect() {
	    // this.player.getEffects().forEach(f => console.warn(JSON.stringify(f.typeId)))
		return this.player.getEffects().some(e => ["weakness","blindness","slowness","mining_fatigue","darkness","poison","wither","instant_damage"].includes(e.typeId))
	}
    // Essentials Method
	runCommand(cmdArray) {
		cmdArray.forEach(cmd => this.entity.runCommand(cmd))
	}
	heal(amount = 1) {
		let hp = this.entity.getComponent("health")
		amount = Math.abs(amount)
	    hp.currentValue + amount >= hp.defaultValue ? hp.setCurrentValue(hp.defaultValue) : hp.setCurrentValue(hp.currentValue + amount)
	}
	knockback(vel, hor = 0, ver = 0) {
		if(!vel) return new Error("No Velocity")

		this.entity.applyKnockback(vel.x, vel.z, hor, ver)
	}
	dash(vel, hor, ver) {
		this.selfParticle("cz:dash_particle")
		this.knockback(vel, hor, ver)
	}
	addDamage(dmg = 1, cause = { cause: "entityAttack", damagingEntity: this.entity }, knock) {
		this.entity.applyDamage(Math.floor(dmg), cause)

		if(!knock) return
		this.knockback(knock.vel, knock.hor, knock.ver)
	}
	selfParticle(particle, location = this.entity.location) {
		if(!particle) return
		world.getDimension(this.entity.dimension.id).spawnParticle(particle, location)
	}
	particles(par) {
		par.forEach(e => this.selfParticle(e))
	}
	getEntityNearby(minDis = 1, maxDis = 0) {
		return world.getDimension(this.entity.dimension.id).getEntities({ maxDistance: maxDis, minDistance: minDis, excludeNames: [`${this.entity.name}`] })
	}
	impactParticle() {
		if(!this.entity.isOnGround) return
		this.particles(["cz:impact_up","cz:impact_p"])
	}
	removeTags(...tag) {
		tag.forEach(e => this.entity.removeTag(e))
	}
	healable(heal = 0, eff = []) {
		let tamed = this.entity.getComponent("minecraft:is_tamed") || undefined
		if(!["player", "cat", "yuri", "wolf"].includes(this.entity.typeId.split(":")[1])) return

		switch(heal.source) {
			case "catlye":
			  let hp = this.entity.getComponent("health")
			  hp.currentValue <= hp.defaultValue/4 ? heal += heal/2 : 0 ;
			  break;
		}

		this.heal(heal)
		this.addEffect(eff)
	}
	bind(dur = 0) {
		this.addEffect([{ name: "slowness", duration: dur*20, lvl: 255, hide: false }])
	}
	// Npc Method
	isNpc() {
		return this.entity.getComponent("minecraft:type_family")
	}
	npc() {
		if(this.isNpc() == false) return
		return new Npc(this.entity)
	}
	// Status Method
	status() {
		return new status(this.entity)
	}
	controllerStatus() {
		let sts = this.status()
		this.getDataEnt().status.filter(r => r.decay == "time").forEach(e => sts.minStatus(e.name, 0.25))
	}
	// Debug
	refreshEntity() {
		let tag = ["ultimate","liberator_target","silence","lectaze_target","fireing_zone","catlye_ult"]
		system.run(() => this.removeTags(...tag))
	}
	fixEntity() {
		let data = this.getDataEnt(), er = 0

        Object.keys(this.raw).forEach(e => {
        	if(!Object.keys(data).includes(e)) {
              data[e] = this.raw[e]
              er++
            }
        })
        if(er <= 0) return
        this.setDataEnt(data)
	}
}

// Main Class of Player Stat
export class Specialist extends Entity {
	/* CrzxaExe3---
	*
	*  Data of the player, will be saved inside minecraft world Dynamic Property
	*  let specialist = new Specialist(player)
	*
	*  @player are the player class from minecraft
	*  This have many method, and this is core of player mechanic
	*/
	constructor(player) {
		if(!player) throw new Error("Invalid Constructor of Player")
		super(player)
		this.player = player

		this.rawData = { 
          specialist: { lvl: 0, xp: 0 },
          reputation: 0,
          money: 0,
          temp: 32,
          dirty: 0,
          voxn: 0,
          stamina: { max: 100, value: 100, add: 0 },
          thirst: { max: 100, value: 100 },
          ult: [],
          cd: [],
          mastery: [],
          wpn: []
        }
	}

	// Data Method
	getData() {
		let data = this.rawData
		if(this.player.getDynamicProperty("specialist") !== undefined) data = JSON.parse(this.player.getDynamicProperty("specialist"))
		return data
	}
	setData(obj) {
		this.player.setDynamicProperty("specialist", JSON.stringify(obj))
	}
	clearData() {
		this.player.setDynamicProperty("specialist", JSON.stringify(this.rawData))
	}

	// Specialist Method
	addSpecialist(key, amount) {
		let data = this.getData(), lvlUp = Math.floor((data.specialist.lvl * 14) + 40 + (data.specialist.lvl * 8))
		data.specialist[key] = data.specialist[key] + Number(amount)

		if(key == "xp" && data.specialist[key] > lvlUp) {
			let vv = leveling(data.specialist.xp, data.specialist.lvl, (level) => Math.floor((level * 14) + 40 + (level * 8)));
			data.specialist.lvl = vv.lvl
			data.stamina.add = 2 * vv.lvl
			this.player.sendMessage(`Your Specialist Level Up to ${vv.lvl}`)
			data.specialist[key] = vv.xp
	    }
		this.setData(data)
	}
	async controllerActionBar(lib) {
		let act = [], item = await this.player.getComponent("inventory").container.getSlot(this.player.selectedSlotIndex) || { typeId: "" }, ammo = lib.endless[this.player.id] || 0, itemStack = new Items(item)
		let stamina = this.getStamina(), thirst = this.getThirst(), cd = this.cooldown().getCd("greatsword_crit"), cds = this.cooldown()

		try {
			let col = cds.getAllCd().filter(e => e.name.includes(item.typeId.split(":")[1]))
			col.forEach(r => act.push(`S-${r.name.replace(item.typeId.split(":")[1], "")} ${Math.round(r.duration)}s`))
			if(cd.error == true && itemStack.getTag().includes("greatsword")) act.push(`[+]`)
			if(Object.keys(lib.berserk).includes(this.player.id) && lib.berserk[this.player.id] !== undefined && lib.berserk[this.player.id] > 0 && item.typeId == "cz:berserk") act.push(`W-Harm ${lib.berserk[this.player.id]}`)
			if(Object.keys(lib.soul).includes(this.player.id) && lib.soul[this.player.id] !== undefined ) act.push(`${lib.soul[this.player.id]} Soul`)
			if(Object.keys(lib.catlye).includes(this.player.ud) && lib.catlye[this.player] >= 3 && item.typeId == "cz:catlye") act.push(`Skill 1 Upgrade`)
			if(Object.keys(lib.lectaze).includes(this.player.id) && lib.lectaze[this.player.id] > 0 && item.typeId == "cz:lectaze") act.push(`${lib.lectaze[this.player.id]} Creations`)
			if(world.scoreboard.getObjective("silent").getScore(this.player.scoreboardIdentity) > 0) act.push(`${world.scoreboard.getObjective("silent").getScore(this.player.scoreboardIdentity)} Leaf`)
			if(Object.keys(lib.skyler).includes(this.player.id) && lib.skyler[this.player.id] !== undefined && lib.skyler[this.player.id] > 0) act.push(`${lib.skyler[this.player.id]} Fireing`)
			if(item.typeId == "cz:endless") act.push(`Endless: ${ammo}/12`)
		} catch(e) {} //console.warn(e) }

        let display = act.join(" | ") || ""

		display !== "" ? this.player.onScreenDisplay.setActionBar({ text: display }) : 0
	}
	// Money Method
	getMoney() {
		return this.getData().money;
	};
	addMoney(amount) {
		let data = this.getData();
		data.money += Number(amount);
		this.setData(data);
	};
	takeMoney(amount) {
		this.addMoney(-Number(amount));
	};
	setMoney(amount) {
		let data = this.getData();
		data.money = Number(amount);
		this.setData(data);
	};
	resetMoney() {
		this.setMoney(this.rawData.money);
	};
	transferMoney(target, amount) {
		let data = new Specialist(target);
		amount = Number(amount);

		if(this.getMoney() < amount*1.2) return this.player.sendMessage({ rawtext: [{ translate: "system.transfer.outMoney" },{ text: `$${amount*1.2}`}]});
		data.addMoney(amount);
		target.sendMessage({ rawtext: [{ translate: "system.get" },{ text: ` $${amount} ` },{ translate: "system.from" },{ text: ` ${this.player.name}` }]});
		this.takeMoney(amount*1.2);
		this.player.sendMessage({ rawtext: [{ translate: "system.spend" },{ text: `$${amount*1.2} ` },{ translate: "system.transfer.to" },{ text: `${target.name}` }]});
	};
	// Voxn Method
	getVoxn() {
		return this.getData().voxn
	}
	addVoxn(amount) {
		let data = this.getData()
		data.voxn += Number(amount)
		this.setData(data)
	}
	minVoxn(amount) {
		this.addVoxn(-Number(amount))
	}
	setVoxn(amount) {
		let data = this.getData()
		data.voxn = Number(amount)
		this.setData(data)
	}
	resetVoxn() {
		this.setMoney(this.rawData.voxn)
	}
	// Temperature Method
	temp() {
		return new Temp(this.player)
	}
	controllerTemp() {
		
	}
	// Stamina Method
	getStamina() {
		return this.getData().stamina;
	};
	addStamina(key, amount) {
		if(["creative","spectator"].includes(this.player.getGameMode()))
		  return;

		let data = this.getData(), total = data.stamina[key] + Number(amount);
		if(key == "value" && total <= 0) total = 0;

		data.stamina[key] = total;
		this.setData(data);
	};
	minStamina(key, amount) {
		this.addStamina(key, -Number(amount));
	};
	setStamina(key, value) {
		let data = this.getData();

		data.stamina[key] = Number(value);
		this.setData(data);
	};
	setValueDefaultStamina() {
		this.setStamina("value", this.getStamina().max + this.getStamina().add);
	};
	controllerStamina({ options }) {
		if(["creative","spectator"].includes(this.player.getGameMode()))
		  return;

		let data = this.getStamina(), stm = options.staminaRecovery || 1.5, runOut = options.staminaRun || 1, cd = this.cooldown(), sts = this.status();
		let down = sts.getStatusBy({ type: "stamina_down" }), exhaust = sts.getStatusBy({ type: "stamina_exhaust" }), up = sts.getStatusBy({ type: "stamina_up" }), additional = data.add || 0;

		if(this.player.isSprinting == true || this.player.isSwimming == true) {
			data.value - runOut <= 0 ? this.setStamina("value", 0) : stm = -runOut;
			if(options.staminaCooldown) cd.setCd("stamina_regen", options.staminaExhaust || 3);
		} else {
            if(data.value + stm > data.max + additional) {
              this.setStamina("value", data.max + additional);
              stm = 0;
            } else cd.getCd("stamina_regen").error == undefined ? stm = 0 : 0;
        }

		if(data.value <= 10) {
          this.player.addEffect(EffectTypes.get("slowness"), 26, { amplifier: 2 });
          if(data.value <= 0) this.player.addEffect(EffectTypes.get("poison"), 25, { amplifier: 3 });
        }
        if(stm !== 0) this.addStamina("value", Number(stm).toFixed(2));
	};
	resetStamina(key) {
		let data = this.getData();

		if(key == "max" && data.stamina.value > this.rawData.stamina.max) this.setStamina("value", this.rawData.stamina.max);
        this.setStamina(key, this.rawData.stamina[key]);
	};
	resetAllStamina() {
		this.setStamina("max", this.rawData.stamina.max);
		this.setStamina("value", this.rawData.stamina.value);
	};
	// Thirst Method
	getThirst() {
		return this.getData().thirst;
	};
	addThirst(key, amount) {
		let data = this.getData();

        let total = data.thirst[key] + Number(amount);
		if((key == "value") && total > data.thirst.max) total = data.thirst.max;
		if(key == "value" && total <= 0) total = 0;

		data.thirst[key] = total;
		this.setData(data);
	};
	minThirst(key, amount) {
	    this.addThirst(key, -Number(amount));
	};
	setThirst(key, value) {
		let data = this.getData();
		data.thirst[key] = Number(value);
		this.setData(data);
	};
	setValueDefaultThirst() {
		this.setThirst("value", this.getThirst().max);
	};
	controllerThirst() {
		if(["creative","spectator"].includes(this.player.getGameMode()))
		  return;

		let data = this.getThirst(), minus = 0.003, status = this.status(), thirstEff = status.getStatusBy({ type: "thirst" }) || { lvl: 0 };

		if(this.player.isSprinting) minus = minus + 0.03;
		if(this.player.dimension.id.split(":")[1] == "nether") minus += 0.02;
		if(data.value <= 0) this.addEffect([{ name: "nausea", duration: 25, lvl: 2 }, { name: "poison", duration: 25, lvl: 3 }]);
		minus += Number(thirstEff.lvl)*0.02;

		this.minThirst("value", minus);
	};
	resetThirst(key) {
		let data = this.getData();

		if(key == "max" && data.thirst.value > this.rawData.thirst.max) this.setThirst("value", this.rawData.thirst.max);
		this.setThirst(key, this.rawData.thirst[key]);
	};
	resetAllThirst() {
		this.setThirst("max", this.rawData.thirst.max);
		this.setThirst("value", this.rawData.thirst.value);
	};
	// Reputation Method
	getRep() {
		return this.getData().reputation;
	};
	addRep(amount) {
		let data = this.getData();
		data.reputation +=  Number(amount);
		if(data.reputation <= 0) data.reputation = 0;
		this.setData(data);
	};
	minRep(amount) {
		this.addRep(-Number(amount));
	};
	setRep(value) {
		let data = this.getData();
		data.reputation = Number(value);
		this.setData(data);
	};
	resetRep() {
		this.setRep(this.rawData.reputation);
	};
	// Dirtyness Method
	dirtyness() {
		return new Dirty(this.player)
	}
	// Template Skill
	async impactSkill(dmg, lib, func) {
		if(!lib.single) lib.single = false
		let dash = lib.ver || 0

		lib.sp.knockback(lib.vel, 0, 0.8)
		system.runTimeout(() => {
			lib.sp.knockback(lib.velocity, dash, -3.7)
			this.bind(0.7)
			system.runTimeout(() => {
				lib.sp.impactParticle()
				if(lib.single == true) {
					world.getDimension(this.player.dimension.id).getEntities({ location: this.player.location, maxDistance: 6, minDistance: 0, excludeNames: [`${this.player.name}`]}).forEach(e => {
			        	let ent = new Entity(e)
			            ent.addDamage(dmg * lib.multiplier, { cause: "entityAttack", damagingEntity: this.player })
			        })
				} else {
					if(!lib.ent) return
					lib.ent.addDamage(dmg * lib.multiplier, { cause: "entityAttack", damagingEntity: this.player })
				}
				if(typeof func === 'function') func.call()
			}, 4)
		}, 16)
	}
	// Player Method
	getItemCount(name) {
		let count = 0, container = this.player.getComponent("inventory").container
		for(let i = 0; i <= container.size ; i++) {
			try {
			  let item = container.getSlot(i) || undefined 
			  if(item === undefined) return
			  item.typeId.split(":")[1] == name ? count += amount : 0;
			} catch(err) {}
		}
		return count
	}
	giveItem(arrayItem) {
		let container = this.player.getComponent("inventory").container
		arrayItem.forEach(({ id, amount }) => {
			let itemStack = new ItemStack(id)
			itemStack.amount = amount || 1
			container.addItem(itemStack)
        })
	}
	refreshPlayer() {
		this.refreshEntity()
		this.fixPlayer()
	}
	fixPlayer() {
		let data = this.getData(), er = 0

        Object.keys(this.rawData).forEach(e => {
        	if(!Object.keys(data).includes(e)) {
              data[e] = this.rawData[e]
              er++
            }
        })
        if(er <= 0) return
        this.setData(data)
	}
	controllerUi({ options }) {
		let data = this.getData(), maps = new Game(world), stamina = this.getStamina(), thirst = this.getThirst(), day = world.getDay(), time = Math.floor(Number((world.getTimeOfDay()/10).toFixed(0)) + 600), status = this.status().getAll(), sts = "", spMax = Math.floor((data.specialist.lvl * 5) + 34 + (data.specialist.lvl *12)), perXp = Number(data.specialist.xp / spMax * 100).toFixed(2);
		time >= 2400 ? time = Math.floor(time - 2400) : 0
		let dis = String(time).split("").reverse();

		if(!dis[1]) dis[1] = 0
		if(!dis[2]) dis[2] = 0
		if(!dis[3]) dis[3] = 0

		let mm = String(Math.round((Number(`${dis[1]}${dis[0]}`) / 100) * 60)).split("").reverse()
		if(!mm[1]) mm[1] = 0
		
		if(Number(String(dis[3]) + String(dis[2])) < 6) day++
		if(status.length > 0) sts += "\nStatus"

		status.forEach(e => {
			let lvl = ""

			switch(e.type) {
				case "damage": lvl = ` +${e.lvl}% Atk`; break;
				case "skill": lvl = ` +${e.lvl}% Skill`; break;
			}

			sts += `\n${(e.name.charAt(0).toUpperCase() + e.name.slice(1)).replaceAll("_", " ")}${lvl} | ${(e.duration).toFixed(0)}s`
		})
		
        let disText = `${dis[3]}${dis[2]}:${mm[1]}${mm[0]}`
		this.player.onScreenDisplay.setTitle(`cz:ui ${this.player.name}
          (${perXp}%) ${data.specialist.xp.toFixed(1)} XP | Lvl ${data.specialist.lvl} <SP
          $${data.money.toFixed(1)}
          §b§l${data.voxn} Voxn§r
          §eS ${Math.round(stamina.value/(stamina.max + stamina.add) * 100)}% §b T ${Math.round(thirst.value/thirst.max * 100)}%§r
          §f${this.temp().getTemp()}° D ${this.dirtyness().getVal()}% Rep ${this.getRep()} AP ${maps.getOnlineCount()}
          ${data.specialist.lvl >= 8 || !options.uiLevelRequirement ? this.player.getBlockFromViewDirection({ maxDistance: 6 })?.block?.type.id ? this.player.getBlockFromViewDirection({ maxDistance: 6 })?.block?.type.id : "minecraft:air" : ""}${data.specialist.lvl >= 10 || !options.uiLevelRequirement ? "\nDay "+day+" | "+disText : ""}
          ${sts}
        `, 
         {fadeInDuration: 0, fadeOutDuration: 0, stayDuration: 0}
        )
	}
	// Ultimate Method
	getUltimate() {
		return new Ultimate(this.player)
	}
	// Cooldown
	cooldown() {
		return new Cooldown(this.player)
	}
	controllerCooldown() {
		let cd = this.cooldown(), data = cd.getData()
        data.cd.forEach(e => cd.minCd(e.name, 0.25))
	}
}

// CrzxaExe3--