import {
  Player,
  world,
  system,
  EntityTypes,
  EffectTypes,
  GameMode,
} from "@minecraft/server";
import {
  BlockUi,
} from "./system.js";
import {
  Command,
  Terra,
  Quest,
  SpecialItem,
  Weapon,
  Entity,
  Items,
  summonXpAtPlayer,
  Specialist,
} from "./lib/ZxraLib/module.js";
import * as stats from "./lib/stats.js";
import * as jsonData from "./lib/data.js";

// Import Utils Module
import "./pasif.js";
import "./commands.js";
import "./lib/items.js";
import "./lib/scriptsEvents.js";
import "./lib/blocks.js";
import "./lib/blockRegister.js";
import "./lib/itemRegistry.js";

// Import Weapon Skill
import "./lib/weapons/unique.js";
import "./lib/weapons/epic.js";
import "./lib/weapons/legend.js";
import "./lib/weapons/rare.js";

let wounded = {},
  silentState = [],
  endless = {},
  options = {};
const inGame = {
  soul: {},
  skyler: {},
  catlye: {},
  lectaze: {},
  berserk: {},
  musha: {},
};
const dimension = [
  // Minecraft Dimension
  "minecraft:overworld",
  "minecraft:nether",
  "minecraft:the_end",
];

// Function to update options
function setOptions(opt) {
  options = opt;
}
export { setOptions };

// Main Event
system.beforeEvents.watchdogTerminate.subscribe((e) => {
  e.cancel = true;
  world.sendMessage("[§l§2CZ§r] Zxra RPG " + e.terminateReason);
});

system.runInterval(async () => {
  try {
    if (Object.keys(options).length < 1)
      options = Terra.game.getSetting();

    for (let plyr of Terra.getPlayer()) {
      const sp = new Specialist(plyr);

      sp.controllerActionBar({
        endless,
        ...inGame,
      });
      sp.controllerCooldown();
      sp.controllerStamina({
        options,
      });
      sp.controllerThirst({
        options,
      });
      sp.controllerUi({
        options,
      });
    }
    Terra.getActiveDimension().forEach((e) => {
      world
        .getDimension(e)
        .getEntities({
          excludeTypes: [
            "cz:block_data","minecraft:item","minecraft:sheep","minecraft:cow","minecraft:pig","minecraft:bee","minecraft:sniffer","minecraft:allay","minecraft:chicken"
          ]
         })
        .forEach((r) => {
          new Entity(r).controllerStatus();
        });
    });
  } catch (err) {
    if (options.debug) console.warn("[Error] ticking error: "+err);
  }
}, 5);

// Chat Event
world.beforeEvents.chatSend.subscribe(async (e) => {
  try {
    const msg = e.message.split(" "),
      cmd = msg[0];
    const sp = new Specialist(e.sender),
      data = sp.getData();

    function sendMsgEvent(sender, message, dt) {
      const guild = Terra
        .guild
        .gd()
        .find((s) => s.member.some((r) => r.id === sender.id));
      world.sendMessage({
        text: options.customChatPrefix
          .replace(/%name/gi, sender.name)
          .replace(/%msg/gi, message.join(" "))
          .replace(/%lvl/gi, sender.level)
          .replace(/%splvl/gi, dt.specialist.lvl)
          .replace(/%rep/gi, dt.reputation)
          .replace(/%guild/gi, guild?.name ? "[" + guild.name + "§r] " : "")
          /*
           *. %name   = Player Name
           *. %msg    = Message from player
           *. %lvl    = Player Level
           *. %splvl  = Specialist Level
           *. %rep    = Player Reputation
           *. %guild  = Player Guild - Visible when player has/join guild
           */
          // fix issue % is missing
          .replace(/%/gi, "%%"),
      });
      Terra.leaderboard.addLb(e.sender, { amount: 1, type: "chatting" });
    }

    let find;
    cmd.startsWith("+")
      ? (find = Command.getCmd().find((s) => s.cmd == cmd.slice(1)))
      : (find = Command.getN().find((s) => s.cmd == cmd));
    if (!find) {
      if (options.customChat !== true) return;
      e.cancel = true;
      sendMsgEvent(e.sender, msg, data);
    } else {
      e.cancel = true;
      if (
        (find.admin === true && !e.sender.hasTag("Admin")) ||
        find.err === true
      )
        return sendMsgEvent(e.sender, msg, data);
      find.callback(e.sender, {
        msg,
        sp,
        rawMsg: e.message,
        options,
        functions: { sendMsgEvent },
      });
    }
  } catch (err) {
    if (options.debug) console.warn(err);
  }
});

