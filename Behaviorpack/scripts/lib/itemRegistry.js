import { world } from "@minecraft/server";
import { durabilityControl } from "./ZxraLib/module.js";

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
  /*
   *. Item Function
   */

  itemComponentRegistry.registerCustomComponent("cz:durability", {
    onMineBlock({ source }) {
      durabilityControl(source);
    },
    onHitEntity({ attackingEntity }) {
      durabilityControl(attackingEntity, 2);
    },
  });
});
