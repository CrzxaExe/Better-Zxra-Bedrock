import { EffectTypes, system, world } from "@minecraft/server";
import { weapon, Entity } from "../../system.js";
import { enParticle } from "../ZxraLib/module.js";

// Kyles Skill
weapon.registerWeapon("kyles", (player, lib, event) => {
	let maxDuration = 30
	let power = (Math.floor(maxDuration * (1 - event.useDuration / (maxDuration * 20)))).toFixed(2) * 1.35
	/*
	* Power of damage using percen of duration divided by this max duration
    * So damage will increase while you charging
	*/

	// Skill 2
	if(player.isSneaking) {
	  if(lib.sp.cooldown().isCd("kyles2", 4) == true) return
	  lib.sp.minStamina("value", 6)// Stamina
	  player.playAnimation("animation.crzx.skill1", { blendOutTime: 0.35 }) // Animation

	  let kyle2 = Math.round((power * 80) + 26 + player.getComponent("health").defaultValue/4), rot = player.getViewDirection()

      system.runTimeout(() => {
	    lib.sp.dash(lib.velocity, power/6*2.7+6.5, 1.24*(rot.y)+0.2)
	    system.runTimeout(() => {
		  lib.sp.runCommand([`damage @e[r=4.3,name=${lib.notSelf},type=!item,type=!cz:indicator] ${kyle2*lib.multiplier} entity_attack entity @s`])
        }, (power/6*2.6 + 3)*1.818)
      }, 7)
	} else if(!player.isOnGround) {// Ultimate
	  if(lib.sp.cooldown().isCd("kylesUlt", 12) == true) return

	  lib.sp.minStamina("value", 11)// Stamina
	  player.playAnimation("animation.weapon.kyle.ultimate", { blendOutTime: 0.35 })// Animation
	  let target = player.getEntitiesFromViewDirection({ excludeTypes: ["minecraft:item","cz:indicator"] })[0] || undefined

      let kyle3 = Math.round((power * 209) + (Math.random() * 60) + 26), dashPower = 10.5
      lib.sp.bind(1.9)
      player.addTag("ultimate")
      
      if(target !== undefined) {
      	let distance = Math.sqrt((player.location.x - target.entity.location.x) ** 2 + (player.location.z - target.entity.location.z) ** 2)
          dashPower = distance*1.2
      }
      
      function kyleUlt() {
      	world.getDimension(player.dimension.id).getEntities({ maxDistance: 7, location: player.location, minDistance: 0, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
      	  let dmga = ((17*power)+e.getComponent("health").defaultValue/4)*(lib.multiplier*2.8)
            if(dmga >= 2700) dmga = 2700
		    lib.sp.bind(0.3)
            new Entity(e).addDamage(dmga, { cause: "entityAttack", damagingEntity: player }, { vel: lib.velocity, hor: 0.5, ver: 0 })
            lib.sp.heal(Math.round(1*lib.multiplier))
      	})
      }

      lib.sp.selfParticle("cz:kyle_ult_charge")

      system.runTimeout(() => {
        lib.sp.dash(lib.velocity, dashPower, 0)
        player.removeTag("ultimate")
        system.runTimeout(() => {
        	lib.sp.particles(["cz:impact_p","cz:impact_down"])
            lib.sp.removeEffect(["strength","hunger","poison","wither","weakness","mining_fatigue"])
            kyleUlt()
        }, 6)
      }, 28)
	} else if(player.getEffect("strength") && player.isSneaking == false) {// Skill Special
	  lib.sp.minStamina("value", 6)// Stamina
      player.playAnimation("animation.weapon.crushing.heavy", { blendOutTime: 0.35 })// Animation

      system.runTimeout(() => {
      	lib.sp.knockback(lib.velocity, 4.21, 0.45)
      	system.runTimeout(() => {
              lib.sp.removeEffect(["strength","hunger","poison","wither","weakness","mining_fatigue"])
              lib.sp.bind(0.6)
              lib.sp.runCommand([`damage @e[r=5,name=${lib.notSelf},type=!item,type=!cz:indicator] ${Math.floor(((88*power)+24+player.getComponent("health").defaultValue/4)*lib.multiplier)} entity_attack entity @s`, `execute as @e[r=6,name=${lib.notSelf},type=!cz:particles,type=!item] run particle cz:kyle_right ~~1~`])
              system.runTimeout(() => lib.sp.runCommand([`damage @e[r=5,name=${lib.notSelf},type=!item,type=!cz:indicator] ${Math.floor(((160*power)+18+player.getComponent("health").defaultValue/4)*lib.multiplier)} entity_attack entity @s`, `execute as @e[r=6,name=${lib.notSelf},type=!cz:particles,type=!item] run particle cz:kyle_right ~~1~`]), 9)
          }, 13)
      }, 5)
	} else { // Skill 1
	  if(lib.sp.cooldown().isCd("kyles1", 3) == true) return
	  lib.sp.minStamina("value", 3)// Stamina
	  player.playAnimation("animation.crzx.skill2", { blendOutTime: 0.35 })// Animation
	  lib.sp.bind(0.8)

      system.runTimeout(() => {
	    let kyle1 = Math.round((power * 42) + 28 + player.getComponent("health").defaultValue/4)
	    lib.sp.addEffect([{ name: "strength", duration: 60, lvl: 1 }])
		lib.sp.bind(0.6)
	    lib.sp.knockback(lib.velocity, 3.2, 0.1)
	    player.getEntitiesFromViewDirection({ excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
          let ent = new Entity(e.entity);

		  ent.addDamage(kyle1*lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.velocity, hor: 4.1, ver: 0.3 })
		  ent.runCommand(["particle cz:kyle_sweep ~~1~"])
	    })
	  }, 15)
	}
})

