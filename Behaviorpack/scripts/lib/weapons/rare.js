import { EffectTypes, system, world } from "@minecraft/server";
import { Weapon, Entity } from "../ZxraLib/module.js";

// Greatsword
Weapon.registerSkill("greatsword", (player, lib, event) => {
	if(lib.sp.cooldown().cd("greatsword", 8)) return

	player.playAnimation("animation.weapon.swing.great", { blendOutTime: 0.35 })// Animation
	lib.sp.bind(1.2)
	lib.sp.minStamina("value", 14)

	system.runTimeout(() => {
		lib.sp.runCommand([`execute positioned ^^^2 run damage @e[name=${lib.notSelf},r=2.5,type=!item,type=!cz:indicator] ${Math.floor(22 * lib.multiplier)} entity_attack entity @s`])
	}, 13)
})

// Reaper
Weapon.registerSkill("reaper", (player, lib, event) => {
	if(lib.sp.cooldown().cd("reaper", 6)) return

	player.playAnimation("animation.weapon.slice.right", { blendOutTime: 0.35 })// Animation
    lib.sp.minStamina("value", 8)

	system.runTimeout(() => {
		world.getDimension(player.dimension.id).getEntities({ location: player.location, maxDistance: 4, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"]}).forEach(e => {
			new Entity(e).addDamage(Math.floor(9 * lib.multiplier), { cause: "entityAttack", damagingEntity: player })
		})
    }, 2)
})

// Hammer
Weapon.registerSkill("hammer", (player, lib, event) => {
	if(lib.sp.cooldown().cd("hammer", 5)) return

	player.playAnimation("animation.weapon.crushing", { blendOutTime: 0.35 })// Animation
    lib.sp.minStamina("value", 12)

	system.runTimeout(() => {
		world.getDimension(player.dimension.id).getEntities({ location: player.location, maxDistance: 4, minDistance: 0, excludeNames: [...lib.team], excludeTypes: ["minecraft:item","cz:indicator"]}).forEach(e => {
			new Entity(e).addDamage(Math.floor(14 * lib.multiplier), { cause: "entityAttack", damagingEntity: player })
		})
    }, 2)
})

// Katana
Weapon.registerSkill("katana", (player, lib, event) => {
	if(lib.sp.cooldown().cd("katana", 5)) return

	player.playAnimation("animation.weapon.slice.up", { blendOutTime: 0.35 })// Animation
    lib.sp.minStamina("value", 7)

	player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
		let ent = new Entity(e.entity)
		ent.addDamage(14*lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.vel, hor: 2, ver: 0 })
		ent.addEffect([{ name: "weakness", duration: 20, lvl: 1 }])
	})
})

// Spear
Weapon.registerSkill("spear", (player, lib, event) => {
	if(lib.sp.cooldown().cd("spear", 6)) return

	let entity = player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"] })[0].entity || undefined, distance = Math.sqrt((player.location.x - entity.location.x) ** 2 + (player.location.z - entity.location.z) ** 2) || 0

	player.playAnimation("animation.weapon.dash.atk", { blendOutTime: 0.35 })// Animation
	lib.sp.minStamina("value", 6)
	new Entity(entity).addDamage((distance*3+2) * lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.velocity, hor: 2, ver: 0 })
})