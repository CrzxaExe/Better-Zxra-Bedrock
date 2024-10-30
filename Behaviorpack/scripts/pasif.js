import { EffectTypes, world, system } from "@minecraft/server";
import { pasif, Entity, spawnParticles } from "./system.js";
import { Modifier } from "./lib/ZxraLib/module.js";

// Pasif Slayer
pasif.addHitPasif("slayer", (user, target, { multiplier, ent, velocity }) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  ent.addEffect([{ name: "wither", duration: 60, lvl: 5 }]);
  let userHealth = user.getComponent("health"),
    percenDamage =
      Math.round(userHealth.currentValue) / userHealth.defaultValue,
    damage = Math.floor(
      Math.round(10 * percenDamage) +
        target.getComponent("health").defaultValue / 4
    );

  if (damage > 250) damage = 250;
  ent.addDamage(
    damage * multiplier,
    { cause: "entityAttack", damagingEntity: user },
    { vel: velocity, hor: percenDamage * 2, ver: 0 }
  );
});
pasif.addHitedPasif("slayer", (user, target, lib) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return; // Pasif Thornification
  let item = user
    .getComponent("inventory")
    .container.getItem(user.selectedSlotIndex);
  if (item.typeId.split(":")[1] !== "kyles") return;

  let userHp = user.getComponent("health"),
    counterDamage = 4 + userHp.currentValue;
  lib.ent.addDamage(counterDamage * lib.multiplier, {
    cause: "thorns",
    damagingEntity: user,
  });
});
pasif.addKillPasif("slayer", (user, target, lib) => {
  if (!user) return; // Pasif Blooding
  let item = user
    .getComponent("inventory")
    .container.getItem(user.selectedSlotIndex);
  if (!item || item.typeId !== "cz:kyles") return;

  lib.sp.addEffect([
    { name: "resistance", duration: 40, lvl: 1 },
    { name: "speed", duration: 40, lvl: 0 },
  ]);
  lib.sp.heal(Math.floor(user.getComponent("health").defaultValue / 4));
});

// Pasif Reaper
pasif.addHitPasif("reaper", (user, target, { item, multiplier, sp, soul }) => {
  if (!user || !target) return;
  let itemStack = user
    .getComponent("inventory")
    .container.getSlot(user.selectedSlotIndex);
  let userHealth = user.getComponent("health"),
    notSelf = "!" + user.name,
    heal = 2,
    tier = item.getTier();

  user.runCommand(
    `execute positioned ^^^2 run damage @e[r=2.5,name=${notSelf},type=!item] ${Math.floor(
      (12 - Number(tier)) * multiplier
    )} entity_attack entity @s`
  );
  world
    .getDimension(user.dimension.id)
    .spawnEntity("cz:particles<cz:liberator_swing_particle>", target.location);

  switch (itemStack.typeId.split(":")[1]) {
    case "liberator": // Pasif Gets Death
      if (target.hasTag("liberator_target"))
        sp.runCommand([
          `event entity @e[r=10,type=cz:angel] cz:liberator_upgrade`,
          `execute as @e[r=10,type=cz:angel] at @s run particle cz:liberator_upgrade ~~~`,
        ]);

      heal += Number(soul[user.id]) || 0;
      if (target.typeId !== "cz:angel") target.addTag("liberator_target");
      break;
    case "cenryter": // Pasif Our Fire
      target.setOnFire(5);
      if (target.getComponent("onfire")) {
        heal += 2;
        sp.addEffect([{ name: "fire_resistance", duration: 100, lvl: 0 }]);
      }
      break;
  }

  if (userHealth.currentValue + heal > userHealth.defaultValue)
    return userHealth.setCurrentValue(userHealth.defaultValue);
  userHealth.setCurrentValue(userHealth.currentValue + heal);
});
pasif.addKillPasif("reaper", (user, target, { soul, sp }) => {
  if (!user) return;
  let item = user
    .getComponent("inventory")
    .container.getItem(user.selectedSlotIndex);
  switch (item.typeId.split(":")[1]) {
    case "liberator": // Pasif Soul Of Death
      let now = Number(soul[user.id]) || 0;
      now + 1 > 3 ? (now = 3) : (now += 1);
      soul[user.id] = now;
      break;
    case "bringer": // Pasif Slay Benefit
      sp.heal(user.getComponent("health").defaultValue / 5);
      break;
  }
});

