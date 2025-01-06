import { EffectTypes, system, world } from "@minecraft/server";
import { enParticle, Weapon, Entity } from "../ZxraLib/module.js";

// Crusher
Weapon.registerSkill("crusher", (player, lib, event) => {
	let maxDuration = 30;
	let power = (Math.floor(maxDuration * (1 - event.useDuration / (maxDuration * 20)))).toFixed(2);
	/*
	*  Debuff duration scaling with power
	*/

	// Skill 2
	if(player.isSneaking) {
	  if(lib.sp.cooldown().isCd("crusher2", 5) == true) return

	  lib.sp.minStamina("value", 10)// Stamina
	  player.playAnimation("animation.weapon.crushing", { blendOutTime: 0.35 })// Animation
	  world.getDimension(player.dimension.id).getEntities({ maxDistance: 6, location: player.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
		new Entity(e).addDamage(Math.floor((10*power+8) *lib.multiplier), { cause: "entityAttack", damagingEntity: player })
	  })
	  lib.sp.runCommand(`camerashake add @s 1.2 0.08`)
	  if(player.isOnGround == true) lib.sp.impactParticle()
	} else if(player.isOnGround == false && player.isSneaking == false) {// Skill 3
	  if(lib.sp.cooldown().isCd("crusher3", 6) == true) return

	  lib.sp.minStamina("value", 19)// Stamina
	  player.playAnimation("animation.kyle.slash", { blendOutTime: 0.35 })// Animation

	  let target = player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team] })[0]?.entity
	  if(!target) return
	  let ent = new Entity(target)

      system.runTimeout(() => {
	    ent.addDamage((power*8+8) *lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.vel, hor: 0, ver: power*0.3 })
	    ent.addEffect({ name: "slowness", duration: 6, lvl: 1 })
	  }, 6)
	} else {// Skill 1
	  let entity = player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team] })[0]?.entity;
      if(!entity || entity == null || entity == undefined) return

      if(lib.sp.cooldown().isCd("crusher1", 3) == true) return

	  lib.sp.minStamina("value", 8)// Stamina
	  player.playAnimation("animation.weapon.push", { blendOutTime: 0.35 })// Animation

      entity.addTag("silence")

      new Entity(entity).addDamage((power*4+8) * lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.velocity, hor: power*2+2, ver: 0 })
      system.runTimeout(() => entity.removeTag("silence"), 60)
	}
})

// Bringer
Weapon.registerSkill("bringer", (player, lib, event) => {
	if(player.isSneaking) {// Skill 2
		let entity = player.getEntitiesFromViewDirection({ maxDistance: 9, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team]})[0]?.entity
		if(!entity) return

		if(lib.sp.cooldown().isCd("bringer2", 5) == true) return

		lib.sp.minStamina("value", 16)
		player.playAnimation("animation.weapon.dash.atk", { blendOutTime: 0.35 })// Animation
		player.teleport(entity.location, { rotation: player.getRotation() })
		lib.sp.knockback(lib.velocity, 2, 0)

		system.runTimeout(() => { new Entity(entity).addDamage(18*lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.velocity, hor: 3, ver: 0 }) }, 3)
	} else if(player.isOnGround == false) {// Skill 3
	    if(lib.sp.cooldown().isCd("bringer3", 8) == true) return

		player.playAnimation("animation.weapon.crushing.old", { blendOutTime: 0.35 })// Animation
		lib.sp.minStamina("value", 18)
		lib.sp.selfParticle("cz:impact_down")

		lib.sp.knockback(lib.velocity, 2.8, 0.5)
		lib.sp.addEffect({ name: "resistance", duration: 0.7, lvl: 1 })
		lib.sp.bind(1.35)
		system.runTimeout(() => {
			world.getDimension(player.dimension.id).getEntities({ maxDistance: 7, location: player.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
				new Entity(e).addDamage(Math.floor(20 * lib.multiplier), { cause: "entityAttack", damagingEntity: player })
				new Entity(e).addEffect({ name: "wither", duration: 3, lvl: 1, showParticles: false })
			})
		}, 12)
	} else {// Skill 1
	    if(lib.sp.cooldown().isCd("bringer1", 1.5) == true) return

		lib.sp.minStamina("value", 4)
		player.playAnimation("animation.weapon.throw_projectile", { blendOutTime: 0.15 })// Animation
		lib.sp.knockback(lib.velocity, 2.3, 0)

		system.runTimeout(() => {
			world.getDimension(player.dimension.id).getEntities({ maxDistance: 4, location: player.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
				new Entity(e).addDamage(Math.floor(12 * lib.multiplier), { cause: "entityAttack", damagingEntity: player })
				new Entity(e).addEffect({ name: "wither", duration: 3, lvl: 1, showParticles: false })
			})
        }, 5)
	}
})

