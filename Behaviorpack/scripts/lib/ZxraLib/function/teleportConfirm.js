import { world, system } from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui";
import { Specialist } from "../../../system.js";

export const teleportConfirm = (player, loc, text, item) => {
  if (!item) return;
  let gui = new MessageFormData()
    .title({ translate: "system.confirm.teleport" })
    .body(text)
    .button2({ translate: "system.yes" })
    .button1({ translate: "system.cancel" })
    .show(player)
    .then(e => {
      if (e.canceled || !e.selection || e.selection === 0)
        return player.sendMessage({ translate: "system.teleport.cancel" });

      let sp = new Specialist(player),
        hp = player.getComponent("health");
      //console.warn(JSON.stringify(loc), JSON.stringify(hp), JSON.stringify(item.typeId))

      player.sendMessage({ translate: "system.teleport" });
      sp.bind(6);
      if(item) sp.runCommand([`clear @s ${item.typeId} 0 1`]);

      world
        .getDimension(loc.dimension.id)
        .runCommand(`particle cz:impact_p ${loc.x} ${loc.y} ${loc.z}`);
      world
        .getDimension(player.dimension.id)
        .runCommand(
          `particle cz:impact_p ${player.location.x} ${player.location.y} ${player.location.z} `
        );

      system.runTimeout(() => {
        sp.runCommand([
          `execute in ${loc.dimension.id.split(":")[1]} run tp @s ${loc.x} ${
            loc.y
          } ${loc.z}`
        ]);
        sp.addEffect([{ name: "blindness", duration: 60, lvl: 1 }]);
        hp.setCurrentValue(Math.floor(hp.currentValue * 0.7));
      }, 80);
    });
};