// Pasif ArtSword
pasif.addHitPasif("artsword", (user, target, option) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  let item = user
    .getComponent("inventory")
    .container.getSlot(user.selectedSlotIndex);

  switch (item.typeId.split(":")[1]) {
    case "skyler": // Pasif Fireing
      let skly = option.skyler[user.id] || 0;
      target.setOnFire(5);
      option.ent.selfParticle("cz:fireing_hit");

      if (skly !== undefined && skly > 0) {
        option.ent.addEffect([
          { name: "slowness", duration: 40, lvl: 2 },
          { name: "weakness", duration: 40, lvl: 0 },
        ]);
        option.ent.addDamage(18 * option.multiplier, {
          cause: "fire",
          damagingEntity: user,
        });
        option.sp.addEffect([
          { name: "fire_resistance", duration: 80, lvl: 0 },
        ]);
        option.sp.knockback(user.getVelocity(), 3.2, 0);
        skly - 1 >= 0
          ? (option.skyler[user.id] -= 1)
          : (option.skyler[user.id] = undefined);
      }
      break;
    case "destreza": // Art Destreza
      option.ent.addEffect([
        { name: "poison", duration: 60, lvl: 3 },
        { name: "weakness", duration: 60, lvl: 0 },
      ]);
      break;
    case "boltizer": // Pasif Electricity
      if (target.hasTag("boltizer_skill")) {
        target.removeTag("boltizer_skill");
        option.sp.addEffect([{ name: "resistance", duration: 5, lvl: 255 }]);
        world
          .getDimension(target.dimension.id)
          .spawnEntity("minecraft:lightning_bolt", target.location);
      } else target.addTag("boltizer_atk");

      target.runCommand(
        `damage @e[r=6,c=1,name=${
          option.notSelf
        },tag=!boltizer_atk,type=!item] ${
          3 * option.multiplier
        } lightning entity ${user.name}`
      ); // Pasif ArChain
      break;
  }
});
pasif.addKillPasif("artsword", (user, target, lib) => {
  if (!user) return;
  let item = user
    .getComponent("inventory")
    .container.getItem(user.selectedSlotIndex);

  switch (item.typeId.split(":")[1]) {
    case "skyler": // Pasif Burns Out
      spawnParticles(
        "cz:fireing_explode",
        target.dimension.id,
        target.location
      );
      world
        .getDimension(target.dimension.id)
        .createExplosion(target.location, 3, {
          breaksBlocks: false,
          source: user,
        });
      break;
    case "destreza": // Pasif Juned
      target.runCommand(`effect @e[r=4,name=${lib.notSelf}] poison 3 1`);
      break;
  }
});
pasif.addHitedPasif("artsword", (user, target, lib) => {
  if (!user) return;
  let item = user
    .getComponent("inventory")
    .container.getItem(user.selectedSlotIndex);

  switch (item.typeId.split(":")[1]) {
    case "destreza": // Pasif Thornifi
      if (!user.hasTag("skill")) return;
      user.runCommand(
        `damage @e[r=3,name=${lib.notSelf},type=!item] ${
          9 * lib.multiplier
        } poison entity @s`
      );
      break;
  }
});

// Pasif Century
pasif.addHitPasif("century", (user, target, lib) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  let tier = lib.item.getTier(),
    item = user
      .getComponent("inventory")
      .container.getItem(user.selectedSlotIndex),
    dmg = 14 - Number(tier),
    range = 1.5;

  switch (item.typeId.split(":")[1]) {
    case "quezn":
      dmg = 28;
      range = 3;
      lib.sp.status().removeStatus("quezn_charge");
      target.removeEffect("speed");
      lib.sp.knockback(user.getVelocity(), 0.5, 0);
      break;
  }
  target.runCommand(
    `damage @e[r=${range},name=${lib.notSelf},type=!item] ${
      dmg * lib.multiplier
    } entity_attack entity @s`
  );
});
pasif.addHitedPasif("century", (user, target, { sp }) => {
  if (!user || !target) return;
  let item = user
    .getComponent("inventory")
    .container.getItem(user.selectedSlotIndex);

  switch (item.typeId.split(":")[1]) {
    case "quezn": // Pasif Gaslt
      sp.addEffect([{ name: "resistance", duration: 60, lvl: 0 }]);
      break;
  }
});

