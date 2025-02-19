import { EffectTypes, ItemStack, system, world, Player } from "@minecraft/server";
import { Dirty, Ench, Game, leveling, Temp, Entity, Items, Cooldown } from "./lib/ZxraLib/module.js";
import { Npc } from "./lib/npc-class.js";
import * as data from "./lib/data.js";

// Main Class of Block UI
export class BlockUi {
	static blocks = []

	static addBlock(block, callback, item) {
		this.blocks.push({ block, item, callback })
	}
}
// Spawn Particle
export function spawnParticles(particle, dimension, location) {
	world.getDimension(dimension).spawnParticle(particle, location)
}

// Classes

// Block Class
export class Tile {
	constructor(block) {
		if(!block) throw new Error("Invalid block")
		this.block = block
		this.world = new Game()
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
		let data = this.data.getData();
		amount= Number(amount)

		if(this.getPower() == undefined) return
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
		let data = this.data.getData();

		if(this.getPowerStatus() == undefined) return Error("Not power block")
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

// Main Class of Player Stat
export class Specialist {
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
		let data = this.getData(),
           lvlUp = Math.floor((data.specialist.lvl * 18) + 40 + (data.specialist.lvl * 10))
		data.specialist[key] = data.specialist[key] + Number(amount)

		if(key == "xp" && data.specialist[key] > lvlUp) {
			let vv = leveling(data.specialist.xp, data.specialist.lvl, (level) => Math.floor((level * 18) + 40 + (level * 10)));
			data.specialist.lvl = vv.lvl
			data.stamina.add = 2 * vv.lvl
			this.player.sendMessage(`Your Specialist Level Up to ${vv.lvl}`)
			data.specialist[key] = vv.xp
	    }
		this.setData(data)
	}
	async controllerActionBar(lib) {
		let act = [], item = this.player.getComponent("inventory").container.getSlot(this.player.selectedSlotIndex) || { typeId: "" }, ammo = lib.endless[this.player.id] || 0, itemStack = new Items(item)
		let stamina = this.getStamina(), thirst = this.getThirst(), cd = this.cooldown().getCd("greatsword_crit")

		try {
			if(cd.error == true && itemStack.getTag().includes("greatsword")) act.push(`<+>`)
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
		this.setVoxn(this.rawData.voxn)
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
		if((["creative","spectator"].includes(this.player.getGameMode()) && amount < 1) || this.status().getAllStatusBy({ type: "st_stuck" }).length > 0 )
		  return;

		let data = this.getData(), total = data.stamina[key] + Number(amount);
		if(key == "value" && total <= 0) total = 0;

		data.stamina[key] = total;
		this.setData(data);
	};
	minStamina(key, amount) {
		if(this.status().getAllStatusBy({ type: "st_stuck" }).length > 0) return;
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
		let data = this.getStamina(),
          stm = options.staminaRecovery || 1.5,
          runOut = options.staminaRun || 1,
          cd = this.cooldown(),
          sts = this.status(),
		  exhaust = sts.getAllStatusBy({ type: "stamina_exhaust" }),
          up = sts.getAllStatusBy({ type: "stamina_up" }),
          additional = data.add || 0;

		if(this.player.isSprinting == true || this.player.isSwimming == true) {
			data.value - runOut <= 0 ? this.setStamina("value", 0) : stm = -runOut;
			if(options.staminaCooldown) cd.addCd("stamina_regen", options.staminaExhaust || 3);
		} else {
            if(data.value + stm > data.max + additional) {
              this.setStamina("value", data.max + additional);
              stm = 0;
            } else cd.hasCd("stamina_regen") ? stm = 0 : 0;
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

		let data = this.getThirst(),
          minus = 0.003,
          thirstEff = this.status().decimalCalcStatus({ type: "thirst" }, 1, 0.01);

		if(this.player.isSprinting) minus = minus + 0.03;
		if(this.player.dimension.id.split(":")[1] == "nether") minus += 0.02;
		if(data.value <= 0) this.addEffect([{ name: "nausea", duration: 25, lvl: 2 }, { name: "poison", duration: 25, lvl: 3 }]);
		minus += Number(thirstEff)*0.02;

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
	async impactSkill(dmg, { single, ver, velocity, sp, ent, multiplier }, func) {
		if(!single) single = false

		sp.knockback(vel, 0.1, 0.8)
		system.runTimeout(() => {
			sp.knockback(velocity, ver || 0, -8.7)
			this.bind(0.7)
			system.runTimeout(() => {
				sp.impactParticle()
				if(single !== true) {
					world.getDimension(this.player.dimension.id).getEntities({ location: this.player.location, maxDistance: 6, minDistance: 0, excludeNames: [`${this.player.name}`], excludeTypes: ["minecraft:item","cz:indicator"]}).forEach(e => {
			        	new Entity(e).addDamage(dmg * multiplier, { cause: "entityAttack", damagingEntity: this.player })
			        })
				} else {
					if(!ent) return
					ent.addDamage(dmg * multiplier, { cause: "entityAttack", damagingEntity: this.player })
				}
				if(typeof func === 'function') func.call()
			}, 3)
		}, 15)
	}
	// Player Method
	getItemCount(name) {
		let count = 0, container = this.player.getComponent("inventory").container
		for(let i = 0; i < container.size ; i++) {
			try {
			  let item = container.getSlot(i) || undefined 
			  if(item === undefined) continue
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
	getItems() {
		let arr = [], container = this.player.getComponent("inventory").container
		for(let i = 0; i < container.size ; i++) {
			try {
			  let item = container.getSlot(i)?.getItem() || undefined
			  if(item === undefined) continue;

			  const findIndex = arr.findIndex(e => e.name == item.typeId.split(":")[1]);
			  if(findIndex == -1) {
				arr.push({ name: item.typeId.replace("minecraft:", ""), amount: item.amount || 1 })
				continue;
			  }
			
			  arr[findIndex].amount += item.amount || 1;
			} catch(err) {
				console.warn(err)
            }
		}
		return arr
	}
	setItem(item, amount = 1) {
		let newItem = new ItemStack(item);
		newItem.amount = amount
		this.player.getComponent("inventory").container.setItem(this.player.selectedSlotIndex, newItem)
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
	async controllerUi({ options }) {
		try {
		let data = this.getData(), maps = new Game(world), stamina = this.getStamina(), thirst = this.getThirst(), day = world.getDay(), time = Math.floor(Number((world.getTimeOfDay()/10).toFixed(0)) + 600), status = this.status().getAll(), spMax = Math.floor((data.specialist.lvl * 14) + 40 + (data.specialist.lvl * 8)), perXp = Number(data.specialist.xp / spMax * 100).toFixed(2);
		time >= 2400 ? time = Math.floor(time - 2400) : 0
		let dis = String(time).split("").reverse();

		if(!dis[1]) dis[1] = 0
		if(!dis[2]) dis[2] = 0
		if(!dis[3]) dis[3] = 0

		let mm = String(Math.round((Number(`${dis[1]}${dis[0]}`) / 100) * 60)).split("").reverse()
		if(!mm[1]) mm[1] = 0
		
		if(Number(String(dis[3]) + String(dis[2])) < 6) day++

		let sts = status
		  .sort((a,b) => b.duration - a.duration)
          .reduce((all, cur) => {
			 let lvl = ""

			 switch(cur.type) {
				case "damage": lvl = ` +${cur.lvl}% Atk`; break;
				case "skill": lvl = ` +${cur.lvl}% Skill`; break;
				case "stack": lvl = ` > ${cur.lvl}`; break;
		 	}

			 all += `${cur.name.split("_").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ")}${lvl} | ${(cur.duration).toFixed(0)}s\n`
		 	return all
	      }, status.length > 0 ? "\nStatus\n" : "")

	    let cd = this.cooldown().getAllCd()
	      .sort((a,b) => b.duration - a.duration)
          .reduce((all, cur) => {
		    all += `\n${cur.name.split("_").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ")} ${cur.duration.toFixed(2)}s`
		    return all
	      }, this.cooldown().getAllCd().length > 0 ? "\nCooldown" : "")
		
        let disText = `${dis[3]}${dis[2]}:${mm[1]}${mm[0]}`
		this.player.onScreenDisplay.setTitle(`cz:ui ${this.player.name}
          (${perXp}%) ${data.specialist.xp.toFixed(1)} XP | Lvl ${data.specialist.lvl} <SP
          $${data.money.toFixed(1)}
          §b§l${data.voxn} Voxn§r
          §eS ${Math.round(stamina.value/(stamina.max + stamina.add) * 100)}% §b T ${Math.round(thirst.value/thirst.max * 100)}%§r
          §f${this.temp().getTemp()}° D ${this.dirtyness().getVal()}% Rep ${this.getRep()} AP ${maps.getOnlineCount()}
          ${data.specialist.lvl >= 8 || !options.uiLevelRequirement ? this.player.getBlockFromViewDirection({ maxDistance: 6 })?.block?.type.id ? this.player.getBlockFromViewDirection({ maxDistance: 6 })?.block?.type.id : "minecraft:air" : ""}${data.specialist.lvl >= 10 || !options.uiLevelRequirement ? "\nDay "+day+" | "+disText+"\n" : ""}${sts}${cd}
        `, 
         {fadeInDuration: 0, fadeOutDuration: 0, stayDuration: 0}
        )
        } catch(error) { console.warn(error)}
	}
	// Cooldown
	cooldown() {
		return new Cooldown(this)
	}
	controllerCooldown() {
		let cd = this.cooldown(), data = cd.getAllCd()
        data.forEach(e => cd.minCd(e.name, 0.25))
	}
}

// CrzxaExe3--