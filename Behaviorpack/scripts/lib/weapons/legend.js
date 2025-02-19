import { EffectTypes, system, world, Player } from "@minecraft/server";
import { Weapon, Entity, Specialist, vector2Distance } from "../ZxraLib/module.js";

// Musha Skill
Weapon.registerSkill("musha", (player, lib, event) => {
  let stk = lib.musha[player.id] || { atk: 0, stack: 0 };
  if(!player.isOnGround) {
    let target = player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"] })[0]?.entity;
    if(!target) return;
    
    if(lib.sp.cooldown().cd("musha2", 8)) return
	lib.sp.minStamina("value", 13)// Stamina

    player.playAnimation("animation.weapon.impact", { blendOutTime: 0.35 })// Animation

    lib.sp.impactSkill(12+parseInt(stk.stack), { ...lib, single: true, ent: new Entity(target) })
  } else {
    if(lib.sp.cooldown().cd("musha1", 3.5)) return
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
    if(lib.sp.cooldown().cd("vitage2", 6.5)) return
	lib.sp.minStamina("value", 9)// Stamina

    player.playAnimation("animation.weapon.swing", { blendOutTime: 0.35 }) // Animation

    let target = player.getEntitiesFromViewDirection({ maxDistance: 7, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team] })[0];
    if(!target) return;
    
    system.runTimeout(() => {
      new Entity(target.entity).selfParticle("minecraft:critical_hit_emitter", { x: player.location.x, y: player.location.y + 1, z: player.location.z })
      new Entity(target.entity).addDamage(14*lib.multiplier, { cause: "entityAttack", damagingEntity: player })
      lib.sp.knockback(player.getVelocity(), 3.5)
      lib.sp.status().addStatus("push_break", 3, { lvl: 1, type: "none", decay: "time", stack: false })
    }, target.distance * 1.7)
  } else {
    if(lib.sp.cooldown().cd("vitage1", 3.5)) return
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
    if(lib.sp.cooldown().cd("azyh2", 13.5)) return
	lib.sp.minStamina("value", 10)// Stamina

    player.playAnimation("animation.weapon.dagger.upgrade", { blendOutTime: 0.35 }) // Animation

    lib.sp.status().addStatus("slicezer", 10, { lvl: 1, type: "none", decay: "time", stack: false })
    lib.sp.addEffect({ name: "speed", duration: 10, lvl: 1 })
  } else {
    if(lib.sp.cooldown().cd("azyh1", 1)) return
	lib.sp.minStamina("value", 6)// Stamina

    player.playAnimation("animation.weapon.dash.front", { blendOutTime: 0.35 }) // Animation
    lib.sp.knockback(lib.velocity, 4.6, 0)

    player.getEntitiesFromViewDirection({ maxDistance: 4.1, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team] }).forEach(target => {
      system.runTimeout(() => {
        const ent = new Entity(target.entity)
        ent.selfParticle("cz:gray_slash")
        ent.addDamage(10, { cause: "entityAttack", damagingEntity: player }, { vel: lib.velocity, hor: 0.8, ver: 0 })
        ent.bind(0.2)
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

    if(lib.sp.cooldown().cd("sui1", 10)) return
	lib.sp.minStamina("value", 18)// Stamina
	
	player.playAnimation("animation.weapon.slash.up", { blendOutTime: 0.35 }) // Animation
	
	system.runTimeout(() => {
		lib.sp.cooldown().addCd("sui_dash", 5);
		player.teleport(target.entity.location, { rotation: player.getRotation() })
		world.getDimension(target.entity.dimension.id).getEntities({ maxDistance: 3.5, location: target.entity.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
			const ent = new Entity(e)
			ent.selfParticle("minecraft:critical_hit_emitter", { x: e.location.x, y: e.location.y + 1, z: e.location.z })
			ent.addDamage(15*lib.multiplier, { cause: "magic", damagingEntity: player }, { vel: lib.velocity, hor: 0.1, ver: 0.4 })
			ent.bind(5)
		})
		lib.sp.bind(5)
		
		system.runTimeout(() => {
			player.playAnimation("animation.weapon.dash.back", { blendOutTime: 0.35 }) // Animation
			player.teleport(pos, { rotation: player.getRotation() })
		}, 100)
    }, 5)
  } else {
    if(lib.sp.cooldown().cd("sui2", 2)) return
	lib.sp.minStamina("value", 10)// Stamina

	player.playAnimation("animation.weapon.crushing.front", { blendOutTime: 0.35 }) // Animation
	
	system.runTimeout(() => {
		lib.sp.knockback(lib.velocity, 1.9, 0)
		
		player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team] }).forEach(e => {
			new Entity(e.entity).particles([{ particle: "minecraft:critical_hit_emitter", location: { x: e.entity.location.x, y: e.entity.location.y + 1, z: e.entity.location.z }},"cz:gray_slash"])
			new Entity(e.entity).addDamage(20*lib.multiplier, { cause: "magic", damagingEntity: player }, { vel: lib.velocity, hor: -1.3, ver: 0.1 })
		})
	}, 3)
  }
})

