import { Entity } from "../module.js";
import { world } from "@minecraft/server";

export const runeData = {
  gold_coin: {// 1
    moneyDrop: 0.1,
    atk: 0.12
  },

  silence_amulet: {// 2
    onHit(player, target) {
      new Entity(target).status().addStatus("silence_amulet", 3, { type: "silence", decay: "time", lvl: 1, stack: false });
    }
  },

  fire_emblem: {// 3
    fireFragile: 0.2,
    atk: 0.08
  },

  sharpness: {// 4
    atkFlat: 2
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
    critDamage: 0.36
  },

  art_ring: {// 8
    artFragile: 0.25,
    skill: 0.1
  },

  obsidian_syal: {// 9
    skillDamageRed: 0.17,
    skillDamageRedFlat: 1
  },

  fire_crystal: {// 10
    fireFragile: 0.17,
    skill: 0.06
  },
  
  blue_fire_crystal: {// 11
    fireFragile: 0.23,
    atk: 0.08
  },

  atletic_ring: {// 12
    staminaReduction: 0.2,
    skillDodge: 0.07
  },

  steel_heart: {// 13
    skillDamageRed: 0.32
  },

  coin_emblem: {// 14
    atk: 0.1,
    critChance: 0.11,
    critDamage: 0.15
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
      if(player.getConponent("inventory").container.getSlot(player.selectedSlotIndex)?.getItem()?.getTags()?.includes("dagger"))
        new Entity(target).addEffectOne("poison", 5, 2)
    }
  },
  
  agility_gear: {// 18
    atk: 0.09,
    onKill(player) {
      new Entity(player).addEffectOne("speed", 1, 0)
    }
  },
  
  weak_poin_glasses: {// 19
    onHit(player, target) {
      new Entity(target).addEffectOne("weakness", 1, 0)
    }
  },
  
  fire_flower: {// 20
    fireFragile: 0.08,
    onHited(player) {
      new Entity(player).addEffectOne("fire_resistance", 0.5, 0)
    }
  },

  destruction_path: {// 21
    skill: 0.08,
    onKill(player, target) {
      target.dimension.createExplosion(target.location || player.location, 3, { breaksBlocks: false, source: player })
    }
  },
  
  xiyanite_crystall: {
    atk: 0.1,
    skill: 0.07,
    onHit(player, target) {
      new Entity(target).status().addStatus("xiyanit_silence", 2, { type: "silence", decay: "time", lvl: 1, stack: false });
      new Entity(player).heal(1);
    }
  }
}