// Pasif Katana
pasif.addHitPasif("katana", (user, target, option) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  let dmg = 11 - option.item.getTier();

  switch (
    user
      .getComponent("inventory")
      .container.getSlot(user.selectedSlotIndex)
      .typeId.split(":")[1]
  ) {
    case "silent": // Pasif In Leaf
      if (option.silentState.includes(user.id)) {
        target.addEffect(EffectTypes.get("slowness"), 20, { amplifier: 0 });
        user.runCommand(`scoreboard players add @s silent 2`);
        target.addTag("silent_target");
      }

      let ran = Math.floor(Math.random() * 5) + 1; //Pasif
      if (ran < 5) break;
      option.ent.knockback(user.getVelocity(), 0, 0.8);
      option.ent.addEffect([{ name: "slow_falling", duration: 16, lvl: 1 }]);
      break;
    case "musha": // Pasif Decisive
      let stk = option.musha[user.id] || { atk: 0, stack: 0 };
      option.musha[user.id] = stk;

      dmg += stk.stack;

      if (stk.stack >= 5) break;
      if (stk.atk + 1 >= 4) {
        option.musha[user.id].stack = stk.stack + 1;
        option.musha[user.id].atk = 0;
      } else option.musha[user.id].atk = stk.atk + 1;
      break;
    default:
      break;
  }

  if (target.isOnGround == false || option.ent.hasDebuffEffect())
    dmg += Math.floor(9 - Number(option.item.getTier()));

  target.applyDamage(dmg * option.multiplier, {
    cause: "entityAttack",
    damagingEntity: user,
  });
});

// Pasif Hammer
pasif.addHitPasif("hammer", (user, target, option) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  let tier = Number(option.item.getTier());
  target.addEffect(EffectTypes.get("slowness"), 60, { amplifier: 0 });
  let item = user
    .getComponent("inventory")
    .container.getSlot(user.selectedSlotIndex);

  let targetHealth = target.getComponent("health"),
    damage = Math.floor(8 + targetHealth.defaultValue / 5);
  if (damage > 100 * (1 - 0.2 * tier)) damage = 50 * (1 - 0.2 * tier);
  target.applyDamage(damage * option.multiplier, {
    cause: "entityAttack",
    damagingEntity: user,
  });

  switch (item.typeId.split(":")[1]) {
    case "crusher": // Pasif Stone Hit
      option.sp.addEffect([{ name: "resistance", duration: 60, lvl: 0 }]);
      break;
  }
});

// Pasif Spear
pasif.addHitPasif("spear", (user, target, option) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  let item = user
      .getComponent("inventory")
      .container.getSlot(user.selectedSlotIndex),
    tier = Number(option.item.getTier());

  let distance = Math.sqrt(
      (user.location.x - target.location.x) ** 2 +
        (user.location.z - target.location.z) ** 2
    ),
    damage = Math.floor(11 + 1.1 * distance - tier);

  switch (item.typeId.split(":")[1]) {
    case "destiny": // Pasif Fears
      if (target.hasTag("silence")) {
        if (
          target.getComponent("health").defaultValue >
          user.getComponent("health").defaultValue
        ) {
          damage += 5 + target.getComponent("health").defaultValue / 4;
        } else damage += 5;
      }
      target.addTag("silence");
      break;
    case "lectaze":
      target.addTag("lectaze");
      let lectaze = Number(option.lectaze[user.id]) || 0;
      if (lectaze + 1 <= 5) option.ent.bind(1.5); // Pasif Clip

      if (lectaze + 1 < 5 || lectaze == undefined)
        option.lectaze[user.id] = lectaze + 1;
      damage += Number(option.lectaze[user.id]); // Pasif Creations
      break;
  }
  target.applyDamage(damage * option.multiplier, {
    cause: "entityAttack",
    damagingEntity: user,
  });
});
pasif.addKillPasif("spear", (user, target, lib) => {
  if (!user || !target) return;
});