// Hyrant
Weapon.registerSkill("hyrant", (player, lib, event) => {
  if(player.isSneaking) {
    if(lib.sp.cooldown().cd("hyrant2", 4)) return
	lib.sp.minStamina("value", 29)

    player.playAnimation("animation.weapon.plunging.sword", { blendOutTime: 0.35 })// Animation
    
    lib.sp.bind(5.125)
    
    system.runTimeout(() => {
      world.getDimension(player.dimension.id).getEntities({ maxDistance: 6, location: player.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
		  e.getEffect("slowness") ? new Entity(e).bind(0.3) : new Entity(e).addEffect({ name: "slowness", duration: 0.3, lvl: 1, showParticles: false });
		  new Entity(e).addDamage(12 * lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.vel, ver: 0, hor: -1 })
	  })
	  const interval = system.runInterval(() => {
		lib.sp.selfParticle("cz:hyrant_area")
		world.getDimension(player.dimension.id).getEntities({ maxDistance: 6, location: player.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
		  e.getEffect("slowness") ? new Entity(e).bind(0.3) : new Entity(e).addEffect({ name: "slowness", duration: 0.3, lvl: 1, showParticles: false });
	    })
	  }, 10)
      system.runTimeout(() => {
        system.clearRun(interval)
      }, 53)
    }, 23)
  } else {
    let target = player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team]})[0]
    if(!target) return

    if(lib.sp.cooldown().cd("hyrant1", 4)) return
	lib.sp.minStamina("value", 13)

	player.playAnimation("animation.weapon.push", { blendOutTime: 0.35 })// Animation

	world.getDimension(target.entity.dimension.id).getEntities({ maxDistance: 3, location: target.entity.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
		e.getEffect("slowness") ? new Entity(e).bind(3) : new Entity(e).addEffect({ name: "slowness", duration: 3, lvl: 1, showParticles: false });
	})
	new Entity(target.entity).selfParticle("cz:hyrant_crit", { x: target.entity.location.x, y: target.entity.location.y + 1, z: target.entity.location.z })
	new Entity(target.entity).addDamage((18 + (2 * target.distance)) * lib.multiplier, { cause: "entityAttack", damagingEntity: player })
  }
})

// Harmony
Weapon.registerSkill("harmony", (player, lib, event) => {
  if(player.isSneaking) {
    if(lib.sp.cooldown().cd("harmony2", 6)) return
	lib.sp.minStamina("value", 26)
	lib.sp.bind(0.2)

	player.playAnimation("animation.weapon.upgrade", { blendOutTime: 0.35 })// Animation
	
	world.getDimension(player.dimension.id).getEntities({ maxDistance: 5, location: player.location, minDistance: 0, excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
	  if(!(e instanceof Player) || !lib.team.includes(e.name)) return

	  e.triggerEvent("cz:shield_magic_1")
	})
  } else {
    let target = player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team]})[0]
    if(!target) return

    if(lib.sp.cooldown().cd("harmony1", 6)) return
	lib.sp.minStamina("value", 18)
	lib.sp.bind(1)

	player.playAnimation("animation.weapon.push", { blendOutTime: 0.35 })// Animation

	new Entity(target.entity).addDamage((18 + (2 * target.distance)) * lib.multiplier, { cause: "magic", damagingEntity: player })
	new Entity(target.entity).selfParticle("minecraft:critical_hit_emitter", { x: target.entity.location.x, y: target.entity.location.y + 1, z: target.entity.location.z })
	if(target.distance < 2) return

	player.triggerEvent("cz:shield_magic_1")
  }
})

