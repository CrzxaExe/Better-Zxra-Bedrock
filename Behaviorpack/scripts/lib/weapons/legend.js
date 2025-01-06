import { EffectTypes, system, world } from "@minecraft/server";
import { Specialist } from "../../system.js";
import { Weapon, Entity } from "../ZxraLib/module.js";

// Musha Skill
Weapon.registerSkill("musha", (player, lib, event) => {
  let stk = lib.musha[player.id] || { atk: 0, stack: 0 };
  if(!player.isOnGround) {
    let target = player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"] })[0]?.entity;
    if(!target) return;
    
    if(lib.sp.cooldown().isCd("musha2", 8) == true) return
	lib.sp.minStamina("value", 13)// Stamina

    player.playAnimation("animation.weapon.impact", { blendOutTime: 0.35 })// Animation

    lib.sp.impactSkill(12+parseInt(stk.stack), { ...lib, single: true, ent: new Entity(target) })
  } else {
    if(lib.sp.cooldown().isCd("musha1", 3.5) == true) return
	lib.sp.minStamina("value", 8)// Stamina

    player.playAnimation("animation.kyle.slash", { blendOutTime: 0.35 }) // Animation

    system.runTimeout(() => {
  	lib.sp.runCommand([`execute positioned ^^^2 run damage @e[name=${lib.notSelf},r=3,type=!item,type=!cz:indicator] ${Math.floor((13+parseInt(stk.stack)) * lib.multiplier)} entity_attack entity @s`])
	}, 5)
  }
})

// Vitage Skill
Weapon.registerSkill("vitage", (player, lib, event) => {
  lib.sp.addEffect([{ name: "speed", duration: 40, lvl: 0 }])
  if(player.isSneaking) {
    if(lib.sp.cooldown().isCd("vitage2", 6.5) == true) return
	lib.sp.minStamina("value", 9)// Stamina

    player.playAnimation("animation.weapon.swing", { blendOutTime: 0.35 }) // Animation

    let target = player.getEntitiesFromViewDirection({ maxDistance: 7, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team] })[0];
    if(!target) return;
    
    system.runTimeout(() => {
      new Entity(target.entity).addDamage(14*lib.multiplier, { cause: "entityAttack", damagingEntity: player })
      lib.sp.knockback(player.getVelocity(), 3.5)
      lib.sp.status().addStatus("push_break", 3, { lvl: 1, type: "none", decay: "time", stack: false })
    }, target.distance * 1.7)
  } else {
    if(lib.sp.cooldown().isCd("vitage1", 3.5) == true) return
	lib.sp.minStamina("value", 6)// Stamina

    player.playAnimation("animation.weapon.dash.front", { blendOutTime: 0.35 }) // Animation
    lib.sp.knockback(lib.velocity, 5.5, 0)

    system.runTimeout(() => {
      lib.sp.status().addStatus("push_break", 3, { lvl: 1, type: "none", decay: "time", stack: false })
    }, 3)
  }
})

// Azyh Skill
Weapon.registerSkill("azyh", (player, lib, event) => {
  if(player.isSneaking) {
    if(lib.sp.cooldown().isCd("azyh2", 13.5) == true) return
	lib.sp.minStamina("value", 10)// Stamina

    player.playAnimation("animation.weapon.upgrade", { blendOutTime: 0.35 }) // Animation

    lib.sp.status().addStatus("slicezer", 10, { lvl: 1, type: "none", decay: "time", stack: false })
    lib.sp.addEffect({ name: "speed", duration: 10, lvl: 1 })
  } else {
    if(lib.sp.cooldown().isCd("azyh1", 1) == true) return
	lib.sp.minStamina("value", 6)// Stamina

    player.playAnimation("animation.weapon.dash.front", { blendOutTime: 0.35 }) // Animation
    lib.sp.knockback(lib.velocity, 4.6, 0)

    player.getEntitiesFromViewDirection({ maxDistance: 4.1, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team] }).forEach(target => {
      system.runTimeout(() => {
        new Entity(target.entity).addDamage(10, { cause: "entityAttack", damagingEntity: player }, { vel: lib.velocity, hor: 0.8, ver: 0 })
        new Entity(target.entity).bind(0.2)
        lib.sp.addStamina("value", (lib.options.staminaAction || 4) + 2);
        if(target.entity.typeId.split(":")[1] == "player") new Specialist(target.entity).minStamina("value", 2);
      }, target.distance*1.1)
    })
  }
})