// Liberator Skill
weapon.registerWeapon("liberator", (player, lib, event) => {
	let soul = lib.soul[player.id] || 0

	// Skill 2
	if(player.isSneaking && !player.getEffect("speed")) {
		if(lib.sp.cooldown().isCd("liberator2", 6) == true) return
	
		let entity = player.getEntitiesFromViewDirection({ excludeTypes: ["minecraft:item","cz:indicator"] })[0] || undefined
        if(!entity || entity == undefined || entity == null) return
        let ent = new Entity(entity.entity)

        lib.sp.minStamina("value", 10)// Stamina
        player.playAnimation("animation.liberator.swing_teleport", { blendOutTime: 0.35 })

	    lib.sp.knockback({ x: -lib.velocity.x, y: lib.velocity.y, z: -lib.velocity.z }, 5, 0.5)
        lib.sp.addEffect([{ name: "resistance", duration: 5, lvl: 2}])
        lib.sp.bind(0.6)
        ent.addDamage((18+(soul*8))*lib.multiplier, { cause: "entityAttack", damagingEntity: player })

        system.runTimeout(() => {
        	player.teleport(entity.entity.location, { rotation: player.getRotation() })
            ent.knockback(lib.velocity, 2, 0.5)
            ent.selfParticle("cz:white_slash")
            ent.addEffect([{ name: "poison", duration: 20, lvl: 5 }, { name: "slowness", duration: 5, lvl: 3 }])
            lib.sp.removeEffect(["slowness", "weakness"])
        }, 6)
	} else if(player.isSneaking == false && player.isOnGround == false) {// Skill Special
	    if(lib.sp.cooldown().isCd("liberatorS", 12) == true) return

	    lib.sp.minStamina("value", 12)// Stamina
		player.playAnimation("animation.liberator.summon", { blendOutTime: 0.35 })

		lib.sp.runCommand(["summon cz:angel ~~-0.5~"])
		lib.sp.particles(["cz:impact_dowm","cz:impact_p"])
		lib.sp.addEffect([{ name: "slowness", duration: 9, lvl: 255 },{ name: "resistance", duration: 9, lvl: 255 }])
		lib.sp.knockback(lib.velocity, 2, 1.8)

		system.runTimeout(() => {
			player.applyKnockback(lib.vel.x, lib.vel.z, 0, -2.4)

			system.runTimeout(() => {
				lib.sp.runCommand([`damage @e[r=5,name=${lib.notSelf},type=!cz:angel,type=!item,type=!cz:indicator] ${Math.floor(((soul*8) + 36) * lib.multiplier)} entity_attack entity @s`,`camerashake add @s 2 0.1`,"particle cz:knockback_low ~~1~","particle cz:impact_particle ~~~"])
				lib.sp.impactParticle()
				lib.sp.addEffect([{ name: "regeneration", duration: soul*30+20, lvl: soul*2 }])
				lib.sp.heal(soul*14)
				lib.soul[player.id] = undefined
			}, 6)
		}, 7)
	} else if(player.isOnGround == true && player.getEffect("speed") && player.isSneaking == true) {// Skill 3
	  if(lib.sp.cooldown().isCd("liberator3", 12) == true) return

	  lib.sp.minStamina("value", 7)// Stamina
	  if(soul < 3) return player.sendMessage({ translate: "system.notEnoughSoul" })

	  lib.soul[player.id] = undefined
      player.triggerEvent("cz:add_liberator")
      lib.sp.selfParticle("cz:liberator_immortal")
      player.removeEffect("speed")
      lib.sp.addEffect([{ name: "water_breathing", duration: 100, lvl: 1 }])
      system.runTimeout(() => player.triggerEvent("cz:clear"), 100)
	} else {// Skill 1
	  if(lib.sp.cooldown().isCd("liberator1", 3) == true) return

	  lib.sp.minStamina("value", 4)// Stamina
	  player.playAnimation("animation.kyle.slash", { blendOutTime: 0.35 })// Animation

      lib.sp.addEffect([{ name: "speed", duration: 80, lvl: 2 }])
      world.getDimension(player.dimension.id).getEntities({ location: player.location, maxDistance: 5, minDistance: 0, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"]}).forEach(e => {
      	new Entity(e).addDamage((soul*3+12) * lib.multiplier, { cause: "entityAttack", damagingEntity: player })
          new Entity(e).selfParticle("cz:white_slash")
          lib.sp.heal(1)
      })
	}
})

