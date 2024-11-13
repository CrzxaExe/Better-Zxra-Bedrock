import { system, world, ItemStack } from "@minecraft/server";
import { Items, Specialist } from "./system.js";
import { Command, Ench, Game, runDialog } from "./lib/ZxraLib/module.js";

Command.add("kyle", async (player, lib) => {
  if (player.name !== "CrzxaExe3") return;

  switch (lib.msg[1]) {
    case "drop":
      system.run(() => {
        player.runCommand("clear @s cz:kyles 0 1");
        player.triggerEvent("cz:summon_kyles");
      });
      break;
    default: {
      system.run(() =>
        world
          .getDimension(player.dimension.id)
          .spawnEntity("cz:kyle_sword<cz:has_sensor>", {
            x: player.location.x,
            y: player.location.y + 25,
            z: player.location.z,
          })
      );
    }
  }
});
Command.add("_loc", (player) => {
  let loc = player.location;
  world.sendMessage(
    `${player.name} => §l§2[${loc.x.toFixed(2)} ${loc.y.toFixed(
      2
    )} ${loc.z.toFixed(2)}]§r`
  );
});
Command.add(".item", (player) => {
  try {
    let item = player
        .getComponent("inventory")
        .container.getItem(player.selectedSlotIndex),
      itm = new Items(item);
    if (!item) return;
    let tag = itm.getTag(),
      durability = item.getComponent("durability");
    world.sendMessage({
      rawtext: [
        { text: `§b§l[${player.name}]§r =>\n ` },
        {
          text: `${item.typeId
            .split(":")[1]
            .split("_")
            .map((r) => {
              return r.charAt(0).toUpperCase() + r.slice(1);
            })
            .join(" ")}`,
        },
        {
          text: `${item.nameTag ? " §b[" + item.nameTag + "]§r" : ""} X ${
            item.amount
          }${
            tag.length > 0
              ? "\n Tag: " +
                itm
                  .getTag()
                  .join(", ")
                  .replace(/minecraft:/g, "mc:")
              : ""
          }\n `,
        },
        { translate: "system.keepOnDeath" },
        { text: `: ${item.keepOnDeath}\n ` },
        { translate: "system.durability" },
        {
          text: `: ${
            durability
              ? Math.floor(durability.maxDurability - durability.damage) +
                "/" +
                durability.maxDurability
              : "false"
          }`,
        },
      ],
    });
  } catch (err) {}
});

// Command Function

// Gamemode c
Command.addCmd(
  "gmc",
  (player) => {
    if (!player) return;
    system.run(() => player.runCommand("gamemode c"));
  },
  { des: "cmd.gmc", admin: true }
);
// Gamemode s
Command.addCmd(
  "gms",
  (player) => {
    if (!player) return;
    system.run(() => player.runCommand("gamemode s"));
  },
  { des: "cmd.gms", admin: true }
);
// Gamemode a
Command.addCmd(
  "gma",
  (player) => {
    if (!player) return;
    system.run(() => player.runCommand("gamemode a"));
  },
  { des: "cmd.gma", admin: true }
);
// Gamemode sp
Command.addCmd(
  "gmsp",
  (player) => {
    if (!player) return;
    system.run(() => player.runCommand("gamemode spectator"));
  },
  { des: "cmd.gmsp", admin: true }
);

// List cmd
Command.addCmd(
  "list",
  (player) => {
    if (!player) return;
    let hd = [],
      cmds = Command.getCmd()
        .sort((a, b) => a.cmd.localeCompare(b.cmd))
        .forEach((cur) => {
          if ((!player.hasTag("Admin") && cur.admin) || cur.err) return;
          let des = cur.description,
            admin = cur.admin || false;
          hd.push({ text: `\n+${cur.cmd}` });
          if (des !== "") hd.push({ text: " | " }, { translate: des });
          if (admin !== false) hd.push({ text: " - Admin" });
        });
    player.sendMessage({
      rawtext: [
        { translate: "system.listCmd" },
        { text: "\n======================" },
        ...hd,
        { text: "\n======================\n@Zxra " },
        { translate: "cz.version" },
      ],
    });
  },
  { des: "cmd.list" }
);

// World spawn point
Command.addCmd(
  "wsp",
  (player) => {
    if (!player) return;
    let pos = world.getDefaultSpawnLocation();
    player.sendMessage({
      rawtext: [
        { translate: "system.worldspawn" },
        {
          text: ` §2[${pos.x.toFixed(2)} ${pos.y.toFixed(2)} ${pos.z.toFixed(
            2
          )}]§f`,
        },
      ],
    });
  },
  { des: "cmd.wsp" }
);

// Player spawn point
Command.addCmd(
  "psp",
  (player) => {
    if (!player) return;
    let pos = player.getSpawnPoint();
    pos !== undefined
      ? player.sendMessage({
          rawtext: [
            { translate: "system.playersp" },
            {
              text: ` §2[${pos.x.toFixed(2)} ${pos.y.toFixed(
                2
              )} ${pos.z.toFixed(2)}]§f`,
            },
          ],
        })
      : player.sendMessage({ translate: "system.playersp.no" });
  },
  { des: "cmd.psp" }
);

// Sit Command
Command.addCmd(
  "sit",
  (player) => {
    if (!player) return;
    system.run(() => {
      player.runCommand("summon cz:seat ~~~");
      player.runCommand(`ride @s start_riding @e[r=1,type=cz:seat,c=1]`);
    });
  },
  { des: "cmd.sit" }
);

