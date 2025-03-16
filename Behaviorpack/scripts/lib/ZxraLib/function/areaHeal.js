import { Specialist, Entity } from "../module.js";
import { world } from "@minecraft/server";

const areaHeal = (player, { heal = 0, range = 3, minRange = 0, location }) => {
  const sp = new Specialist(player);
  
  player.dimension.getEntities({ maxDistance: 3, location: location || player.location, minDistance: minRange, excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(r => {
    new Entity(r).heal(heal)
  })
}

export { areaHeal };