// Initialing Addon
world.afterEvents.worldLoad.subscribe((e) => {
  Terra.setPlayers(world.getPlayers());

  options = Terra.game.getSetting();
  if (options.debug) console.warn(JSON.stringify(options));
  if (options.useBzbRules) Terra.game.setWorldSetting(options.rules);
});

// Refresh Player
world.beforeEvents.playerLeave.subscribe(({ player }) => {
  Terra.setPlayers(world.getPlayers());
});
world.afterEvents.playerJoin.subscribe((e) => {
  Terra.setPlayers(world.getPlayers());

  const player = Terra.game.getPlayerName(e.playerName);
  if (!player) return;
  new Specialist(player).refreshPlayer();
});
world.afterEvents.playerSpawn.subscribe((e) => {
  Terra.setPlayers(world.getPlayers());

  const player = e.player,
    isFirst = e.initialSpawn;
  new Specialist(player).refreshPlayer();

  if ((!isFirst && !options.starterItem) || player.hasTag("hasJoin")) return;
  options.starterItems
    .split(/,/g)
    .forEach((e) =>
      player.runCommand(
        `give @s ${e.split("*")[0].trim()} ${e.split("*")[1].trim()}`
      )
    );
  player.addTag("hasJoin");
  player.sendMessage({
    translate: options.starterItemMessage || "system.welcome.item",
  });
});

// Entities Change Health Event
world.afterEvents.entityHealthChanged.subscribe(
  ({ entity, newValue, oldValue }) => {
    try {
      if (oldValue - newValue < -1) {
        const indicator = world
          .getDimension(entity.dimension.id)
          .spawnEntity("cz:indicator", {
            x: entity.location.x,
            y: entity.location.y + 1.9,
            z: entity.location.z,
          });
        indicator.nameTag = `§2${(Math.abs(oldValue - newValue)).toFixed(0)}`;
        new Entity(indicator).knockback(indicator.getVelocity(), 0, 5)
      }
    } catch (err) {
      if (options.debug) console.warn(err);
    }
  },
  { entityTypes: ["minecraft:player"] }
);

// Entities Die Event
world.afterEvents.entityDie.subscribe(async (e) => {
  const murder = e.damageSource.damagingEntity,
    corp = e.deadEntity;
  if (corp instanceof Player) {
    const cp = new Specialist(corp);
    if (options.deathLocation)
      corp.sendMessage({
        rawtext: [
          { translate: "system.youDie" },
          {
            text: `§2[${corp.location.x.toFixed(2)} ${corp.location.y.toFixed(
              2
            )} ${corp.location.z.toFixed(2)}]§r`,
          },
        ],
      });
    cp.minRep(Math.floor(cp.getRep() / 5));
    cp.setValueDefaultStamina();
    cp.setValueDefaultThirst();
    Terra.leaderboard.addLb(corp, { amount: 1, type: "deaths" });

    const guild = Terra
      .guild
      .gd()
      .find((s) => s.member.some((d) => d.id === corp.id));
    if (guild?.id) Terra.guild.setXp(guild.id, 0);
  }

  // Initializing Kill Pasif
  if (murder instanceof Player) {
    let murderData = new Specialist(murder),
      tarHp = corp.getComponent("health"),
      rn = murderData.rune().getAllUsedRuneStat();
    murderData.addSpecialist(
      "xp",
      Math.floor(
        tarHp.defaultValue / 22 + (Math.random() * tarHp.defaultValue) / 6
      ) * options.xpMultiplier
    );
    new Quest(murder).controller({ act: "kill", target: corp });
    Terra.leaderboard.addLb(murder, { amount: 1, type: "kills" });

    runActionRune(murder, corp, "onKill");

    if(rn.moneyDrop > 0) murderData.addMoney(rn.moneyDrop);

    const item = murder
      .getComponent("inventory")
      .container.getItem(murder.selectedSlotIndex);
    let itemPasif = Weapon.Pasif.kill.find((x) =>
      item.getTags().includes(x.type)
    );
    if (!itemPasif) return;
    itemPasif.callback(murder, corp, {
      sp: murderData,
      item,
      ...inGame,
      rune: rn,
      notSelf: "!" + murder.name,
      multiplier: murderData.status().decimalCalcStatus({ type: "damage" }, 1, 0.01),
    });
  }
});

