import {
  Cooldown,
  Dirty,
  Entity,
  Game,
  Temp,
  leveling,
  mergeObject,
  rawSpecialist
} from "../module.js";
import {
  Player,
  ItemStack,
  system,
  world
} from "@minecraft/server";

class Specialist extends Entity {
  constructor(player) {
    if(!player) throw new Error("Invalid Player");
    if(!(player instanceof Player)) throw new Error("Not Player class");

    super(player)
    this.player = player
  }

  // Data Method
  getData() {
    return this.getDataEnt("specialist", rawSpecialist);
  }
  setData(obj) {
    if(!obj) return;
    this.setDataEnt(obj, "specialist");
  }
  clearData() {
    this.setData(rawSpecialist);
  }
  
  // Controller Method
  controllerActionBar(lib) {
    const arr   = [],
      container = this.getComponent("inventory").container,
      item      = container.getSlot(this.player.selectedSlotIndex)?.getItem(),
      itemName  = item?.typeId.split(":")[1] || "",
      cooldown  = this.cooldown();

    const {
      berserk = {},
      catlye  = {},
      endless = {},
      lectaze = {},
      skyler  = {},
      soul    = {}
    } = lib;

    // Actionbar
    if(item?.hasTag("greatsword") && !cooldown.hasCd("greatsword_crit")) arr.push("<+>");
    if(itemName === "liberator" && soul[this.player.id]) arr.push(`${soul[this.player.id]} Soul`);
    if(itemName === "skyler" && skyler[this.player.id]) arr.push(`${skyler[this.player.id]} Fireing`);

    if(arr.length < 1) return;

    const display = arr.join(" | ");
    this.player.onScreenDisplay.setActionBar({ text: display });
  }
  controllerCooldown() {
    const cd = this.cooldown()
    cd.getAllCd().forEach(e => cd.minCd(e.name, 0.25));
  }
  controllerStamina({ options }) {
    const data = this.getStamina(),
      recovery = parseInt(options.staminaRecovery || 1.5),
      drop     = parseInt(options.staminaRun || 1);

    const cd = this.cooldown(),
      status = this.status();

    let use = 0;

    if(data.value < 10) this.addEffect({ name: "slowness", duration: 0.5, lvl: 0 });
    if(data.value <= 0) {
      this.addEffect({ name: "poison", duration: 6, lvl: 2 });
      status.addStatus("tired", 10, { type: "none", decay: "time", lvl: 0, stack: false });
    }

    if(status.getAllStatusBy({ type: "stamina_stuck" }).length > 0) return;

    if(this.player.isSprinting || this.player.isSwimming) {
      use = -drop;
      if(options.staminaCooldown) cd.addCd("stamina_regen", options.staminaExhaust || 3)
      if(data.value < drop) {
        this.setStamina("value", 0);
        return;
      }
    }
    
    if(!cd.hasCd("stamina_regen")) {
      use = Number(recovery * status.decimalCalcStatus({ type: "stamina_up" }, 1, 0.01)).toFixed(2);
    }

    if(data.value + Number(use) > data.max + data.add) {
      this.setStamina("value", data.max + data.add);
      return;
    }

    if(cd.hasCd("stamina_regen") && use > 0) return;
    this.addStamina("value", use - (status.getAllStatusBy({ name: "tired" }).length > 0 ? 0.5 : 0);
  }
  controllerTemp() {}
  controllerThirst({ options }) {
    if(["creative","spectator"].includes(this.player.getGameMode())) return;

    const data = this.getData(),
      status = this.status();
    
    if(data.thirst.value < 1) this.addEffectOne("nausea", 0.5, 0, false);
    
    let drop = options.thirstDown || 0.003;

    if(this.player.isSprinting) drop += Number(0.028);
    if(status.getStatusBy({ name: "tired" }).length > 0) drop += Number(0.013);
    if(this.player.dimension.id.split(":")[1] === "nether") drop += Number(0.02);

    drop += Number(status.decimalCalcStatus({ type: "thirsty" }, 0, 0.03));

    this.minThirst("value", Number(drop).toFixed(3));
  }
  controllerUi({ options }) {
    const data = this.getData(),
      game     = new Game(),
      guild    = game.guild()
        .gd()
        .find(e => e.member.some(r => r.id === this.player.id));

    const {
      specialist: { xp, lvl },
      thirst: { value: thirstValue, max: thirstMax },
      stamina: { value: staminaValue, max: staminaMax, add: staminaAdd },
      money,
      voxn,
      reputation,
      cd
    } = data;

    const sts = this.getDataEnt().status
      .sort((a,b) => b.duration - a.duration)
      .reduce((all, cur) => {
		 let lvl = ""

		 switch(cur.type) {
			case "damage": lvl = ` +${cur.lvl}% Atk`; break;
			case "skill": lvl = ` +${cur.lvl}% Skill`; break;
			case "stack": lvl = ` > ${cur.lvl}`; break;
			case "state": lvl = ``; break;
	 	}

		 all += `${cur.name.split("_").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ")}${lvl}${cur.decay === "time" ? "| "+(cur.duration).toFixed(0)+"s" : ""}\n`
	 	return all
      }, this.getDataEnt().status.length > 0 ? "\n \nStatus\n" : "")
    
    const cooldown = cd
      .sort((a,b) => b.duration - a.duration)
      .reduce((all, cur) => {
        all += `\n${cur.name.split("_").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ")} ${cur.duration.toFixed(2)}s`
        return all
      }, cd.length > 0 ? `${this.getDataEnt().status.length > 0 ? "" : "\n "}\nCooldown` : "")

    const xpPercentage = (xp, lvl) => (xp / Math.floor(lvl * 18 + 40 + lvl * 10)) * 100;

    this.player.onScreenDisplay.setTitle(`cz:ui ${this.player.name}
    §s${xpPercentage(xp, lvl).toFixed(1)}% ${xp} XP§f - §e${lvl}§f [Specialist]${!guild ? "" : "\n" + guild?.act.xp + "XP - " + guild?.act.lvl + " [" + guild?.name + "§r§f]"}

    §e$${money}§f | §b§l${voxn} Voxn§r§f
    §eS ${Math.round(staminaValue / (staminaMax + staminaAdd) * 100).toFixed(0)} §bT ${Math.round(thirstValue / thirstMax * 100).toFixed(0)}§f
    Rep ${reputation} AP ${game.getOnlineCount()}
    ${data.specialist.lvl >= 8 || !options.uiLevelRequirement ? this.player.getBlockFromViewDirection({ maxDistance: 6 })?.block?.type.id ? this.player.getBlockFromViewDirection({ maxDistance: 6 })?.block?.type.id : "minecraft:air" : ""}${sts}${cooldown}
    `,
    { fadeInDuration: 0, fadeOutDuration: 0, stayDuration: 0 }
    )
  }

  // Specialist Method
  addSpecialist(key, amount = 0) {
    if(!key) return;
    if(!Object.keys(rawSpecialist.specialist).includes(key)) return;

    const data = this.getData(),
      // Leveling calculation for move to next lvl
      lvlUpCalc = (lvl) => Math.floor(lvl * 18 + 40 + lvl * 10);

    if(key === "xp" && data.specialist[key] + amount > lvlUpCalc(data.specialist.lvl)) {
      const levelingChain = leveling(data.specialist.xp, data.specialist.lvl, (lvl) => Math.floor(lvl * 18 + 10 + lvl * 10));

      data.specialist.lvl = levelingChain.lvl;
      data.specialist.xp = levelingChain.xp;
      
      data.stamina.max = 100 + levelingChain.lvl
      
      this.player.sendMessage({ translate: "system.levelUp", with: [String(levelingChain.lvl)] });
    } else {
      data.specialist[key] += amount;
    }

    this.setData(data);
  }
  setSpecialist(key, value = 0) {
    if(!key) return;
    if(!Object.keys(rawSpecialist.specialist).includes(key)) return;

    const data = this.getData();
    data.specialist[key] = value;

    this.setData(data);
  }

  // Money Method
  getMoney() {
    return this.getData().money;
  }
  addMoney(amount = 0) {
    const data = this.getData();
    data.money += Number(amount);
    this.setData(data);
  }
  takeMoney(amount = 0) {
    this.addMoney(-amount);
  }
  setMoney(value = 0) {
    const data = this.getData();
    data.money = Number(value);
    this.setData(data);
  }
  resetMoney() {
    this.setMoney(rawSpecialist.money);
  }
  transferMoney(otherPlayer, amount = 0) {
    if(!otherPlayer) return;
    if(!(otherPlayer instanceof Player)) return;

    const sp = new Specialist(otherPlayer);

    if(this.getMoney() < amount*1.1) {
      this.player.sendMessage({ translate: "system.transfer.outMoney", with: [amount*1.1] });
      return;
    }

    this.takeMoney(amount*1.1);
    sp.addMoney(amount);

    this.player.sendMessage({ translate: "system.transfer.from", with: [String(amount*1.2), otherPlayer.name] });
    otherPlayer.sendMessage({ translate: "system.transfer.to", with: [String(amount), this.player.name] });
  }

  // Voxn Method
  getVoxn() {
    return this.getData().voxn;
  }
  addVoxn(amount = 0) {
    const data = this.getData();
    data.voxn += Number(amount);
    if(data.voxn < 0) data.voxn = 0;
    this.setData(data);
  }
  minVoxn(amount = 0) {
    this.addVoxn(-amount);
  }
  setVoxn(value = 0) {
    if(value < 0) return;
    const data = this.getData();
    data.voxn = Number(value);
    this.setData(data);
  }
  resetVoxn() {
    this.setVoxn(rawSpecialist.voxn);
  }

  // Stamina Method
  getStamina() {
    return this.getData().stamina;
  }
  addStamina(key, amount = 0) {
    if(!key) return;
    if(!Object.keys(rawSpecialist.stamina).includes(key)) return;
    if(
      (["creative","spectator"].includes(this.player.getGameMode()) && amount <= 0) ||
      this.status().getAllStatusBy({ type: "stamina_stuck" }).length > 0
    ) return;

    const data = this.getData();
    data.stamina[key] += Number(amount);

    if(key === "value" && data.stamina[key] < 0) data.stamina[key] = 0;
    if(data.stamina.value < 0) data.stamina.value = 0;

    this.setData(data);
  }
  minStamina(key, amount = 0) {
    if(!key) return;
    if(!Object.keys(rawSpecialist.stamina).includes(key)) return;

    this.addStamina(key, -amount);
  }
  setStamina(key, value = 0) {
    if(!key || value < 0) return;
    if(!Object.keys(rawSpecialist.stamina).includes(key)) return;

    const data = this.getData();

    data.stamina[key] = value;
    this.setData(data);
  }
  resetStamina(key) {
    if(!key) return;

    this.setStamina(key, rawSpecialist.stamina[key]);
    if(this.getStamina().value >= this.getStamina().max)
      this.setStamina("value", rawSpecialist.stamina[key]);
  }
  resetAllStamina(withEffective = false) {
    this.setStamina("value", rawSpecialist.stamina.value);
    this.setStamina("max", rawSpecialist.stamina.value);
    if(!withEffective) this.setStamina("add", 0);
  }
  setValueDefaultStamina() {
    this.setStamina("value", this.getStamina().max + this.getStamina().add);
  }

  // Thirst Method
  getThirst() {
    return this.getData().thirst;
  }
  addThirst(key, amount = 1) {
    if(!key) return;
    const data = this.getData();

    let value = data.thirst[key] + Number(amount);

    if(key === "value" && data.thirst[key] < amount) value = 0;

    if(value > data.thirst.max * 1.1) value = data.thirst.max * 1.1;
    data.thirst[key] = Number(value);

    this.setData(data)
  }
  minThirst(key, amount = 1) {
    if(!key) return;
    this.addThirst(key, -Number(amount));
  }
  setThirst(key, value = 1) {
    if(!key) return;

    const data = this.getData();
    data.thirst[key] = value;
    this.setData(data);
  }
  resetThirst(key) {
    if(!key) return;

    this.setThirst(key, rawSpecialist.thirst[key]);
    if(this.getThirst().value > this.getThirst().max)
      this.setThirst("value", this.getThirst().max);
  }
  resetAllThirst() {
    this.setThirst("value", rawSpecialist.thirst.value);
    this.setThirst("max", rawSpecialist.thirst.max);
  }
  setDefaultValueThirst() {
    this.setThirst("value", this.getThirst().max);
  }

  // Temp Method
  temp() {
    return new Temp(this);
  }

  // Reputation Method
  getRep() {
    return this.getData().reputation;
  }
  addRep(amount = 0) {
    const data = this.getData();
    data.reputation += amount;
    if(data.reputation < 0) data.reputation = 0;
    this.setData(data);
  }
  minRep(amount = 0) {
    this.addRep(-amount);
  }
  setRep(value = 0) {
    if(value < 0) return;
    const data = this.getData();
    data.reputation = value;
    this.setData(data);
  }
  resetRep() {
    this.setRep(rawSpecialist.reputation);
  }

  // Dirtyness Method
  dirtyness() {
    return new Dirty(this);
  }

  // Cooldown Method
  cooldown() {
    return new Cooldown(this);
  }

  // Skill Method
  impactSkill(dmg = 1, { single = false, ver = 0, velocity, ent, multiplier = 1, team = [this.player.name], cause = "entityAttack" }, impactFunction) {
    if(single && !ent) return;

    if(!velocity) velocity = this.player.getVelocity;

    this.knockback(velocity, 0.1, 0.8);
    system.runTimeout(() => {
      this.knockback(velocity, ver, -8.7);
      this.bind(0.7);

      system.runTimeout(() => {
        this.impactParticle();

        if(!single) {
          world.getDimension(this.player.dimension.id).getEntities({ location: this.player.location, maxDistance: 6, minDistance: 0, excludeNames: [...team], excludeTypes: ["minecraft:item","cz:indicator"]}).forEach(e => {
        	new Entity(e).addDamage(dmg * multiplier, { cause, damagingEntity: this.player })
          })
        } else {
          ent.addDamage(dmg * multiplier, { cause: "entityAttack", damagingEntity: this.player })
        }

        if(typeof impactFunction === 'function') impactFunction?.();
      }, 4);
    }, 15);
  }

  // Player Method
  getItems() {
    const arr   = [],
      container = this.getComponent("inventory").container;

    for(let i = 0; i < container.size; i++) {
      try {
        const item = container.getSlot(i)?.getItem();
        if(!item) continue;

        const findIndex = arr.findIndex(e => e.name === item.typeId.replace("minecraft:",""));
        if(findIndex === -1) {
          arr.push({ name: item.typeId.replace("minecraft:", ""), amount: item.amount || 1 });
          continue;
        }
        arr[findIndex].amount += item.amount || 1;
      } catch (error) {}
    }
  }
  getItemCount(name) {
    if(!name) return;
    const count = 0,
      container = this.getComponent("inventory").container;

    for(let i = 0; i < container.size; i++) {
      try {
        const item = container.getSlot(i);
        if(!item) continue;
        if(item.typeId.split(":")[1] === name) count += item.amount || 1;
      } catch(error) {}
    }

    return count;
  }
  giveItem(items) {
    if(!items) return;
    const container = this.getComponent("inventory").container;

    if(Array.isArray(items)) {
      items.forEach(item => {
        if(typeof item !== "object") return;

        const { id, amount = 1 } = item;
        if(!id) return;

        const newItem = new ItemStack(id);
        newItem.amount = amount;
        container.addItem(newItem);
      })
      return;
    }
    
    if(typeof items !== "object") return;
    const { id, amount = 1 } = items;
    if(!id) return;

    const newItem = new ItemStack(id);
    newItem.amount = amount;
    container.addItem(newItem);
  }
  setItem(name, amount = 1) {
    if(!name) return;
    const newItem = new ItemStack(name);
    newItem.amount = amount;
    this.getComponent("inventory").container.setItem(this.player.selectedSlotIndex, newItem);
  }
  setSlot(slot, item) {
    if(!slot || !item) return;
    if(slot < 0 || slot > 35) return;

    this.getComponent("inventory").container.setItem(slot, item);
  }

  // Misc Method
  fixPlayer() {
    this.setData(mergeObject(rawSpecialist, this.getData()));
  }
  refreshPlayer() {
    this.refreshEntity();
    this.fixPlayer();
  }
}

export { Specialist };