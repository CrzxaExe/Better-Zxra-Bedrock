import {
  Player,
  world,
  system,
  EntityTypes,
  EffectTypes
} from "@minecraft/server";
import {
  pasif,
  weapon,
  specialItem,
  Specialist,
  Entity,
  Items,
  BlockUi,
} from "./system.js";
import { Command, Game, Quest } from "./lib/ZxraLib/module.js";
import * as stats from "./lib/stats.js";
import * as jsonData from "./lib/data.js";

// Import Utils Module
import "./pasif.js";
import "./commands.js";
import "./lib/items.js";
import "./lib/scriptsEvents.js";
import "./lib/blocks.js";

// Import Weapon Skill
import "./lib/weapons/unique.js";
import "./lib/weapons/epic.js";
import "./lib/weapons/rare.js";

let wounded = {},
  silentState = [],
  endless = {},
  options = {};
let inGame = {
  soul: {},
  skyler: {},
  catlye: {},
  lectaze: {},
  berserk: {}
};
let dimension = [
  // Minecraft Dimension
  "minecraft:overworld",
  "minecraft:nether",
  "minecraft:the_end"
];

// Function to update options
function setOptions(opt) {
  options = opt
}
export { setOptions };

system.beforeEvents.watchdogTerminate.subscribe(e => {
  e.cancel = true;
  world.sendMessage("[§l§2CZ§r] Zxra RPG " + e.terminateReason);
});

system.runInterval(async () => {
  try {
    if (Object.keys(options).length < 1) options = new Game(world).getSetting();
    for (let plyr of world.getPlayers()) {
      let sp = new Specialist(plyr);

      sp.controllerActionBar({
        endless,
        ...inGame
      });
      sp.controllerCooldown();
      sp.controllerStamina({
        options
      });
      sp.controllerThirst();
      sp.controllerUi({
        options
      });
    }
    dimension.forEach(e => {
      world
        .getDimension(e)
        .getEntities({ excludeTypes: ["cz:block_data"] })
        .forEach(r => {
          let ent = new Entity(r);
          ent.controllerStatus();
        });
    });
  } catch (err) {
    if (options.debug) console.warn(err);
  }
}, 5);

// Chat Event
world.beforeEvents.chatSend.subscribe(async e => {
  try {
    let msg = e.message.split(" "),
      cmd = msg[0];
    const sp = new Specialist(e.sender),
      data = sp.getData();

    function sendMsgEvent() {
      const guild = new Game().guild().gd().find(s => s.member.some(r => r.id === e.sender.id));
      world.sendMessage(
        options.customChatPrefix
          .replace(/%name/gi, e.sender.name)
          .replace(/%msg/gi, msg.join(" "))
          .replace(/%lvl/gi, e.sender.level)
          .replace(/%splvl/gi, data.specialist.lvl)
          .replace(/%rep/gi, data.reputation)
          .replace(/%guild/gi, guild?.name ? "["+guild.name+"§r] " : "")
          /*
          *. %name   = Player Name
          *. %msg    = Message from player
          *. %lvl    = Player Level
          *. %splvl  = Specialist Level
          *. %rep    = Player Reputation
          *. %guild  = Player Guild - Visible when player has/join guild
          */
      );
      new Game().leaderboard().addLb(e.sender, { amount: 1, type: "chatting" })
    }

    let find;
    cmd.startsWith("+")
      ? (find = Command.getCmd().find(s => s.cmd == cmd.slice(1)))
      : (find = Command.getN().find(s => s.cmd == cmd));
    if (!find) {
      if (options.customChat !== true) return;
      e.cancel = true;
      sendMsgEvent();
    } else {
      e.cancel = true;
      if (
        (find.admin === true && !e.sender.hasTag("Admin")) ||
        find.err === true
      )
        return sendMsgEvent();
      find.callback(e.sender, { msg, sp, rawMsg: e.message });
    }
  } catch (err) {
    if (options.debug) console.warn(err);
  }
});

// Initialing Addon
world.afterEvents.worldInitialize.subscribe(e => {
  let wld = new Game(world);
  options = wld.getSetting();
  if (options.debug) console.warn(JSON.stringify(options));
  if (options.useBzbRules) wld.setWorldSetting(options.rules);
});