// Time cmd
Command.addCmd(
  "time",
  (player, { msg, rawMsg }) => {
    if (!player) return;
    let gm = new Game(world),
      time = msg[1] || 0;
    try {
      system.run(() => {
        let day = ["day", "night", "midnight", "noon", "sunset", "sunrise"];
        if (!day.includes(time.toLowerCase())) {
          if (time.toLowerCase().startsWith("d")) {
            let slm = Number(time.slice(1)) * 24000;
            world
              .getDimension(player.dimension.id)
              .runCommand(`time add ${slm}`);
            player.sendMessage({
              rawtext: [
                { translate: "system.addDay" },
                { text: ` ${time.slice(1)}` },
              ],
            });
          } else {
            world
              .getDimension(player.dimension.id)
              .runCommand(`time add ${Number(time)}`);
            player.sendMessage({
              rawtext: [
                { translate: "system.addTime" },
                { text: ` ${Number(time)}` },
              ],
            });
          }
        } else {
          world
            .getDimension(player.dimension.id)
            .runCommand(`time set ${time}`);
          player.sendMessage({
            rawtext: [
              { translate: "system.setTime" },
              { text: " " },
              { translate: `hostOption.time.${time}` },
            ],
          });
        }
      });
    } catch (err) {
      console.warn(err);
    }
  },
  { des: "cmd.time", admin: true }
);

// Give multiple
Command.addCmd(
  "give",
  (player, { msg, rawMsg }) => {
    if (!player) return;
    let gm = new Game(),
      target = msg[1] || player.name,
      items = rawMsg
        .split(" ")
        .slice(2)
        .map((r) => {
          return { item: r.split("*")[0], amount: r.split("*")[1] };
        }),
      allPlayers = world.getAllPlayers();
    system.run(() => {
      try {
        switch (msg[1]) {
          case "@s":
          case "@p":
            items.forEach((s) =>
              player.runCommand(`give @s ${s.item} ${s.amount ? s.amount : 1}`)
            );
            break;
          case "@r":
            let randomPlayer =
              allPlayers[Math.floor(Math.random() * allPlayers.length)];
            items.forEach((s) =>
              randomPlayer.runCommand(
                `give ${randomPlayer.name} ${s.item} ${s.amount ? s.amount : 1}`
              )
            );
            break;
          case "@a":
            allPlayers.forEach((r) =>
              items.forEach((s) =>
                r.runCommand(
                  `give ${r.name} ${s.item} ${s.amount ? s.amount : 1}`
                )
              )
            );
            break;
          default: {
            let trn = gm.getPlayerName(target) || player;
            items.forEach((s) =>
              trn.runCommand(
                `give ${trn.name} ${s.item} ${s.amount ? s.amount : 1}`
              )
            );
          }
        }
      } catch (err) {}
    });
  },
  { des: "cmd.give", admin: true }
);

// Item Modifier
Command.addCmd(
  "mod",
  (player) => {
    if (!player) return;
    let item = player
      .getComponent("inventory")
      .container.getSlot(player.selectedSlotIndex);
    system.run(() => {
      item.setLore(["§rExplosive 2", "§rVampiric"]);
    });
  },
  { des: "cmd.mod", admin: true, err: true }
);

// Teleport To Spawn Point
Command.addCmd(
  "tsp",
  (player) => {
    if (!player) return;
    let loc = player.getSpawnPoint();

    if (!loc)
      return player.sendMessage({ translate: "system.cannot.teleport" });
    system.run(() =>
      player.runCommand(
        `execute in ${loc.dimension.id.split(":")[1]} run tp @s ${loc.x} ${
          loc.y
        } ${loc.z}`
      )
    );
  },
  { des: "cmd.tsp", admin: true }
);

// Fake Chat
Command.addCmd(
  "fchat",
  (player, { msg, functions }) => {
    let target = new Game().getPlayerName(msg[1]);

    if (!target)
      return player.sendMessage({ translate: "system.invalidPlayer" });

    system.run(() => {
      functions.sendMsgEvent(
        target,
        msg.slice(2),
        new Specialist(target).getData()
      );
    });
  },
  { des: "cmd.fchat", admin: true }
);

// Announcement Chat
Command.addCmd(
  "announce",
  (player, { msg }) => {
    system.run(() => {
      world.sendMessage({
        rawtext: [
          { translate: "system.announcement.pronounce" },
          { text: `\n${msg.slice(1).join(" ")}` },
          { text: `\n- ${player.name}` },
        ],
      });
    });
  },
  { des: "cmd.announce", admin: true }
);

Command.addCmd(
  "pp",
  (player, { msg }) => {
    let target = new Game().getPlayerName(msg[1]);

    if (!target)
      return player.sendMessage({ translate: "system.invalidPlayer" });

    system.run(() => {
      player.sendMessage({
        rawtext: [
          { text: `${target.name} > ${target.location.x} ${target.location.y} ${target.location.z} > ${target.dimension.id}` }
        ]
      })
    });
  },
  { des: "cmd.pp", admin: true }
)

Command.addCmd(
  "gc",
  (player, { msg }) => {
    let guild = new Game().guild().gd().find(e => e.member.some(r => r.id == player.id));

    if(!guild) return;

    system.run(() => {
      for(let mem of guild.member) {
        let member = new Game().getPlayerById(mem.id);
        
        if(!member) continue;
        member.sendMessage({
          rawtext: [
            { text: `${guild?.name ? "[" + guild.name + "§r-" + player.name + "§r] " : ""} > ${msg.slice(1).join(" ")}` }
          ]
        })
      }
    });
  },
  { des: "cmd.gc" }
)

Command.addCmd(
  "test",
  (player, { msg }) => {
    runDialog(["Ahok", "Jokowi Kontol","Agus Lagi Ngocok"])
  },
  { des: "cmd.test" }
)