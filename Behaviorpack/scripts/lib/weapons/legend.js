import { EffectTypes, system, world } from "@minecraft/server";
import { weapon, Entity } from "../../system.js";

// Musha Skill
weapon.registerWeapon("musha", (player, lib, event) => {
  if(player.isSneaking) {
  } else {
    player.playAnimation("animation.kyle.slash", { blendOutTime: 0.35 }) // Animation
  }
})