// Silent
weapon.registerWeapon("silent", (player, lib, event) => {
	// Skill 2
	if(player.isSneaking) {
		if(lib.sp.cooldown().isCd("silent2", 10) == true) return

		if(lib.silentState.includes(player.id)) return player.sendMessage({ translate: "system.skillUsed" })
		lib.sp.minStamina("value", 8)// Stamina
		player.playAnimation("animation.weapon.dash.front", { blendOutTime: 0.8 })// Animation

        let silentState = lib.silentState, pos = player.location
		silentState.push(player.id)
		lib.sp.dash(lib.velocity, 8, 0)
		lib.sp.addEffect([{ name: "speed", duration: 100, lvl: 3 }])

		system.runTimeout(() => {
			player.playAnimation("animation.weapon.dash.atk", { blendOutTime: 0.05 })

			player.teleport(pos, { rotation: player.getRotation() })
			let stack = world.scoreboard.getObjective("silent").getScore(player.scoreboardIdentity) || 0
			silentState.splice(silentState.indexOf(player.id), 1)
			lib.sp.runCommand([`damage @e[tag=silent_target] ${(stack*6+12) * lib.multiplier} entity_attack entity @s`,`execute as @e[tag=silent_target] run particle cz:silent_nuke ~~1.1~`,`scoreboard players set @s silent 0`,`tag @e remove silent_target`])
		}, 100)
	} else if(player.isOnGround == false && player.isSneaking == false) {// Skill 3
	    if(lib.sp.cooldown().isCd("silent3", 6) == true) return

	    lib.sp.minStamina("value", 13)// Stamina
	    player.playAnimation("animation.weapon.crushing", { blendOutTime: 0.35 })// Animation
	    lib.sp.impactParticle()

	    lib.sp.runCommand([`damage @e[r=6,name=${lib.notSelf},type=!item,type=!cz:indicator] ${Math.floor((world.scoreboard.getObjective("silent").getScore(player.scoreboardIdentity) * 18 + 18) * lib.multiplier)} entity_attack entity @s`,"particle cz:impact_particle ~~~",`effect @e[r=6,name=${lib.notSelf},type=!item] slowness 2 2`])
	    lib.sp.knockback(lib.velocity, 0, -0.6)
	} else if(player.getEffect("strength") && player.isSneaking == false) {// Skill Special
	    if(lib.sp.cooldown().isCd("silentS", 3) == true) return

	    lib.sp.minStamina("value", 2)// Stamina
        player.playAnimation("animation.weapon.push", { blendOutTime: 0.35 })// Animation

        let entity = player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"] })[0].entity, ent = new Entity(entity)
        if(!entity || entity == null || entity == undefined) return

        player.runCommand("scoreboard players add @s silent 12")
        ent.addDamage((world.scoreboard.getObjective("silent").getScore(player.scoreboardIdentity)*5) * lib.multiplier, { cause: "entityAttack", damagingEntity: player })
	} else {// Skill 1
	    let target = player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"] })[0]
        if(!target || target == undefined) return
        
        if(lib.sp.cooldown().isCd("silent1", 1.5) == true) return

	    lib.sp.minStamina("value", 6)// Stamina
	    player.playAnimation("animation.weapon.slice.double", { blendOutTime: 0.05 })


		target.entity.applyDamage(18, { cause: "entityAttack", damagingEntity: player })
	    player.runCommand("scoreboard players add @s silent 6")
	    lib.sp.addEffect([{ name: "strength", duration: 100, lvl: 3 }])

		system.runTimeout(() => target.entity.applyDamage(26*lib.multiplier, { cause: "entityAttack", damagingEntity: player }), 10)
	}
})

// Destiny
weapon.registerWeapon("destiny", (player, lib, event) => {
	let target = player.getEntitiesFromViewDirection({ maxDistance: 9, excludeTypes: ["minecraft:item","cz:indicator"] })[0] || undefined
	if(!target || target == undefined || target == null) return
	target = target.entity
	let ent = new Entity(target)

	let distance = Math.sqrt((player.location.x - target.location.x) ** 2 + (player.location.z - target.location.z) ** 2) || 0


	// Skill 2
	if(player.isSneaking) {
	  if(lib.sp.cooldown().isCd("destiny2", 6) == true) return

	  lib.sp.minStamina("value", 8)// Stamina
	  player.playAnimation("animation.weapon.dash.atk", { blendOutTime: 0.35 })// Animation
	  player.runCommand(`camerashake add @s 1.2 0.09`)

	  lib.sp.dash(lib.velocity, distance*1.9, 0)
	  system.runTimeout(() => {
		target.addTag("silence")
		enParticle(target, "cz:knockback_low", { y: 1 })
		ent.addDamage((distance*10+8) * lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.velocity, hor: 3, ver: 0.8 })
	  }, distance*0.08)
	} else if(player.isOnGround == false && player.isSneaking == false) {// Skill 3
	  if(lib.sp.cooldown().isCd("destiny3", 8) == true) return

	  lib.sp.minStamina("value", 14)// Stamina
	  player.playAnimation("animation.weapon.slice.up", { blendOutTime: 0.35 })// Animation

      lib.sp.knockback(lib.velocity, distance*0.8, 0)
      lib.sp.addEffect([{ name: "slowness", duration: 8, lvl: 255 }]);
	  ent.addDamage((distance*6+8) * lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.vel, hor: 0, ver: 1.7})

	  system.runTimeout(() => {
		player.runCommand(`camerashake add @s 1 0.2`)
		world.getDimension(target.dimension.id).createExplosion(target.location, 6, { breaksBlocks: false, source: player })

		target.addTag("silence")
		enParticle(target, "cz:knockback_low", { y: 1 })
		ent.addDamage(11*lib.multiplier, { cause: "entityAttack", damagingEntity: player })
	  }, 9)
	} else if(player.getEffect("weakness") && player.isSneaking == false) {// Skill Special
	  lib.sp.minStamina("value", 10)// Stamina
	  player.playAnimation("animation.weapon.swing.delay", { blendOutTime: 0.25 })// Animation

	  lib.sp.addEffect([{ name: "speed", duration: 8, lvl: 2 }])
	  system.runTimeout(() => {
		lib.sp.dash(lib.velocity, 5.2, 0)
		system.runTimeout(() => player.runCommand(`damage @e[r=4,name=${lib.notSelf},type=!item] ${Math.floor(11*lib.multiplier)} entity_attack entity @s`), 4.2)
	  }, 8)
	} else {// Skill 1
	  if(lib.sp.cooldown().isCd("destiny1", 3) == true) return

	  lib.sp.minStamina("value", 8)// Stamina
	  player.playAnimation("animation.weapon.slice.double", { blendOutTime: 0.35 })// Animation

	  ent.knockback(lib.velocity, distance*0.7+1.3, 0)

	  target.addTag("silence")
	  lib.sp.dash(lib.velocity, 0.6*distance+1, 0.1)
	  lib.sp.addEffect([{ name: "slowness", duration: 120, lvl: 1 }, { name: "weakness", duration: 60, lvl: 1 }])
	  ent.addDamage((distance*6+6) * lib.multiplier, { cause: "entityAttack", damagingEntity: player })
	}
})