// Break Block Event
world.afterEvents.playerBreakBlock.subscribe(
  ({ brokenBlockPermutation, player }) => {
    new Quest(player).controller({
      act: "destroy",
      target: brokenBlockPermutation,
    }); // Quest Controller - Destroy
    
    //console.warn(JSON.stringify(brokenBlockPermutation.dimension), JSON.stringify(brokenBlockPermutation.getAllStates()), JSON.stringify(brokenBlockPermutation.getTags()))
    if(player.getGameMode() === GameMode.creative) return;
    if(!brokenBlockPermutation.hasTag("minecraft:crop") || brokenBlockPermutation.getState("growth") < 7) return;
    summonXpAtPlayer(3, player);
    new Specialist(player).addSpecialist("xp", 1);
  }
);

world.afterEvents.playerPlaceBlock.subscribe((e) => {
  /*const player = e.player*/
});

// Place Item Event
world.afterEvents.itemStartUseOn.subscribe(({ block, itemStack, source }) => {
  if (!block || !itemStack) return;
  let find = SpecialItem.con.find(
    (e) => e.item === itemStack.typeId.split(":")[1]
  );

  if (!find) return;
  find.callback(source, itemStack, block);
});

// Use Item On
world.afterEvents.itemStartUseOn.subscribe((e) => {
  let block = e.block,
    player = e.source,
    item = e.itemStack;
  if (!item || item == undefined || !item.typeId || item.typeId == undefined)
    return;
  let special = BlockUi.blocks.find(
    (x) =>
      x.block == block.type.id.split(":")[1] &&
      x.item.includes(item.typeId.split(":")[1])
  );

  if (!special) return;
  special.callback(block, player, item);
});

// Use Item Event
world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
  // Initializing Special Item Callback
  let special = SpecialItem.item.find(
    (x) => x.item === itemStack.typeId.split(":")[1]
  );
  if (!special) return;

  special.callback(source, itemStack, { options });
});
world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source }) => {
  // Initializing Special Use Item Callback
  let special = SpecialItem.use.find(
    (x) => x.item === itemStack.typeId.split(":")[1]
  );
  if (!special) return;

  special.callback(source, itemStack);
});

// Hitting Entity Event
world.afterEvents.entityHitEntity.subscribe(
  async (e) => {
    let item = e.damagingEntity
        .getComponent("inventory")
        .container?.getItem(e.damagingEntity.selectedSlotIndex) || undefined,
      entity = e.damagingEntity,
      sp = new Specialist(entity);
    sp.cooldown().addCd("stamina_regen", options.staminaExhaust || 3);
    if (!item || e.hitEntity == undefined || !e.hitEntity) return;
    let itm = new Items(item);

    sp.minStamina("value", options.staminaAction || 4);
    let itemPasif = Weapon.Pasif.hit.find((x) =>
      item.getTags().includes(x.type)
    );

    runActionRune(entity, e.hitEntity, "onHit");

    if (!itemPasif) return;
    return itemPasif.callback(entity, e.hitEntity, {
      silentState,
      sp,
      ent: new Entity(e.hitEntity),
      item,
      itm,
      rune: sp.rune().getAllUsedRuneStat(),
      team: Terra.guild.getTeammate(entity.id) || [entity.name],
      notSelf: "!" + entity.name,
      tier: itm.getTier(),
      ...inGame,
      options,
      multiplier: sp.status().decimalCalcStatus({ type: "damage" }, 1, 0.01),
    });
  },
  { entityTypes: ["minecraft:player"] }
);

