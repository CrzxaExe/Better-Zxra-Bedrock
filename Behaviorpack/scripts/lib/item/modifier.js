import { world, system } from "@minecraft/server";
import { Modifier, Entity, Specialist } from "../ZxraLib/module.js";
import * as option from "../data.js";


// Hit
Modifier.addMod("vampiric", "hit", (player, target, { item, mod }) => {
  let lvl = mod.lvl || 1;
  
  if(lvl > option.toolsMod.vampiric.maxLvl) lvl = option.toolsMod.vampiric.maxLvl
  new Specialist(player).heal(lvl)
}, { tag: ["minecraft:is_sword"] })

Modifier.addMod("slower", "hit", (player, target, { item, mod }) => {
  let lvl = mod.lvl || 1;
  
  if(lvl > option.toolsMod.slower.maxLvl) lvl = option.toolsMod.slower.maxLvl
  new Entity (target).addEffect([{ name: "slowness", duration: lvl*20, lvl: 1 }])
}, { tag: ["minecraft:is_sword"] })

Modifier.addMod("sweeping", "hit", (player, target, { item, mod }) => {
  let lvl = mod.lvl || 1, sp = new Specialist(player);
  
  if(lvl > option.toolsMod.sweeping.maxLvl) lvl = option.toolsMod.sweeping.maxLvl
  
  let vel = entity.getVelocity(),
    rot = entity.getRotation();
  rot.y = ((rot.y + 45) * Math.PI) / 180;
  let velocity = {
    x: (Math.cos(rot.y) - Math.sin(rot.y)) * 1,
    y: 0,
    z: (Math.sin(rot.y) + Math.cos(rot.y)) * 1
  };
  
  if(sp.cooldown().isCd("sweeping", 1.5) == true) return;
  world.getDimension(target.dimension.id).getEntities({ maxDistance: 2.5, location: target.location, minDistance: 0, excludeNames: [`${player.name}`] }).forEach(e => {
    new Entity(e).addDamage(lvl*3, { cause: "entityAttack", damagingEntity: player }, { vel: velocity, hor: 0.6, ver: 0 })
  })
}, { tag: ["minecraft:is_sword"] })

// Kill
Modifier.addMod("explosive", "kill", (player, target, { item, mod }) => {
  let lvl = mod.lvl || 1;
  
  if(lvl > option.toolsMod.explosive.maxLvl) lvl = option.toolsMod.explosive.maxLvl
  world.getDimension(target.dimension.id).createExplosion(target.location, lvl, { breaksBlocks: false, source: player })
}, { tag: ["minecraft:is_sword"] })

Modifier.addMod("lifesteal", "kill", (player, target, { item, mod }) => {
  let lvl = mod.lvl || 1;
  
  if(lvl > option.toolsMod.lifesteal.maxLvl) lvl = option.toolsMod.lifesteal.maxLvl
  new Specialist(player).heal(lvl * 2)
}, { tag: ["minecraft:is_sword"] })

Modifier.addMod("steal", "kill", (player, target, { item, mod }) => {
  let lvl = mod.lvl || 1;
  
  if(lvl > option.toolsMod.steal.maxLvl) lvl = option.toolsMod.steal.maxLvl
  new Specilist(player).addMoney(0.5 * lvl)
}, { tag: ["minecraft:is_sword"] })