// Sui Skill
Weapon.registerSkill("sui", (player, lib, event) => {
  if(!lib.sp.cooldown().hasCd("sui_dash")) {
    let target = player.getEntitiesFromViewDirection({ maxDistance: 15, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team] })[0];
    if(!target) return;
    
    let pos = player.location;

    if(lib.sp.cooldown().isCd("sui1", 10) == true) return
	lib.sp.minStamina("value", 18)// Stamina
	
	player.playAnimation("animation.weapon.slash.up", { blendOutTime: 0.35 }) // Animation
	
	system.runTimeout(() => {
		lib.sp.cooldown().addCd("sui_dash", 5);
		player.teleport(target.entity.location, { rotation: player.getRotation() })
		world.getDimension(target.entity.dimension.id).getEntities({ maxDistance: 3.5, location: target.entity.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
			new Entity(e).addDamage(15*lib.multiplier, { cause: "magic", damagingEntity: player }, { vel: lib.velocity, hor: 0.1, ver: 0.4 })
			new Entity(e).bind(5)
		})
		lib.sp.bind(5)
		
		system.runTimeout(() => {
			player.playAnimation("animation.weapon.dash.back", { blendOutTime: 0.35 }) // Animation
			player.teleport(pos, { rotation: player.getRotation() })
		}, 100)
    }, 5)
  } else {
    if(lib.sp.cooldown().isCd("sui2", 2) == true) return
	lib.sp.minStamina("value", 10)// Stamina

	player.playAnimation("animation.weapon.crushing.front", { blendOutTime: 0.35 }) // Animation
	
	system.runTimeout(() => {
		lib.sp.knockback(lib.velocity, 1.9, 0)
		
		player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team] }).forEach(e => {
			new Entity(e.entity).addDamage(20*lib.multiplier, { cause: "magic", damagingEntity: player }, { vel: lib.velocity, hor: -1.3, ver: 0.1 })
		})
	}, 3)
  }
})

Weapon.registerSkill("hyrant", (player, lib, event) => {
  if(player.isSneaking) {
  } else {
    let target = player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team]})[0]
    if(!target) return

    if(lib.sp.cooldown().isCd("hyrant1", 2.5) == true) return
	lib.sp.minStamina("value", 15)

	player.playAnimation("animation.weapon.push", { blendOutTime: 0.35 })// Animation

	new Entity(target.entity).addDamage((18 + (2 * target.distance)) * lib.multiplier, { cause: "entityAttack", damagingEntity: player })
	world.getDimension(target.entity.dimension.id).getEntities({ maxDistance: 3, location: target.entity.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
		e.hasEffect("slowness") ? new Entity(e).bind(3) : new Entity(e).addEffect({ name: "slowness", duration: 3, lvl: 1, showParticles: false });
	})
  }
})

Weapon.registerSkill("harmony", (player, lib, event) => {
  if(player.isSneaking) {
  } else {
    let target = player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team]})[0]
    if(!target) return

    if(lib.sp.cooldown().isCd("harmony1", 2.5) == true) return
	lib.sp.minStamina("value", 15)

	player.playAnimation("animation.weapon.push", { blendOutTime: 0.35 })// Animation

	new Entity(target.entity).addDamage((18 + (2 * target.distance)) * lib.multiplier, { cause: "magic", damagingEntity: player })
	if(target.distance < 2) return;

	player.triggerEvent("cz:shield_magic_1")
  }
})

Weapon.registerSkill("lighter", (player, lib, event) => {
})