// Skyler
weapon.registerWeapon("skyler", (player, lib, event) => {
	if(player.isSneaking) {// Skill 2
	    if(lib.sp.cooldown().isCd("skyler2", 5) == true) return
	
	    lib.sp.minStamina("value", 12)
		player.playAnimation("animation.weapon.swing.delay", { blendOutTime: 0.25 })// Animation
		let maxDuration = 30, power = Math.floor(maxDuration * (1 - event.useDuration / (maxDuration * 20)));

        system.runTimeout(() => {
		  world.getDimension(player.dimension.id).getEntities({ maxDistance: 6, location: player.location, minDistance: 0, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
			let ent = new Entity(e)
			e.setOnFire(5)
			ent.selfParticle("cz:orange_slash")
			ent.addDamage(12*lib.multiplier, { cause: "fire", damagingEntity: player }, { vel: lib.vel, hor: 0, ver: power+1.3 })
			ent.particles(["cz:fireing_hit","cz:impact_down"])
		  })
		}, 7)
	} else if(!player.isSneaking && !player.isOnGround && !player.getEffect("fire_resistance")) {// Skill 3
		player.playAnimation("animation.weapon.slice.up", { blendOutTime: 0.35 })// Animation

		let target = player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"] })[0]
		if(!target) return
		if(lib.sp.cooldown().isCd("skyler3", 8) == true) return

		lib.sp.minStamina("value", 10)
		target = target.entity
		let distance = Math.sqrt((player.location.x - target.location.x) ** 2 + (player.location.z - target.location.z) ** 2) || 0

		system.runTimeout(() => {
          lib.sp.knockback(lib.vel, distance*1.2, 0)
          target.setOnFire(5)
          new Entity(target).selfParticle("cz:orange_slash")
		  new Entity(target).addDamage(18*lib.multiplier, { cause: "fire", damagingEntity: player }, { vel: lib.vel, hor: 0.3, ver: 0 })
		}, 3)
	} else if(!player.isSneaking && !player.isOnGround && player.getEffect("fire_resistance")) {// Skill 3 - Special
	    if(lib.sp.cooldown().isCd("skylerUlt", 22) == true) return

		player.playAnimation("animation.weapon.swash", { blendOutTime: 0.35 })// Animation
		
		function fireingZone() {
			if(player.hasTag("fireing_zone")) return player.sendMessage({ translate: "system.skillUsed" })
			lib.sp.minStamina("value", 14)
			lib.sp.selfParticle("cz:fireing_explode")
			player.addTag("fireing_zone")
			
			let zone = system.runInterval(() => {
				lib.sp.addEffect([{ name: "fire_resistance", duration: 5, lvl: 1 }])
				lib.sp.selfParticle("cz:fireing_zone")
				lib.sp.selfParticle("cz:fireing_burns")
				world.getDimension(player.dimension.id).getEntities({ maxDistance: 5, location: player.location, minDistance: 0, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
					let ent = new Entity(e)
					e.setOnFire(5)
					ent.selfParticle("minecraft:lava_particle")
					ent.addDamage(3*lib.multiplier, { cause: "fire", damagingEntity: player })
					ent.addEffect([{ name: "slowness", duration: 5, lvl: 0 },{ name: "weakness", duration: 5, lvl: 0 }])
				})
			}, 5)
			system.runTimeout(() => {
				system.clearRun(zone)
				player.removeTag("fireing_zone")
			}, 300)
		}
		fireingZone()
	} else {// Skill 1
	    if(lib.sp.cooldown().isCd("skyler1", 3) == true) return

		lib.sp.minStamina("value", 6)
		player.playAnimation("animation.kyle.slash", { blendOutTime: 0.35 })// Animation

		system.runTimeout(() => {
			lib.skyler[player.id] = 5
			player.getEntitiesFromViewDirection({ maxDistance: 7, excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(i => {
				i.entity.setOnFire(5)
				new Entity(i.entity).addDamage(14*lib.multiplier, { cause: "fire", damagingEntity: player }, { vel: lib.velocity, hor: 2.7, ver: 0 })
				new Entity(i.entity).selfParticle("cz:orange_slash")
			})
		}, 4)
	}
})

// Endless
weapon.registerWeapon("endless", (player, lib, event) => {
	let ammo = lib.endless[player.id] || 0, ran = Math.random() * 5 + 1

	function reload() {
		player.playAnimation("animation.weapon.gun.reload.endless", { blendOutTime: 0.35 })// Animation
		lib.sp.addEffect([{ name: "speed", duration: 10, lvl: 1 }])
		player.sendMessage({ translate: "system.reload" })

		system.runTimeout(() => {
          lib.endless[player.id] = 12
          player.runCommand("playsound shotgun.pump @s")
        }, 12)
	}
	function useAmmo() {
		if(ran < 5) return lib.endless[player.id] -= 1
		
		if(lib.endless[player.id] + 1 <= 12) lib.endless[player.id] += 1
		lib.sp.removeEffect(["slowness"])
		player.runCommand("playsound shotgun.pump @s")
	}

	if(ammo > 0) {
	  useAmmo()
	  if(player.isSneaking == true) {// Skill 2
	     if(lib.sp.cooldown().isCd("endless2", 2.5) == true) return

	     lib.sp.minStamina("value", 8)
	     lib.sp.knockback(lib.velocity, 4, 0)
	     player.playAnimation("animation.weapon.dash.front", { blendOutTime: 0.8 })// Animation
	     lib.sp.addEffect([{ name: "speed", duration: 80, lvl: 3 },{ name: "resistance", duration: 60, lvl: 0 }])
	     reload()
	  } else if(player.isOnGround == false && player.isSneaking == false && !player.getEffect("speed")) {// Skill 3
	      if(lib.sp.cooldown().isCd("endless3", 5) == true) return

	      lib.sp.minStamina("value", 10)
		  player.playAnimation("animation.weapon.gun.double.heavy", { blendOutTime: 0.35 })// Animation
		  lib.sp.knockback(lib.velocity, 0, -2)

		  system.runTimeout(() => {
		    player.getEntitiesFromViewDirection({ maxDistance: 9, excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(i => {
			  let ent = new Entity(i.entity)
			  ent.addDamage(10*lib.multiplier, { cause: "entityExplosion", damagingEntity: player }, { vel: lib.vel, hor: 3, ver: 1.5 })
		    })
		  }, 9)
	  } else if(player.isOnGround == false && player.getEffect("speed")) {// Skill Special
	      if(ammo < 1) return reload()

		  if(lib.sp.cooldown().isCd("endlessS", 3) == true) return

		  lib.sp.minStamina("value", 8)
		  player.playAnimation("animation.weapon.gun.shoot.normal", { blendOutTime: 0.35 })// Animation

		  system.runTimeout(() => {
			useAmmo()
			player.triggerEvent("cz:endless_ultimate")
			lib.sp.impactParticle()
		  }, 9)
	  } else {// Skill 1
	      if(ammo < 2) return reload()

	      if(lib.sp.cooldown().isCd("endless1", 1) == true) return

		  lib.sp.minStamina("value", 6)
		  player.playAnimation("animation.weapon.gun.shoot", { blendOutTime: 0.35 })// Animation

          system.runTimeout(() => {
            player.runCommand("playsound gun.uzi @s")
            lib.sp.addEffect([{ name: "slowness", duration: 6, lvl: 255, hide: false }])
        	player.triggerEvent("cz:endless_1")

		    system.runTimeout(() => {
			  lib.sp.knockback(lib.vel, 4, 0)
			  useAmmo()
			  player.runCommand("playsound gun.uzi @s")
              player.triggerEvent("cz:endless_1")
            }, 5)
		  }, 6)
	  }
	} else reload()
})

// Lectaze
weapon.registerWeapon("lectaze", (player, lib, event) => {
	lib.lectaze[player.id] = lib.lectaze[player.id] || 0
	if(player.isSneaking) {// Skill 2
		if(lib.sp.cooldown().isCd("lectaze2", 4) == true) return

		lib.sp.minStamina("value", 12)
		player.playAnimation("animation.weapon.swash", { blendOutTime: 0.25 })// Animation
		delete lib.lectaze[player.id]
		world.getDimension(player.dimension.id).getEntities({ maxDistance: 8, location: player.location, minDistance: 0, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"]}).forEach(e => {
			if(["cz:lectaze_sword", "cz:lectaze_creation"].includes(e.typeId)) return
			world.getDimension(e.dimension.id).spawnEntity("cz:lectaze_sword<cz:lectaze_rain>", { x: e.location.x, y: e.location.y + 18, z: e.location.z})
		})
	} else if(!player.isSneaking && !player.isOnGround && !player.getEffect("strength")) {// Skill 3
	    if(lib.sp.cooldown().isCd("lectaze3", 8.5) == true) return

	    lib.sp.minStamina("value", 7)
		player.playAnimation("animation.weapon.slice.up", { blendOutTime: 0.25 })// Animation
		system.runTimeout(() => player.triggerEvent("cz:lectaze_slash"), 1.5)
	} else if(player.isOnGround == false && player.getEffect("strength")) {// Skill Special
	    if(lib.sp.cooldown().isCd("lectazeS", 12) == true) return
	    lib.sp.minStamina("value", 9)

	    world.getDimension(player.dimension.id).getEntities({ maxDistance: 9, location: player.location, minDistance: 0, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
		  world.getDimension(e.dimension.id).createExplosion(e.location, 8*lib.multiplier, { breaksBlocks: false, source: player })
		})
	} else {// Skill 1
	    if(lib.sp.cooldown().isCd("lectaze1", 0.5) == true) return

		player.playAnimation("animation.weapon.spear.push", { blendOutTime: 0.35 })// Animation
		lib.sp.minStamina("value", 9)

		system.runTimeout(() => {
		  player.triggerEvent("cz:lectaze_1")
		  lib.sp.knockback(player.getVelocity(), 3, 0)
	  	lib.lectaze[player.id] - 1 > 0 ? lib.lectaze[player.id] -= 1 : delete lib.lectaze[player.id]

		  player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(i => {
			new Entity(i.entity).addDamage(11*lib.multiplier, { cause: "entityAttack", damagingEntity: player })
			new Entity(i.entity).selfParticle("cz:blue_light_slash")
		  })
		}, 4)
	}
})

// Pandora
weapon.registerWeapon("pandora", (player, lib, event) => {
	if(player.isSneaking == true && player.isOnGround == true) {// Skill 2
	    if(lib.sp.cooldown().isCd("pandora2", 6) == true) return

		player.playAnimation("animation.weapon.throw_projectile", { blendOutTime: 0.35 })// Animation
		lib.sp.minStamina("value", 12)

		system.runTimeout(() => {
          world.getDimension(player.dimension.id).getEntities({ maxDistance: 3, location: player.location, minDistance: 0, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
			let ent = new Entity(e), stack = ent.status().getStatus("outBox").lvl || 0, dmg = 16
			ent.addDamage((dmg + stack)*lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.vel, hor: 0.5, ver: 0.5 })
		  })
	  	world.getDimension(player.dimension.id).getEntities({ maxDistance: 5, location: player.location, minDistance: 3.01, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
		    let ent = new Entity(e), stack = ent.status().getStatus("outBox").lvl || 0, dmg = 12
		    ent.addDamage((dmg + stack)*lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.vel, hor: 2, ver: 0 })
		  })
		}, 5)
	} else if(player.isSneaking == false && player.isOnGround == false) {// Skill 3
		let target = player.getEntitiesFromViewDirection({ maxDistance: 7, excludeTypes: ["minecraft:item","cz:indicator"] })[0] || undefined
		if(!target || target == undefined) return

		if(lib.sp.cooldown().isCd("pandora3", 6) == true) return

		player.playAnimation("animation.weapon.swing.great", { blendOutTime: 0.35 })// Animation
		lib.sp.minStamina("value", 18)

		let ent = new Entity(target.entity), stack = ent.status().getStatus("outBox").lvl || 0, dmg = 12
		lib.sp.knockback(lib.velocity, target.distance*0.8, -4)
		system.runTimeout(() => {
		  ent.addDamage((dmg + target.distance*2 + stack) * lib.multiplier, { cause: "entityAttack", damagingEntity: player },{ vel: lib.velocity, hor: target.distance, ver: 0.2 })
		}, 7)
	} else if(player.isSneaking == true && player.isOnGround == false) {// Skill Special 
		if(lib.sp.cooldown().isCd("pandoraS", 10) == true) return

		player.playAnimation("animation.weapon.swing.delay", { blendOutTime: 0.35 })// Animation
		lib.sp.minStamina("value", 12)

		lib.sp.knockback(lib.velocity, 1.9, -2)
		system.runTimeout(() => {
			world.getDimension(player.dimension.id).getEntities({ maxDistance: 7, location: player.location, minDistance: 0, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
				let ent = new Entity(e), stack = ent.status().getStatus("outBox").lvl || 0, dmg = 16
				ent.addDamage((dmg + stack)*lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.vel, hor: 0.5, ver: 0.5 })
				system.runTimeout(() => ent.addDamage((dmg + stack * 5) * lib.multiplier, { cause: "entityAttack", damagingEntity: player }), 5)
		    })
		}, 7)
	} else {
		if(lib.sp.cooldown().isCd("pandora1", 3.5) == true) return

		player.playAnimation("animation.weapon.slice.up", { blendOutTime: 0.35 })// Animation
		lib.sp.bind(0.8)

		system.runTimeout(() => {
			player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(i => {
				let dmg = 12, knock = 0.5

				if(i.entity.isOnGround == false) {
					dmg = 16
					knock = 0.8
				}

				new Entity(i.entity).addDamage(dmg*lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.vel, hor: 0.2, ver: knock })
			})
		}, 6)
	}
})

