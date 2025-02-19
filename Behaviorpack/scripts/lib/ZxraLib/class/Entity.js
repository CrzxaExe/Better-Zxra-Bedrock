import { Game, mergeObject, Status } from "../module.js";
import { EffectTypes, MolangVariableMap, system, world } from "@minecraft/server";
import { Npc } from "../../npc-class.js";

class Entity {
  constructor(entity) {
    if(!entity) throw new Error("Invalid Entity");
    this.entity = entity;
  }

  // Data Method
  getDataEnt(name = "entitas", defaultValue = { status: [] }) {
	return this.entity.getDynamicProperty(name) ? JSON.parse(this.entity.getDynamicProperty(name)) : defaultValue;
  }
  setDataEnt(obj, name = "entitas") {
    if(!obj) return;
	this.entity.setDynamicProperty(name, JSON.stringify(obj));
  }
  clearDataEnt(name = "entitas", defaultValue = { status: [] }) {
	this.entity.setDynamicProperty(name, JSON.stringify(defaultValue));
  }

  // Validation
  is(type) {
    if(!type) return;
    return this.entity.typeId.split(":")[1] === type;
  }
  isTeammate(id) {
    if(!this.is("player")) return;
    return new Game().guild().getTeammate(id).some(e => e.id === this.entity.id);
  }

  // Family Method
  family() {
    return this.entity.getComponent("minecraft:type_family");
  }
  getFamily() {
    return this.family().getTypeFamilies();
  }
  hasFamily(name) {
    if(!name) return false;
    return this.family().hasTypeFamily(name);
  }
  
  // Check Method
  isOnFire() {
    return this.entity.hasComponent("onfire");
  }
  isTamed() {
    return this.entity.hasComponent("is_tamed");
  }

  // Npc Method
  npc() {
    if(!this.hasFamily("npc")) return;
    return new Npc(this.entity);
  }

  // Effect Method
  addEffectOne(name, duration = 1, amplifier = 0, showParticles = true) {
    if(!name) return;
    this.entity.addEffect(EffectTypes.get(name), Number(duration * 20), { amplifier: Number(amplifier), showParticles })
  }
  addEffect(effect) {
    if(Array.isArray(effect)) {
      effect.forEach(({ name, duration, lvl = 0, showParticles = true }) => this.addEffectOne(name, duration, Number(lvl), showParticles ));
      return;
    }

    if(!(effect instanceof Object)) return;
    const { name, duration, lvl = 0, showParticles } = effect;
    this.addEffectOne(name, duration, Number(lvl), showParticles);
  }
  removeEffect(effect) {
    if(typeof effect === "string") {
      this.entity.removeEffect(effect);
      return;
    }

    if(!Array.isArray(effect)) return;

    effect.forEach(eff => this.entity.removeEffect(eff))
  }
  hasEffect(effect) {
    if(typeof effect === "string") return this.entity.hasEffect(effect);

    if(!Array.isArray(effect)) return;
    return effect.reduce((all, cur) => this.entity.hasEffect(cur) ? all.push(cur) : 0, []) || []
  }
  hasDebuffEffect() {
	return this.entity.getEffects()?.some(e => ["weakness","blindness","slowness","mining_fatigue","darkness","poison","wither","instant_damage"].includes(e.typeId))
  }

  // Command Method
  runCommand(cmd) {
    if(typeof cmd === "string") {
      this.entity.runCommand(cmd);
      return;
    }

    if(!Array.isArray(cmd)) return;
    cmd.forEach(e => this.entity.runCommand(e));
  }
  
  // Particle Method
  selfParticle(particle, location = this.entity.location, molang) {
    if(!particle) return;
    if(!molang) molang = new MolangVariableMap();
    world.getDimension(this.entity.dimension.id).spawnParticle(particle, location, molang);
  }
  particles(particle) {
    if(typeof particle === "string") {
      this.selfParticle(particle);
      return;
    }

    if(!Array.isArray(particle)) return;
    particle.forEach(e => {
      if(typeof e === "string") {
        this.selfParticle(e);
        return;
      }

      const { particle, location, molang } = e;
      this.selfParticle(particle, location, molang);
    })
  }
  impactParticle() {
    if(!this.entity.isOnGround) return;
    this.particles(["cz:impact_up","cz:impact_p"]);
  }

  // Detection Method

  // Movement Method
  knockback(vel, hor = 0, ver = 0) {
    if(!vel) return;
    this.entity.applyKnockback(vel.x, vel.z, hor, ver);
  }
  dash(vel, hor, ver, withParticle = true) {
    if(withParticle) this.selfParticle("cz:dash_particle");
    this.knockback(vel, hor, ver);
  }
  bind(duration) {
    this.addEffect({ name: "slowness", duration, lvl: 254, showParticles: false })
    this.selfParticle("cz:bind", { x: this.entity.location.x, y: this.entity.location.y + 2.3, z: this.entity.location.z })
  }

  // Stat Method
  status() {
    return new Status(this);
  }
  
  // Controller
  controllerStatus() {
	this.getDataEnt().status.filter(r => r.decay == "time").forEach(e => this.status().minStatus(e.name, 0.25))
	this.controllerEffectStatus(this.getDataEnt().status)
  }
  controllerEffectStatus(obj) {
	for(let sts of obj) {
	  switch(sts.type) {
	    case "wet":
          if(this.getComponent("onfire")) this.entity.extinguishFire()
          break;
        case "silence":
          this.entity.addTag("silence");
          break;
	  }
	}
  }

  // Component Method
  getComponent(name) {
    if(!name) return;
    return this.entity.getComponent(name);
  }

  // Essentials Method
  addDamage(damage = 1, option = { cause: "entityAttack", damagingEntity: this.entity }, knockback) {
    let multiplier = 1.0;

    switch(option.cause) {
      case "entityAttack":
        multiplier = this.status().decimalCalcStatus({ type: "fragile" }, 1, 0.01, true);
        break;
      case "magic":
        multiplier = this.status().decimalCalcStatus({ type: "art_fragile" }, 1, 0.01, true);
        break;
    }

    this.entity.applyDamage(Math.round(damage * multiplier), option);

    if(!knockback) return;
    const { vel = this.entity.getVelocity(), hor = 0, ver = 0 } = knockback;
    this.knockback(vel, hor, ver);
  }
  heal(amount = 1) {
    const hp = this.getComponent("health");
    hp.currentValue + Math.abs(amount) >= hp.effectiveMax ? hp.setCurrentValue(hp.effectiveMax) : hp.setCurrentValue(hp.currentValue + Math.abs(amount));
  }
  healable(heal = { amount: 1, source: "none" }, effect) {
    if(!["player", "cat", "yuri", "wolf"].includes(this.entity.typeId.split(":")[1])) return;
    const hp = this.getComponent("health");

    switch(heal.source) {
      case "catlye":
        hp.currentValue <= hp.effectiveMax/4 ? heal.amount += heal.amount/2 : 0;
        break;
    }

    this.heal(heal.amount * this.status(). decimalCalcStatus({ type: "healing_effective" }, 1, 0.01, true));
    this.addEffect(effect);
  }
  
  // Tag Method
  removeTags(...tags) {
    tags.forEach(e => this.entity.removeTag(e));
  }

  // Fix Method
  refreshEntity() {
    const tag = ["silent_target","ultimate","liberator_target","silence","lectaze_target","fireing_zone","catlye_ult"]
    system.run(() => this.removeTags(...tag))
  }
  fixEntity() {
    this.setDataEnt(mergeObject({ status: [] }, this.getDataEnt()))
  }
}

export { Entity };