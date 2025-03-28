import { Entity } from "../module.js";
import { world } from "@minecraft/server";

export const runeData = {
  gold_coin: {// 1
    moneyDrop: 0.1,
    atk: 0.15
  },

  silence_amulet: {// 2
    onHit(player, target) {
      new Entity(target).status().addStatus("silence_amulet", 3, { type: "silence", decay: "time", lvl: 1, stack: false });
    }
  },

  fire_emblem: {// 3
    fireFragile: 0.24,
    atk: 0.08
  },

  sharpness: {// 4
    atkFlat: 3
  },

  bloody_tear: {// 5
    onHit(player) {
      new Entity(player).heal(1);
    }
  },

  fire_amulet: {// 6
    onHit(player, target) {
      target.setOnFire(2);
    }
  },

  lucky_pin: {// 7
    critChance: 0.17,
    critDamage: 0.38
  },

  art_ring: {// 8
    artFragile: 0.29,
    skill: 0.11
  },

  obsidian_syal: {// 9
    skillDamageRed: 0.23,
    skillDamageRedFlat: 1
  },

  fire_crystal: {// 10
    fireFragile: 0.17,
    skill: 0.06
  },
  
  blue_fire_crystal: {// 11
    fireFragile: 0.25,
    atk: 0.08
  },

  atletic_ring: {// 12
    staminaReduction: 0.2,
    skillDodge: 0.1
  },

  steel_heart: {// 13
    skillDamageRed: 0.31
  },

  coin_emblem: {// 14
    atk: 0.1,
    critChance: 0.11,
    critDamage: 0.17
  },

  silence_aura: {// 15
    onHited(player, target) {
      new Entity(target).status().addStatus("silence_shield", 3, { type: "silence", decay: "time", lvl: 1, stack: false });
    }
  },

  thief_speciality: {// 16
    moneyDrop: 0.15,
    healingEffectifity: 0.2
  },

  poisoned_slop: {// 17
    skillDodge: 0.07,
    onHit(player, target) {
      if(player.getComponent("inventory").container.getSlot(player.selectedSlotIndex)?.getItem()?.getTags()?.includes("dagger"))
        new Entity(target).addEffectOne("poison", 5, 2)
    }
  },
  
  agility_gear: {// 18
    atk: 0.13,
    onKill(player) {
      new Entity(player).addEffectOne("speed", 1, 0)
    }
  },
  
  weak_point_glasses: {// 19
    onHit(player, target) {
      new Entity(target).addEffectOne("weakness", 2, 0)
    }
  },
  
  fire_flower: {// 20
    fireFragile: 0.14,
    onHited(player) {
      new Entity(player).addEffectOne("fire_resistance", 0.5, 0)
    }
  },

  destruction_path: {// 21
    skill: 0.11,
    onKill(player, target) {
      target.dimension.createExplosion(target.location || player.location, 3, { breaksBlocks: false, source: player })
    }
  },
  
  xiyanite_crystall: {// 22
    atk: 0.1,
    skill: 0.07,
    onHit(player, target) {
      new Entity(target).status().addStatus("xiyanit_silence", 2, { type: "silence", decay: "time", lvl: 1, stack: false });
      new Entity(player).heal(1);
    }
  },

  flame_tome: {// 23
    fireFragile: 0.28,
    atk: 0.05,
    skill: 0.07
  }
}