// Catlye
weapon.registerWeapon("catlye", async (player, lib, event) => {
	lib.catlye[player.id] = lib.catlye[player.id] || 0
	
	if(player.isSneaking == true) {// Skill 2
	    if(lib.sp.cooldown().isCd("catlye2", 8) == true) return

		lib.sp.minStamina("value", 24)
	    player.playAnimation("animation.weapon.staff.shoot", { blendOutTime: 0.25 })// Animation
	    lib.sp.selfParticle("cz:catlye_zone")

        system.runTimeout(() => {
	      world.getDimension(player.dimension.id).getEntities({ maxDistance: 6, location: player.location, minDistance: 0, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(i => {
		    new Entity(i).healable({ amount: 6, source: "catlye" })
		  })
		}, 2)
	} else if(player.isSneaking == false && lib.catlye[player.id] >= 3) {// Skill Special
	    if(lib.sp.cooldown().isCd("catlyeS", 3) == true) return

	    lib.sp.minStamina("value", 22)
	    player.playAnimation("animation.weapon.staff.shoot", { blendOutTime: 0.25 })// Animation

	    system.runTimeout(() => {
	      player.getEntitiesFromViewDirection({ maxDistance: 15, excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
		    new Entity(e.entity).healable({ amount: 6, source: "catlye" })
		  })
		  delete lib.catlye[player.id]
		}, 2)
	} else if(player.isOnGround == false) {// Skill 3
	   function catUlt() {
		  if(lib.sp.cooldown().isCd("catlye3", 25) == true) return

		  if(player.hasTag("catlye_ult")) return player.sendMessage({ translate: "system.skillUsed" })
		  lib.sp.minStamina("value", 8)
	      player.playAnimation("animation.weapon.swash", { blendOutTime: 0.25 })// Animation

          player.addTag("catlye_ult")
	      let und = system.runInterval(() => {
		    lib.sp.minStamina("value", 1)
		    lib.sp.selfParticle("cz:catlye_zone")
		    world.getDimension(player.dimension.id).getEntities({ maxDistance: 8, location: player.location, minDistance: 0, excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(r => {
			  new Entity(r).healable({ amount: 1, source: "catlye"})
			})
          }, 10)

	      system.runTimeout(() => {
		    player.removeTag("catlye_ult")
		    system.clearRun(und)
	      }, 300)
	   }
		
	   catUlt()
	} else {// Skill 1
	    if(lib.sp.cooldown().isCd("catlye1", 1.5) == true) return

	    lib.sp.minStamina("value", 20)
	    player.playAnimation("animation.weapon.staff.shoot", { blendOutTime: 0.25 })// Animation
		let entity = player.getEntitiesFromViewDirection({ maxDistance: 9, excludeTypes: ["minecraft:item","cz:indicator"] })[0]
		!entity ? entity = player : entity = entity.entity

        system.runTimeout(() => {
		  let cat = lib.catlye[player.id] || 0
		  lib.catlye[player.id] = cat + 1
		  new Entity(entity).healable({ amount: 4, source: "catyle" })
		}, 2)
	}
})

// Quezn
weapon.registerWeapon("quezn", (player, lib, event) => {
	player.triggerEvent("cz:shield_1")// Pasif R-amx
	if(player.isSneaking == true) {// Skill 2
		if(lib.sp.cooldown().isCd("quezn2", 5) == true) return

		lib.sp.minStamina("value", 8)
		player.playAnimation("animation.weapon.swash", { blendOutTime: 0.35 })// Animation
		
		system.runTimeout(() => {
			player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
				let distance = Math.sqrt((player.location.x - e.entity.location.x) ** 2 + (player.location.z - e.entity.location.z) ** 2) || 0
				new Entity(e.entity).addDamage(12*lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.vel, ver: -distance, hor: 0 })
				new Entity(e.entity).selfParticle("cz:white_slash")
			})
		}, 3)
	} else if(player.isSneaking == false && player.isOnGround == false) {// Skill 3
		if(lib.sp.cooldown().isCd("quezn3", 8) == true) return

		lib.sp.minStamina("value", 10)
		player.playAnimation("animation.weapon.swing.delay", { blendOutTime: 0.35 })// Animation

		lib.sp.knockback(lib.velocity, 5, -2)
		system.runTimeout(() => {
			world.getDimension(player.dimension.id).getEntities({ maxDistance: 6, location: player.location, minDistance: 0, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
				new Entity(e).addDamage(12*lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.vel, ver: 0, hor: -50 })
				new Entity(e).selfParticle("cz:white_slash")
			})
		}, 6)
	} else if(player.isOnGround == true && lib.sp.status().hasStatusName("quezn_charge") == true) {
		let target = player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"] })[0] || undefined
		if(!target || target == undefined) return

		if(lib.sp.cooldown().isCd("queznS", 6) == true) return

		lib.sp.minStamina("value", 6)
		player.playAnimation("animation.weapon.impact", { blendOutTime: 0.35 })// Animation

		lib.sp.impactSkill(14, { ...lib, single: true, ent: new Entity(target.entity), ver: target.distance })
	} else {// Skill 1
		let status = lib.sp.status()
		
		if(status.getStatus("quezn_charge").error == undefined) return player.sendMessage({ translate: "system.skillUsed" })
		if(lib.sp.cooldown().isCd("quezn1", 6) == true) return

		lib.sp.minStamina("value", 6)

		lib.sp.addEffect([{ name: "speed", duration: 100, lvl: 1 }])
		status.addStatus("quezn_charge", 5, { type: "hit", decay: "time" })
	}
})

