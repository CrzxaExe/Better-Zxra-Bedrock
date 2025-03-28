import { world, system } from "@minecraft/server";
import { durabilityControl } from "./ZxraLib/module.js";

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  /*
   *. Item Function
   */

  itemComponentRegistry.registerCustomComponent("cz:durability", {
    onMineBlock({ source }) {
      console.warn("test")
      durabilityControl(source, 1);
    },
    onHitEntity({ attackingEntity }) {
      durabilityControl(attackingEntity, 2);
    },
  });
});
