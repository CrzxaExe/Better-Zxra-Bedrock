import { ModalFormData } from "@minecraft/server-ui";
import { teleportConfirm } from "../module.js";

export const teleportUi = (player, item) => {
  let dimension = [
    // Minecraft Dimension
    "minecraft:overworld",
    "minecraft:nether",
    "minecraft:the_end"
  ];

  let gui = new ModalFormData()
    .title({ translate: "system.confirm.tp" })
    .dropdown({ translate: "system.dimension" }, dimension)
    .textField({ translate: "tp.x" }, { translate: "type.number" })
    .textField({ translate: "tp.y" }, { translate: "type.number" })
    .textField({ translate: "tp.z" }, { translate: "type.number" })
    .show(player)
    .then(r => {
      if (r.canceled) return;
      let form = r.formValues;

      let notValid = form.some(e => e === "");
      if (notValid)
        return player.sendMessage({ translate: "system.invalidForm" });
      const [dimId, x, y, z] = form;

      //console.warn(dimId, x, y, z);
      teleportConfirm(
        player,
        {
          x: Number(x),
          y: Number(y),
          z: Number(z),
          dimension: { id: dimension[dimId] }
        },
        {
          rawtext: [
            { translate: "system.confirm.teleportLoc1" },
            { text: ` ${Number(x)} ${Number(y)} ${Number(z)} ` },
            { translate: "system.confirm.teleportLoc2" }
          ]
        },
        item
      );
    });
};