// Berserk
Weapon.registerSkill("berserk", async (player, lib, event) => {
	if(player.isSneaking) {// Skill 2
		if(lib.sp.cooldown().isCd("berserk2", 9.5) == true) return
		lib.sp.minStamina("value", 16)

		player.playAnimation("animation.weapon.swash", { blendOutTime: 0.35 })// Animation
		lib.sp.status().addStatus("s-up", 10, { type: "skill", lvl: 10 })

	    system.runTimeout(() => {
			world.getDimension(player.dimension.id).getEntities({ maxDistance: 6, location: player.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
				new Entity(e).addDamage(player.getComponent("health").defaultValue/5, { cause: "entityAttack", damagingEntity: e })
				lib.sp.addDamage(player.getComponent("health").defaultValue/10, { cause: "entityAttack", damagingEntity: e })
				lib.berserk[player.id] = Math.floor(lib.berserk[player.id] + 6)
			})
		}, 3)
	} else if(player.isSneaking == false && player.isOnGround == false) {// Skill 3
		if(lib.sp.cooldown().isCd("berserk3", 15) == true) return
		lib.sp.minStamina("value", 30)

		let stack = lib.berserk[player.id] || 0, dmg = 18
		player.playAnimation("animation.weapon.impact", { blendOutTime: 0.35 })// Animation

		if(stack > 30) dmg = Math.floor(dmg + stack*2)
		if(lib.multiplier > 1.2) lib.multiplier *= 1.5
		player.triggerEvent("cz:no_fall_5s")

		await lib.sp.impactSkill(dmg, lib)
		delete lib.berserk[player.id]
	} else {// Skill 1
		if(lib.sp.cooldown().isCd("berserk1", 3) == true) return

		player.playAnimation("animation.weapon.swing.great", { blendOutTime: 0.35 })// Animation
		lib.sp.bind(1.2)
		lib.sp.minStamina("value", 8)

		system.runTimeout(() => {
			lib.sp.runCommand([`execute positioned ^^^2 run damage @e[name=${lib.notSelf},r=2.5,type=!item,type=!cz:indicator] ${Math.floor(16 * lib.multiplier)} entity_attack entity @s`])
		}, 13)
	}
})

// Cenryter
Weapon.registerSkill("cenryter", (player, lib, event) => {
  if(player.isSneaking) {
    if(lib.sp.cooldown().isCd("cenryter2", 6) == true) return
	lib.sp.minStamina("value", 12)

    player.playAnimation("animation.weapon.upgrade", { blendOutTime: 0.35 })// Animation
    
    world.getDimension(player.dimension.id).getEntities({ maxDistance: 5, location: player.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
      if(!e.getComponent("onfire")) return
      
      lib.sp.heal(1)
      new Entity(e).selfParticle("cz:ourfire_absorb")
      if(Number((lib.sp.status().getStatus("our_fire")?.lvl) || 0) + 4 <= 40) {
        lib.sp.status().addStatus("our_fire", 10, { type: "skill", stack: true, lvl: 4 })
      }
    })
  } else if(player.getEffect("strength") && !player.isSneaking) {
    player.playAnimation("animation.weapon.reaper.up", { blendOutTime: 0.35 })// Animation
    
    lib.sp.removeEffect(["strength"])
    lib.sp.bind(0.7)
    system.runTimeout(() => {
      lib.sp.knockback(lib.vel, 0.5, 0.17)
      system.runTimeout(() => {
        player.getEntitiesFromViewDirection({ maxDistance: 4, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team] }).forEach(e => {
          e.entity.setOnFire(5)
          lib.sp.heal(1)
          new Entity(e.entity).selfParticle("cz:orange_slash")
          new Entity(e.entity).addDamage(21 * lib.multiplier, { cause: "entityAttack", damagingEntity: player },{ vel: lib.velocity, hor: 1.4, ver: 0.7 })
        })
      }, 1)
    }, 6)
  } else {
    if(lib.sp.cooldown().isCd("cenryter1", 2.5) == true) return
	lib.sp.minStamina("value", 16)

    player.playAnimation("animation.weapon.reaper.swipe", { blendOutTime: 0.35 })// Animation
    
    lib.sp.bind(0.5)
    system.runTimeout(() => {
      lib.sp.addEffect({ name: "strength", duration: 5, lvl: 1 })
      world.getDimension(player.dimension.id).getEntities({ maxDistance: 6, location: player.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
        e.setOnFire(5)
        lib.sp.heal(1)
        new Entity(e).addDamage(15 * lib.multiplier, { cause: "entityAttack", damagingEntity: player })
        new Entity(e).selfParticle("cz:orange_slash")
      })
      system.runTimeout(() => {
        player.playAnimation("animation.weapon.dash.front", { blendOutTime: 0.35 })// Animation
        system.runTimeout(() => lib.sp.knockback(lib.vel, 3.3, 0), 2)
      },4)
    }, 9)
  }
})

