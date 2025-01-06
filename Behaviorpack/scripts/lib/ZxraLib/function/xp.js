import { world } from "@minecraft/server";

const summonXpAtPlayer = (amount = 0, player) => {
  if(!player) return;
  for(let i = 0; i < amount; i++) {
    player.dimension.spawnEntity("minecraft:xp_orb", player.location);
  }
}

export { summonXpAtPlayer };