// Refresh Player
world.beforeEvents.playerLeave.subscribe(({ player }) => {
  let sp = new Specialist(player);
  //sp.refreshPlayer();
});
world.afterEvents.playerJoin.subscribe(e => {
  let wld = new Game(world),
    player = wld.getPlayerName(e.playerName);
  if (!player) return;
  new Specialist(player).refreshPlayer();
});
world.afterEvents.playerSpawn.subscribe(e => {
  let player = e.player,
    isFirst = e.initialSpawn;
  new Specialist(player).refreshPlayer();
  
  if((!isFirst && !options.starterItem) || player.hasTag("hasJoin")) return;
  options.starterItems.split(/,/g).forEach(e => player.runCommand(`give @s ${e.split("*")[0].trim()} ${e.split("*")[1].trim()}`))
  player.addTag("hasJoin")
  player.sendMessage({ translate: "system.welcome,item" })
});

// Entities Change Health Event
world.afterEvents.entityHealthChanged.subscribe(
  ({ entity, newValue, oldValue }) => {
    try {
      let ent = new Entity(entity);
      //console.warn(newValue, oldValue)

      if (newValue - oldValue - 1 > 0) {
        ent.selfParticle("cz:heal_particle");
      }
    } catch (err) {
      if (options.debug) console.warn(err);
    }
  }
);

// Entities Die Event
world.afterEvents.entityDie.subscribe(async e => {
  const murder = e.damageSource.damagingEntity,
    corp = e.deadEntity;
  if (corp instanceof Player) {
    let cp = new Specialist(corp);
    if(options.deathLocation) corp.sendMessage({
      rawtext: [
        { translate: "system.youDie" },
        {
          text: `§2[${corp.location.x.toFixed(2)} ${corp.location.y.toFixed(
            2
          )} ${corp.location.z.toFixed(2)}]§r`
        }
      ]
    });
    cp.minRep(Math.floor(cp.getRep() / 5));
    cp.setValueDefaultStamina();
    cp.setValueDefaultThirst();
    new Game().leaderboard().addLb(corp, { amount: 1, type: "deaths" })
  }

  // Initializing Kill Pasif
  if (murder instanceof Player) {
    let murderData = new Specialist(murder),
      tarHp = corp.getComponent("health");
    murderData.addSpecialist(
      "xp",
      Math.floor(
        tarHp.defaultValue / 22 + (Math.random() * tarHp.defaultValue) / 6
      ) * options.xpMultiplier
    );
    new Quest(murder).controller({ act: "kill", target: corp });
    new Game().leaderboard().addLb(murder, { amount: 1, type: "kills" })

    const item = murder
      .getComponent("inventory")
      .container.getItem(murder.selectedSlotIndex);
    let itemPasif = pasif.Pasif.kill.find(x => item.getTags().includes(x.type));
    if (!itemPasif) return;
    itemPasif.callback(murder, corp, {
      sp: murderData,
      ...inGame,
      multiplier: murderData.status().dmgStat()
    });
  }
});

// Break Block Event
world.afterEvents.playerBreakBlock.subscribe(
  ({ brokenBlockPermutation, player }) => {
    new Quest(player).controller({ act: "destroy", target: brokenBlockPermutation }); // Quest Controller - Destroy
  }
);

world.afterEvents.playerPlaceBlock.subscribe(e => {
  let player = e.player,
    block =
      /*player.getComponent("inventory").container.getSlot(player.selectedSlotIndex) ||*/ player.getBlockFromViewDirection()
        .block;
});

// Place Item Event
world.afterEvents.itemStartUseOn.subscribe(({ block, itemStack, source }) => {
  if (!block || !itemStack) return;
  let find = specialItem.con.find(
    e => e.item === itemStack.typeId.split(":")[1]
  );

  if (!find) return;
  find.callback(source, itemStack, block);
});

// Use Item On
world.afterEvents.itemUseOn.subscribe(e => {
  let block = e.block,
    player = e.source,
    item = e.itemStack;
  if (!item || item == undefined || !item.typeId || item.typeId == undefined)
    return;
  let special = BlockUi.blocks.find(
    x =>
      x.block == block.type.id.split(":")[1] &&
      x.item.includes(item.typeId.split(":")[1])
  );

  if (!special) return;
  special.callback(block, player, item);
});