// Destreza
weapon.registerWeapon("destreza", (player, lib, event) => {
    //console.warn(lib.sp.hasDebuffEffect())
	if(player.isSneaking == true) {// Skill 2
		if(lib.sp.cooldown().isCd("destreza2", 8) == true) return

		player.playAnimation("animation.weapon.swash", { blendOutTime: 0.25 })// Animation
		lib.sp.minStamina("value", 12)

		world.getDimension(player.dimension.id).getEntities({ maxDistance: 6, location: player.location, minDistance: 0, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
			let ent = new Entity(e)
		    ent.selfParticle("cz:gray_slash")
			ent.addDamage(14*lib.multiplier, { cause: "magic", damagingEntity: player })
			ent.addEffect([{ name: "slowness", duration: 60, lvl: 1 },{ name: "poison", duration: 20, lvl: 4 }])
		})
	} else if(lib.sp.hasDebuffEffect() && player.isOnGround == true && !player.isSneaking) {// Skill Spesial
		if(lib.sp.cooldown().isCd("destrezaS", 8) == true) return
		lib.sp.minStamina("value", 10)

		lib.sp.removeEffect(lib.sp.hasDebuffEffect())
		lib.sp.heal(player.getComponent("health").defaultValue/5)
	} else if(player.isSneaking == false && player.isOnGround == false) {// Skill 3
		let target = player.getEntitiesFromViewDirection({ maxDistance: 8, excludeTypes: ["minecraft:item","cz:indicator"] })[0] || undefined
		if(!target || target == undefined) return

		if(lib.sp.cooldown().isCd("destreza3", 8) == true) return
		lib.sp.minStamina("value", 13)

		let ent = new Entity(target.entity)
		lib.sp.knockback(lib.velocity, target.distance, -2)
		system.runTimeout(() => {
			ent.addDamage(18*lib.multiplier, { cause: "magic", damagingEntity: player })

			world.getDimension(target.entity.dimension.id).getEntities({ maxDistance: 6, location: target.entity.location, minDistance: 0, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
				new Entity(e).addEffect([{ name: "poison", duration: 100, lvl: 2 },{ name: "weakness", duration: 100, lvl: 1 }])
			})
		}, target.distance*1.3)
	} else {// Skill 1
		if(lib.sp.cooldown().isCd("destreza1", 2.5) == true) return

		player.playAnimation("animation.weapon.throw_projectile", { blendOutTime: 0.25 })// Animation
		lib.sp.minStamina("value", 8)

		system.runTimeout(() => {
	  	player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
			let ent = new Entity(e.entity)
			ent.selfParticle("cz:gray_slash")
			ent.addEffect([{ name: "poison", duration: 60, lvl: 1 }])
			ent.addDamage(12*lib.multiplier, { cause: "magic", damagingEntity: player }, { vel: lib.vel, hor: 1, ver: 0 })
	  	})
		}, 5)
	}
})

