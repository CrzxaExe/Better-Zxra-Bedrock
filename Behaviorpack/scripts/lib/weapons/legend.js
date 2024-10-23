import { EffectTypes, system, world } from "@minecraft/server";
import { weapon, Entity } from "../../system.js";

// Musha Skill
weapon.registerWeapon("musha", (player, lib, event) => {
  let stk = lib.musha[player.id] || { atk: 0, stack: 0 };
  if(!player.isOnGround) {
    let target = player.getEntitiesFromViewDirection({ maxDistance: 5, excludeTypes: ["minecraft:item","cz:indicator"] })[0];
    if(!target) return;
    
    if(lib.sp.cooldown().isCd("musha2", 8) == true) return
	lib.sp.minStamina("value", 13)// Stamina

    player.playAnimation("animation.weapon.impact", { blendOutTime: 0.35 })// Animation

    lib.sp.impactSkill(12+parseInt(stk.stack), { ...lib, single: true, ent: new Entity(target.entity) })
  } else {
    if(lib.sp.cooldown().isCd("musha1", 3.5) == true) return
	lib.sp.minStamina("value", 8)// Stamina

    player.playAnimation("animation.kyle.slash", { blendOutTime: 0.35 }) // Animation

    system.runTimeout(() => {
  	lib.sp.runCommand([`execute positioned ^^^2 run damage @e[name=${lib.notSelf},r=3,type=!item,type=!cz:indicator] ${Math.floor((13+parseInt(stk.stack)) * lib.multiplier)} entity_attack entity @s`])
	}, 5)
  }
})