// Use Item Event
world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
  // Initializing Special Item Callback
  let special = specialItem.item.find(
    x => x.item === itemStack.typeId.split(":")[1]
  );
  if (!special) return;

  special.callback(source, itemStack, { options });
});
world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source }) => {
  // Initializing Special Use Item Callback
  let special = specialItem.use.find(
    x => x.item === itemStack.typeId.split(":")[1]
  );
  if (!special) return;

  special.callback(source, itemStack);
});

// Hitting Entity Event
world.afterEvents.entityHitEntity.subscribe(
  async e => {
    let item = e.damagingEntity
        .getComponent("inventory")
        .container.getItem(e.damagingEntity.selectedSlotIndex),
      entity = e.damagingEntity,
      data = new Specialist(entity);
    data.cooldown().setCd("stamina_regen", 3);
    if (!item || e.hitEntity == undefined || !e.hitEntity) return;

    data.minStamina("value", 4);
    let itemPasif = pasif.Pasif.hit.find(x => item.getTags().includes(x.type));
    if (!itemPasif) return;
    return itemPasif.callback(entity, e.hitEntity, {
      silentState,
      sp: data,
      ent: new Entity(e.hitEntity),
      itm: item,
      item: new Items(item),
      notSelf: "!" + entity.name,
      ...inGame,
      multiplier: data.status().dmgStat()
    });
  },
  { entityTypes: ["minecraft:player"] }
);

// Player Hited Event
world.afterEvents.entityHurt.subscribe(
  e => {
    let item = e.hurtEntity
        .getComponent("inventory")
        .container.getItem(e.hurtEntity.selectedSlotIndex),
      sp = new Specialist(e.hurtEntity);
    sp.cooldown().setCd("stamina_regen", 3);

    e.hurtEntity.runCommand(`camerashake add @s 1.4 0.26`);
    if (
      !item ||
      item == undefined ||
      !e.damageSource.damagingEntity ||
      e.damageSource.damagingEntity == undefined
    )
      return;

    let itemPasif = pasif.Pasif.hited.find(x =>
        item.getTags().includes(x.type)
      ),
      ent = new Entity(e.damageSource.damagingEntity);
    if (!itemPasif) return;
    itemPasif.callback(e.hurtEntity, e.damageSource.damagingEntity, {
      damage: e.damage,
      sp,
      ent,
      notSelf: "!" + e.hurtEntity.name,
      multiplier: sp.status().dmgStat(),
      ...inGame
    });
  },
  { entityTypes: ["minecraft:player"] }
);

world.afterEvents.entityHurt.subscribe(({ hurtEntity, damage, damageSource: { cause, damagingEntity, damagingProjectile } }) => {
  if(!options.damageIndicator) return;
  let indicator = world.getDimension(hurtEntity.dimension.id).spawnEntity("cz:indicator", { x: hurtEntity.location.x + Math.random(-0.5, 0.5), y: hurtEntity.location.y + Math.random(-0.8, 1), z: hurtEntity.location.z + Math.random(-0.5, 0.5) } );
  indicator.nameTag = `${Object.keys(jsonData.damageColor).includes(cause) ? jsonData.damageColor[cause] : ""}${damage.toFixed(1)}`;
  new Entity(indicator).knockback(indicator.getVelocity(), 0, 0.34)
  
  //console.warn(JSON.stringify(indicator.nameTag))
});

// Skill Event
world.afterEvents.itemReleaseUse.subscribe(async e => {
  let item = e.itemStack,
    entity = e.source,
    data = new Specialist(entity);
  data.cooldown().setCd("stamina_regen", 3);

  let vel = entity.getVelocity(),
    rot = entity.getRotation();
  rot.y = ((rot.y + 45) * Math.PI) / 180;
  let velocity = {
    x: (Math.cos(rot.y) - Math.sin(rot.y)) * 1,
    y: 0,
    z: (Math.sin(rot.y) + Math.cos(rot.y)) * 1
  };

  try {
    entity
      .getComponent("inventory")
      .container.getSlot(entity.selectedSlotIndex)
      .setLore(stats[item.typeId.split(":")[1]]);

    let skills = weapon.weapons.find(
      x => x.weaponName == item.typeId.split(":")[1]
    );
    if (!skills) return;

    skills.callback(
      entity,
      {
        wounded,
        vel,
        velocity,
        notSelf: "!" + entity.name,
        silentState,
        sp: data,
        endless,
        multiplier: data.status().skillStat(),
        ...inGame
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
// CrzxaExe3--