// Boltizer
weapon.registerWeapon("boltizer", (player, lib, event) => {
	let upper = lib.multiplier
	if(lib.sp.status().hasStatusName("electricity") == true) upper = upper + 0.4

	function bolt(ent) {
		if(ent.hasTag("boltizer_atk")) {
			ent.removeTag("boltizer_atk")
			world.getDimension(ent.dimension.id).spawnEntity("minecraft:lightning_bolt",ent.location)
		} else ent.addTag("boltizer_skill")
	}

	if(player.isSneaking == true) {// Skill 2
	    if(lib.sp.cooldown().isCd("boltizer2", 12) == true) return
	    lib.sp.minStamina("value", 12)

		player.playAnimation("animation.weapon.swash", { blendOutTime: 0.35 })// Animation

		world.getDimension(player.dimension.id).getEntities({ maxDistance: 9, location: player.location, minDistance: 3, excludeNames: [`${player.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
			bolt(e)
		    new Entity(e).addEffect([{ name: "weakness", duration: 60, lvl: 0 }])
		})
	} else if(player.isOnGround == false && lib.sp.status().hasStatusName("electricity") == true) {// Skill Special
		if(lib.sp.cooldown().isCd("boltizerS", 20) == true) return
	    lib.sp.minStamina("value", 24)
		lib.multiplier = upper
		player.playAnimation("animation.weapon.impact", { blendOutTime: 0.35 })// Animation

		lib.sp.impactSkill(18, lib, () => {
			world.getDimension(player.dimension.id).spawnEntity("minecraft:lightning_bolt",player.location)
			lib.sp.status().removeStatus("electricity")
			lib.sp.removeEffect(["resistance","weakness"])
        })
	} else if(player.isSneaking == false && player.isOnGround == false) {// Skill 3
		if(lib.sp.cooldown().isCd("boltizer3", 9) == true) return
	    lib.sp.minStamina("value", 20)

		lib.sp.addEffect([{ name: "resistance", duration: 200, lvl: 1 },{ name: "fire_resistance", duration: 200, lvl: 1 }])
		lib.sp.status().addStatus("electricity", 10, { lvl: 5, type: "none", decay: "time", stack: false })
		world.getDimension(player.dimension.id).spawnEntity("minecraft:lightning_bolt",player.location)
	} else {// Skill 1
		player.playAnimation("animation.weapon.pierce", { blendOutTime: 0.05 })// Animation

		let target = player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"] })[0] || undefined
		if(!target) return
		if(lib.sp.cooldown().isCd("boltizer1", 4) == true) return

		lib.sp.minStamina("value", 7)

		system.runTimeout(() => {
          new Entity(target.entity).addDamage(12*upper, { cause: "lightning", damagingEntity: player })
	  	bolt(target.entity)
		}, 3)
	}
})