//Pasif Staff
pasif.addHitPasif("staff", (user, target, lib) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  let tier = lib.item.getTier(),
    item = user
      .getComponent("inventory")
      .container.getSlot(user.selectedSlotIndex);

  switch (item.typeId.split(":")[1]) {
    case "catlye": // pasif Medicine
      lib.ent.healable(4);
      break;
  }
});

// Pasif Greatsword
pasif.addHitPasif("greatsword", (user, target, lib) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  let item = user
      .getComponent("inventory")
      .container.getSlot(user.selectedSlotIndex),
    cd = lib.sp.cooldown().cd("greatsword_crit", 5),
    damage = Math.floor(10 - lib.item.getTier());

  cd.skill !== true
    ? lib.sp.cooldown().addCd("greatsword_crit", 5)
    : (damage *= 2);

  lib.ent.addDamage(damage * lib.multiplier, {
    cause: "entityAttack",
    damagingEntity: user,
  });
});
pasif.addHitedPasif("greatsword", (user, target, lib) => {
  if (!user) return;
  let item = user
    .getComponent("inventory")
    .container.getSlot(user.selectedSlotIndex);

  switch (item.typeId.split(":")[1]) {
    case "berserk": // Pasif W-Harm
      let con = lib.berserk[user.id] || 0,
        plus = Number(lib.damage + 2);
      con + plus < 70
        ? (lib.berserk[user.id] = con + plus)
        : (lib.berserk[user.id] = 70);
      break;
  }
});

// Pasif Briefcase
pasif.addHitPasif("briefcase", (user, target, lib) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  let item = user
      .getComponent("inventory")
      .container.getSlot(user.selectedSlotIndex),
    tier = Number(lib.item.getTier()),
    status = lib.ent.status(),
    damage = 0;

  switch (item.typeId.split(":")[1]) {
    case "pandora": // Pasif Out Of Box
      let stack = status.getStatus("outBox").lvl || 0;
      if (stack > 0)
        lib.ent.addEffect([
          { name: "slowness", duration: 100, lvl: 1 },
          { name: "weakness", duration: 100, lvl: 1 },
        ]); // Pasif Hit-Target
      damage = Math.floor(8 + 1 * stack);
      stack + 1 >= 6
        ? status.addStatus("outBox", 5, {
            type: "pandora",
            lvl: stack,
            stack: false,
            decay: "time",
          })
        : status.addStatus("outBox", 5, {
            type: "pandora",
            lvl: stack + 1,
            stack: false,
            decay: "time",
          });
      break;
  }
  lib.ent.addDamage(damage * lib.multiplier, {
    cause: "entityAttack",
    damagingEntity: user,
  });
});

// Custom Sword Modifier
pasif.addHitPasif("minecraft:is_sword", (user, target, lib) => {
  if (!user || !target) return;
  let item = user
      .getComponent("inventory")
      .container.getSlot(user.selectedSlotIndex),
    mods = item.getLore().map((e) => {
      return {
        mod: e.split(" ")[0].replace(/§r/g, "").toLowerCase(),
        lvl: e.split(" ")[1] || 1,
      };
    });
  //console.warn(JSON.stringify(mods))

  mods.forEach((e) => {
    let find = Modifier.getModByTypeAndTag("hit", "minecraft:is_sword").find(
      (s) => s.mod === e.mod
    );
    if (!find) return;
    find.callback(user, target, { item, mod: e });
  });
});
pasif.addKillPasif("minecraft:is_sword", (user, target, lib) => {
  if (!user || !target) return;
  let item = user
      .getComponent("inventory")
      .container.getSlot(user.selectedSlotIndex),
    mods = item.getLore().map((e) => {
      return {
        mod: e.split(" ")[0].replace(/§r/g, "").toLowerCase(),
        lvl: e.split(" ")[1] || 1,
      };
    });
  //console.warn(JSON.stringify(mods))

  mods.forEach((e) => {
    let find = Modifier.getModByTypeAndTag("kill", "minecraft:is_sword").find(
      (s) => s.mod === e.mod
    );
    if (!find) return;
    find.callback(user, target, { item, mod: e });
  });
});
// CrzxaExe3--
