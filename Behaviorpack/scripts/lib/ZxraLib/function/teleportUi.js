import { ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { world } from "@minecraft/server";
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
    .submitButton({ translate: "system.teleport.btn" })
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

export const teleportToPlayer = (player, item) => {
  let dimension = [
    // Minecraft Dimension
    "minecraft:overworld",
    "minecraft:nether",
    "minecraft:the_end"
  ], py = world.getPlayers(),
  plyr = py.map(e => {
    return { name: e.name, location: e.location, dimension: e.dimension, id: e.id }
  }).filter(e => e.id !== player.id);
  
  if(plyr.length < 1) return player.sendMessage({ translate: "system.alone" })

  //console.warn(JSON.stringify(plyr))
  let ui = new ModalFormData()
    .title({ translate: "system.confirm.tp" })
    .dropdown({ translate: "type.player" }, plyr.map(e => e.name))
    .submitButton({ translate: "system.teleport.btn" })
    
    .show(player)
    .then(e => {
      if(e.canceled) return;
      
      let [cek] = e.formValues;
      
      const targetUi = new MessageFormData()
        .title({ translate: "system.confirm.player" })
        .body({ translate: "system.confirm.player.body", with: [plyr[cek].name]})
        .button2({ translate: "system.yes" })
        .button1({ translate: "system.cancel" })
        .show(py[cek])
        .then(t => {
          if (t.canceled || t.selection === 0) {
            player.sendMessage({ translate: "system.teleport.cancel" });
            return;
          }

          teleportConfirm(
            player,
            {
              ...plyr[cek].location,
              dimension: { id: plyr[cek].dimension.id }
            },
            {
              rawtext: [
                { translate: "system.confirm.teleportLoc1" },
                { text: ` ${plyr[cek].name} ` },
                { translate: "system.confirm.teleportLoc2" }
              ]
            },
            item
          );
        })
    })
};