// Player Hited Event
world.afterEvents.entityHurt.subscribe(
  (e) => {
    let item = e.hurtEntity
        .getComponent("inventory")
        .container.getItem(e.hurtEntity.selectedSlotIndex),
      sp = new Specialist(e.hurtEntity);
    sp.cooldown().addCd("stamina_regen", options.staminaExhaust || 3);
    
    runActionRune(e.hurtEntity, e.damageSource.damagingEntity, "onHited");

    e.hurtEntity.runCommand(`camerashake add @s 1.4 0.26`);
    if (
      !item ||
      item == undefined ||
      !e.damageSource.damagingEntity ||
      e.damageSource.damagingEntity == undefined
    )
      return;

    let itemPasif = Weapon.Pasif.hited.find((x) =>
        item.getTags().includes(x.type)
      );
    if (!itemPasif) return;
    itemPasif.callback(e.hurtEntity, e.damageSource.damagingEntity, {
      damage: e.damage,
      sp,
      ent: new Entity(e.damageSource.damagingEntity),
      item,
      rune: sp.rune().getAllUsedRuneStat(),
      notSelf: "!" + e.hurtEntity.name,
      multiplier: sp.status().decimalCalcStatus({ type: "damage" }, 1, 0.01),
      ...inGame,
    });
  },
  { entityTypes: ["minecraft:player"] }
);

world.afterEvents.entityHurt.subscribe(
  ({
    hurtEntity,
    damage,
    damageSource: { cause, damagingEntity, damagingProjectile },
  }) => {
    if (!options.damageIndicator) return;
    try {
      const indicator = hurtEntity.dimension
        .spawnEntity("cz:indicator", {
          x: hurtEntity.location.x + Math.random(-0.5, 0.5),
          y: hurtEntity.location.y + 0.4 + Math.random(-0.8, 1.4),
          z: hurtEntity.location.z + Math.random(-0.5, 0.5),
        });
      indicator.nameTag = `${
        Object.keys(jsonData.damageColor).includes(cause)
          ? jsonData.damageColor[cause]
          : ""
      }${damage.toFixed(0)}`;
    } catch(err) {
      if(options.debug) console.warn(err)
    }
  }
);

// Skill Event
world.afterEvents.itemReleaseUse.subscribe(async (e) => {
  let item = e.itemStack,
    entity = e.source,
    sp = new Specialist(entity);
  sp.cooldown().addCd("stamina_regen", options.staminaExhaust || 3);

  let vel = entity.getVelocity(),
    rot = entity.getRotation();
  rot.y = ((rot.y + 45) * Math.PI) / 180;
  let velocity = {
    x: (Math.cos(rot.y) - Math.sin(rot.y)) * 1,
    y: 0,
    z: (Math.sin(rot.y) + Math.cos(rot.y)) * 1,
  };

  try {
    entity
      .getComponent("inventory")
      .container.getSlot(entity.selectedSlotIndex)
      .setLore(stats[item.typeId.split(":")[1]]);

    let skills = Weapon.Skill.find(
      (x) => x.weaponName == item.typeId.split(":")[1]
    );
    if (!skills) return;

    skills.callback(
      entity,
      {
        wounded,
        vel,
        velocity,
        team: Terra.guild.getTeammate(entity.id) || [entity.name],
        notSelf: "!" + entity.name,
        silentState,
        sp,
        rune: sp.rune().getAllUsedRuneStat(),
        endless,
        multiplier: sp.status().decimalCalcStatus({ type: "skill" }, sp.status().decimalCalcStatus({ type: "damage" }, 1, 0.01), 0.01),
        ...inGame,
        options,
      },
      e
    );
  } catch (e) {
    if (options.debug) console.warn(e);
  }
});

// Weather Event
world.afterEvents.weatherChange.subscribe(({ raining, lightning }) => {
  if (raining && !lightning)
    world.sendMessage({ translate: "settings.text.weatherRain" });
  if (lightning == true)
    world.sendMessage({ translate: "settings.text.weatherThunder" });
});


function runActionRune(player, target, act) {
  try {
    const action = new Specialist(player).rune().getAction(act);

    if(action.length < 1) return;
    action.forEach(e => {
      e?.(player, target)
    })
  } catch(e) {
    if (options.debug) console.warn(e);
  }
}
// CrzxaExe3--