// Yume Staff
Weapon.registerSkill("yume_staff", (player, lib, event) => {
  if(player.isSneaking) {
    if(lib.sp.cooldown().isCd("yume_staff2", 7) == true) return
	lib.sp.minStamina("value", 25)

    player.playAnimation("animation.weapon.swash", { blendOutTime: 0.35 })// Animation
    lib.sp.bind(0.7)
    let stack = lib.sp.status().getStatus("glance_mana")?.lvl || 0;
    
    if(stack + 1 <= 5) ++stack;

    lib.sp.status().addStatus("glance_mana", 20, { type: "stack", stack: false, lvl: stack })
  } else if(!player.isSneaking && !player.isOnGround) {
    if(lib.sp.cooldown().isCd("yume_staff3", 9) == true) return
	lib.sp.minStamina("value", 16)

    player.playAnimation("animation.weapon.upgrade", { blendOutTime: 0.35 })// Animation
    
    system.runTimeout(() => {
      player.dimension.spawnParticle("cz:yume_explosion", player.location)
      player.dimension.spawnParticle("cz:yume_explosion_ring", { x: player.location.x, y: player.location.y + 0.3, z: player.location.z })
      world.getDimension(player.dimension.id).getEntities({ maxDistance: 7, location: player.location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
        new Entity(e).addDamage(24 * lib.multiplier, { cause: "magic", damagingEntity: player }, { vel: e.getVelocity(), ver: -1.6, hor: 0.3 })
      })
    }, 7)
  } else {
    let entity = player.getEntitiesFromViewDirection({ maxDistance: 20, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team]})[0]?.entity
    if(!entity) return
    const dimension = entity.dimension || player.dimension, location = { ...entity.location };

    if(lib.sp.cooldown().isCd("yume_staff1", 12.5) == true) return
    let stack = lib.sp.status().getStatus("glance_mana")?.lvl || 0;
	lib.sp.minStamina("value", 18 + (10 * stack))

    player.playAnimation("animation.weapon.staff.shoot", { blendOutTime: 0.35 })// Animation
    
    let newLocation = location;
    newLocation.y += 0.3
    
    system.runTimeout(() => {
      for(let i = 0; i<stack+1; i++) {
        system.runTimeout(() => {
          world.getDimension(dimension.id).getEntities({ maxDistance: 5 + i, location: location, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
            new Entity(e).addDamage((16 + (stack * 1 * i)) * lib.multiplier, { cause: "magic", damagingEntity: player }, { vel: e.getVelocity(), hor: 0, ver: -0.4 })
            dimension.spawnParticle("cz:yume_explosion", location)
            dimension.spawnParticle("cz:yume_explosion_ring", newLocation)
          })
        }, i * 10)
      }
      lib.sp.status().removeStatus("glance_mana")
    }, 10)
  }
})

Weapon.registerSkill("undying", (player, lib, event) => {
  if(player.isSneaking) {
  } else if(!player.isSneaking && !player.isOnGround) {
  } else {
    let entity = player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"], excludeNames: [...lib.team]})[0]?.entity
    if(!entity) return

    if(lib.sp.cooldown().isCd("undying1", 2.5) == true) return
	lib.sp.minStamina("value", 15)

	player.playAnimation("animation.weapon.push", { blendOutTime: 0.35 })// Animation

	new Entity(entity).addDamage(18 * lib.multiplier, { cause: "magic", damagingEntity: player })
  }
})