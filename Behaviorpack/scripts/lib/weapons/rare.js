import { EffectTypes, system, world } from "@minecraft/server";
import { weapon, Entity } from "../../system.js";

// Greatsword
weapon.registerWeapon("greatsword", (player, lib, event) => {
	if(lib.sp.cooldown().isCd("greatsword", 8) == true) return

	player.playAnimation("animation.weapon.swing.great", { blendOutTime: 0.35 })// Animation
	lib.sp.bind(1.2)
	lib.sp.minStamina("value", 14)

	system.runTimeout(() => {
		lib.sp.runCommand([`execute positioned ^^^2 run damage @e[name=${lib.notSelf},r=2.5,type=!item,type=!cz:indicator] ${Math.floor(22 * lib.multiplier)} entity_attack entity @s`])
	}, 13)
})

// Reaper
weapon.registerWeapon("reaper", (player, lib, event) => {
	if(lib.sp.cooldown().isCd("reaper", 6) == true) return

	player.playAnimation("animation.weapon.slice.right", { blendOutTime: 0.35 })// Animation
    lib.sp.minStamina("value", 8)

	system.runTimeout(() => {
		lib.sp.runCommand([`damage @e[r=4,name=${lib.notSelf},type=!item,type=!cz:indicator] ${Math.floor(9 * lib.multiplier)} entity_attack entity @s`])
    }, 2)
})

// Hammer
weapon.registerWeapon("hammer", (player, lib, event) => {
	if(lib.sp.cooldown().isCd("hammer", 5) == true) return

	player.playAnimation("animation.weapon.crushing", { blendOutTime: 0.35 })// Animation
    lib.sp.minStamina("value", 12)

	system.runTimeout(() => {
		lib.sp.runCommand([`damage @e[r=4,name=${lib.notSelf},type=!item,type=!cz:indicator] ${Math.floor(14 * lib.multiplier)} entity_attack entity @s`])
    }, 2)
})

// Katana
weapon.registerWeapon("katana", (player, lib, event) => {
	if(lib.sp.cooldown().isCd("katana", 5) == true) return

	player.playAnimation("animation.weapon.slice.up", { blendOutTime: 0.35 })// Animation
    lib.sp.minStamina("value", 7)

	player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
		let ent = new Entity(e.entity)
		ent.addDamage(14*lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.vel, hor: 2, ver: 0 })
		ent.addEffect([{ name: "weakness", duration: 20, lvl: 1 }])
	})
})

// Spear
weapon.registerWeapon("spear", (player, lib, event) => {
	if(lib.sp.cooldown().isCd("spear", 6) == true) return

	let entity = player.getEntitiesFromViewDirection({ maxDistance: 6, excludeTypes: ["minecraft:item","cz:indicator"] })[0].entity || undefined, distance = Math.sqrt((player.location.x - entity.location.x) ** 2 + (player.location.z - entity.location.z) ** 2) || 0

	player.playAnimation("animation.weapon.dash.atk", { blendOutTime: 0.35 })// Animation
	lib.sp.minStamina("value", 6)
	new Entity(entity).addDamage((distance*3+2) * lib.multiplier, { cause: "entityAttack", damagingEntity: player }, { vel: lib.velocity, hor: 2, ver: 0 })
})