// Lighter
Weapon.registerSkill("lighter", (player, lib, event) => {
  if(player.isSneaking) {
    if(lib.sp.cooldown().cd("lighter2", 8)) return
	lib.sp.minStamina("value", 20)

	player.playAnimation("animation.weapon.crushing.down", { blendOutTime: 0.35 }) // Animation
	lib.sp.bind(0.8)

	system.runTimeout(() => {
	  lib.sp.selfParticle("cz:lighter_impact")
	  world.getDimension(player.dimension.id).getEntities({ maxDistance: 6, location: player.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
	    let dmg = 17 * vector2Distance(player.location, e.location), cause = "entityAttack"
	    if(lib.sp.isOnFire()) e.setOnFire(3)
	    if(new Entity(e).isOnFire()) {
		  dmg *= 1.5
		  cause = "fire"
		}
		new Entity(e).addDamage(dmg * lib.multiplier, { cause, damagingEntity: player })
	  })

	  if(lib.sp.isOnFire()) player.extinguishFire()
	}, 12)
  } else {
    if(lib.sp.cooldown().cd("lighter2", 4.5)) return
	lib.sp.minStamina("value", 16)
	
	player.playAnimation("animation.weapon.reaper.up", { blendOutTime: 0.35 })// Animation
	
	lib.sp.knockback(lib.velocity, 0.3, 0)
	lib.sp.bind(0.56)

	system.runTimeout(() => {
	  player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team] }).forEach(e => {
		let dmg = 10 * e.distance, cause = "entityAttack"

		if(lib.sp.isOnFire()) e.entity.setOnFire(3)
		if(new Entity(e.entity).isOnFire()) {
		  dmg *= 1.5
		  cause = "fire"
		}

		new Entity(e.entity).addDamage(dmg * lib.multiplier, { cause, damagingEntity: player })
	  })
	}, 7)
  }
})

// Cervant
Weapon.registerSkill("cervant", (player, lib, event) => {
  if(player.isSneaking) {
    if(lib.sp.cooldown().cd("cervant2", 6)) return
	lib.sp.minStamina("value", 18)

	lib.sp.addEffectOne("speed", 3, 1, false)
	!lib.sp.status().hasStatusName("cervant_state") ? lib.sp.status().addStatus("cervant_state", 1, { type: "state", decay: "none", lvl: 0, stack: false }) : lib.sp.status().removeStatus("cervant_state");
  } else {
    let target = player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team]})[0]?.entity
    if(!target) return

    if(lib.sp.cooldown().cd("cervant1", 2)) return
	lib.sp.minStamina("value", 14)// Stamina
	lib.sp.bind(0.8)

	player.playAnimation("animation.weapon.crushing.front", { blendOutTime: 0.35 }) // Animation
	lib.sp.knockback(lib.velocity, 0.4, 0)

	system.runTimeout(() => {
		if(lib.sp.status().hasStatusName("cervant_state")) {
			new Entity(target).addDamage(36 * lib.multiplier, { cause: "entityAttack", damagingEntity: player })
			return
		}
		world.getDimension(target.dimension.id).getEntities({ maxDistance: 5, location: target.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
		  new Entity(e).addDamage(18 * lib.multiplier, { cause: "entityAttack", damagingEntity: player })
	    })
	}, 9)
  }
})

// Harmist Flute
Weapon.registerSkill("harmist_flute", (player, lib, event) => {
  if(player.isSneaking) {
  } else {
    let target = player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team]})[0]?.entity
    if(!target) return

    if(lib.sp.cooldown().cd("harmist_flute1", 7.5)) return
	lib.sp.minStamina("value", 24)
	lib.sp.bind(0.3)

    player.playAnimation("animation.weapon.staff.shoot", { blendOutTime: 0.35 })// Animation
    
    system.runTimeout(() => {
      new Entity(e).addDamage(9 * lib.multiplier, { cause: "void", damagingEntity: player })
      new Entity(e).status().addStatus("bad_note", 8, { type: "fragile", decay: "time", lvl: 45, stack: false }) // Pasif Bad Note
    }, 10)
  }
})