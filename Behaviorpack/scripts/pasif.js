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

  if (damage > 230) damage = 230;
  ent.addDamage(
    damage * multiplier,
    { cause: "void", damagingEntity: user },
    { vel: velocity, hor: percenDamage * 2, ver: 0 }
  );
});
pasif.addHitedPasif("slayer", (user, target, { multiplier, ent, item }) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return; // Pasif Thornification
  if (item.typeId.split(":")[1] !== "kyles") return;

  const counterDamage = 4 + user.getComponent("health").currentValue;
  ent.addDamage(counterDamage * multiplier, {
    cause: "thorns",
    damagingEntity: user,
  });
});
pasif.addKillPasif("slayer", (user, target, { item, sp }) => {
  if (!user) return; // Pasif Blooding
  if (!item || item.typeId !== "cz:kyles") return;

  sp.addEffect([
    { name: "resistance", duration: 40, lvl: 1 },
    { name: "speed", duration: 40, lvl: 0 },
  ]);
  sp.heal(Math.floor(user.getComponent("health").defaultValue / 4));
});

// Pasif Reaper
pasif.addHitPasif("reaper", (user, target, { item, itm, multiplier, sp, soul, notSelf, tier }) => {
  if (!user || !target) return;
  let userHealth = user.getComponent("health"),
    heal = 2;

  user.runCommand(
    `execute positioned ^^^2 run damage @e[r=2.5,name=${notSelf},type=!item] ${Math.floor(
      (12 - Number(tier)) * multiplier
    )} entity_attack entity @s`
  );
  world
    .getDimension(user.dimension.id)
    .spawnEntity("cz:particles<cz:liberator_swing_particle>", target.location);

  switch (item.typeId.split(":")[1]) {
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
pasif.addKillPasif("reaper", (user, target, lib) => {
  if (!user) return;
  switch (lib.item.typeId.split(":")[1]) {
    case "liberator": // Pasif Soul Of Death
      let now = Number(lib.soul[user.id]) || 0;
      now + 1 > 3 ? (now = 3) : (now += 1);
      lib.soul[user.id] = now;
      break;
    case "bringer": // Pasif Slay Benefit
      lib.sp.heal(user.getComponent("health").defaultValue / 5);
      break;
  }
});

// Pasif ArtSword
pasif.addHitPasif("artsword", (user, target, lib) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;

  switch (lib.item.typeId.split(":")[1]) {
    case "skyler": // Pasif Fireing
      let skly = lib.skyler[user.id] || 0;
      target.setOnFire(5);
      ent.selfParticle("cz:fireing_hit");

      if (skly !== undefined && skly > 0) {
        lib.ent.addEffect([
          { name: "slowness", duration: 40, lvl: 2 },
          { name: "weakness", duration: 40, lvl: 0 },
        ]);
        lib.ent.addDamage(18 * lib.multiplier, {
          cause: "fire",
          damagingEntity: user,
        });
        lib.sp.addEffect([
          { name: "fire_resistance", duration: 80, lvl: 0 },
        ]);
        lib.sp.knockback(user.getVelocity(), 3.2, 0);
        skly - 1 >= 0
          ? (lib.skyler[user.id] -= 1)
          : (lib.skyler[user.id] = undefined);
      }
      break;
    case "destreza": // Art Destreza
      lib.ent.addEffect([
        { name: "poison", duration: 60, lvl: 3 },
        { name: "weakness", duration: 60, lvl: 0 },
      ]);
      break;
    case "boltizer": // Pasif Electricity
      if (target.hasTag("boltizer_skill")) {
        target.removeTag("boltizer_skill");
        lib.sp.addEffect([{ name: "resistance", duration: 5, lvl: 255 }]);
        world
          .getDimension(target.dimension.id)
          .spawnEntity("minecraft:lightning_bolt", target.location);
      } else target.addTag("boltizer_atk");

      target.runCommand(
        `damage @e[r=6,c=1,name=${
          lib.notSelf
        },tag=!boltizer_atk,type=!item] ${
          3 * lib.multiplier
        } lightning entity ${user.name}`
      ); // Pasif ArChain
      break;
  }
});
pasif.addKillPasif("artsword", (user, target, { item, notSelf }) => {
  if (!user) return;

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
      target.runCommand(`effect @e[r=4,name=${notSelf}] poison 3 1`);
      break;
  }
});
pasif.addHitedPasif("artsword", (user, target, { item, notSelf, multiplier}) => {
  if (!user) return;

  switch (item.typeId.split(":")[1]) {
    case "destreza": // Pasif Thornifi
      if (!user.hasTag("skill")) return;
      user.runCommand(
        `damage @e[r=3,name=${notSelf},type=!item] ${
          9 * multiplier
        } poison entity @s`
      );
      break;
  }
});

// Pasif Century
pasif.addHitPasif("century", (user, target, { item, itm, sp, nultiplier }) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  let tier = itm.getTier(),
    dmg = 14 - Number(tier),
    range = 1.5;

  switch (item.typeId.split(":")[1]) {
    case "quezn": // Quezn Skill 1
      dmg = 28;
      range = 3;
      sp.status().removeStatus("quezn_charge");
      target.removeEffect("speed");
      sp.knockback(user.getVelocity(), 0.5, 0);
      break;
  }
  world.getDimension(target.dimension.id).getEntities({ maxDistance: range, location: target.location, minDistance: 0, excludeNames: [`${user.name}`], excludeTypes: ["minecraft:item","cz:indicator"] }).forEach(e => {
    switch (item.typeId.split(":")[1]) {
      case "cervant":// Pasif Sharp Slice
        (sp.status().getStatus("sharper")?.lvl || 0) + 1 <= 6 ? sp.status().addStatus("sharper", 5, { type: "skill", stack: true, lvl: 1 }) : 0;
        break;
    }
    
    new Entity(e).addDamage(dmg * multiplier, { cause: "entityAttack", damagingEntity: user })
  })
});
pasif.addHitedPasif("century", (user, target, { item, sp }) => {
  if (!user || !target) return;

  switch (item.typeId.split(":")[1]) {
    case "quezn": // Pasif Gaslt
      sp.addEffect([{ name: "resistance", duration: 60, lvl: 0 }]);
      break;
  }
});

// Pasif Katana
pasif.addHitPasif("katana", (user, target, lib) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  let dmg = 11 - lib.itm.getTier(), cause = "entityAttack";

  switch (
    lib.item.typeId.split(":")[1]
  ) {
    case "silent": // Pasif In Leaf
      if (lib.silentState.includes(user.id)) {
        target.addEffect(EffectTypes.get("slowness"), 20, { amplifier: 0 });
        user.runCommand(`scoreboard players add @s silent 2`);
        target.addTag("silent_target");
      }

      let ran = Math.floor(Math.random() * 5) + 1; //Pasif
      if (ran < 5) break;
      lib.ent.knockback(user.getVelocity(), 0, 0.8);
      lib.ent.addEffect([{ name: "slow_falling", duration: 16, lvl: 1 }]);
      break;
    case "musha": // Pasif Decisive
      let stk = lib.musha[user.id] || { atk: 0, stack: 0 };
      lib.musha[user.id] = stk;

      dmg += stk.stack;

      if (stk.stack >= 5) break;
      if (stk.atk + 1 >= 4) {
        lib.musha[user.id].stack = stk.stack + 1;
        lib.musha[user.id].atk = 0;
      } else lib.musha[user.id].atk = stk.atk + 1;
      break;
    case "sui": // Pasif Attack State
      if(user.getEffect("slowness")) {
        cause = "magic"
        dmg *= 1.2
      }
      break;
  }

  if (target.isOnGround == false || lib.ent.hasDebuffEffect())
    dmg += Math.floor(8 - Number(lib.itm.getTier()));

  lib.ent.addDamage(dmg * lib.multiplier, {
    cause,
    damagingEntity: user,
  });
});

// Pasif Hammer
pasif.addHitPasif("hammer", (user, target, { itm, item, multiplier, sp, ent }) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  target.addEffect(EffectTypes.get("slowness"), 60, { amplifier: 0 });

  let targetHealth = target.getComponent("health"),
    damage = Math.floor(8 + targetHealth.defaultValue / 5);
  if (damage > 50 * (1 - 0.2 * Number(itm.getTier()))) damage = 50 * (1 - 0.2 * Number(itm.getTier()));
  ent.addDamage(damage * multiplier, {
    cause: "entityAttack",
    damagingEntity: user,
  });

  switch (item.typeId.split(":")[1]) {
    case "crusher": // Pasif Stone Hit
      sp.addEffect([{ name: "resistance", duration: 60, lvl: 0 }]);
      break;
  }
});

// Pasif Spear
pasif.addHitPasif("spear", (user, target, lib) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;

  let distance = Math.sqrt(
      (user.location.x - target.location.x) ** 2 +
        (user.location.z - target.location.z) ** 2
    ),
    damage = Math.floor(11 + 1.1 * distance - Number(lib.itm.getTier())),
    cause = "entityAttack";

  switch (lib.item.typeId.split(":")[1]) {
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
      let lectaze = Number(lib.lectaze[user.id]) || 0;
      if (lectaze + 1 <= 5) lib.ent.bind(1.5); // Pasif Clip

      if (lectaze + 1 < 5 || lectaze == undefined)
        lib.lectaze[user.id] = lectaze + 1;
      damage += Number(lib.lectaze[user.id]); // Pasif Creations
      break;
    case "hyrant": // Pasif Water Bind
      if(target.getEffect("slowness")) {
        lib.ent.bind(3)
      } else lib.ent.addEffect([{ name: "slowness", duration: 60, lvl: 1 }]);
      break;
    case "harmony": // Pasif Melody
      cause = "magic";
      break;
  }
  lib.ent.addDamage(damage * lib.multiplier, {
    cause,
    damagingEntity: user,
  });
});
pasif.addKillPasif("spear", (user, target) => {
  if (!user || !target) return;
});

//Pasif Staff
pasif.addHitPasif("staff", (user, target, { itm, item, ent }) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  // let tier = itm.getTier(),

  switch (item.typeId.split(":")[1]) {
    case "catlye": // pasif Medicine
      lib.ent.healable(4);
      break;
  }
});

// Pasif Greatsword
pasif.addHitPasif("greatsword", (user, target, { item, sp, ent, multiplier }) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  let cd = sp.cooldown().cd("greatsword_crit", 5),
    damage = Math.floor(10 - lib.itm.getTier());

  !cd.skill
    ? sp.cooldown().addCd("greatsword_crit", 5)
    : (damage *= 2);

  ent.addDamage(damage * multiplier, {
    cause: "entityAttack",
    damagingEntity: user,
  });
});
pasif.addHitedPasif("greatsword", (user, target, lib) => {
  if (!user) return;

  switch (lib.item.typeId.split(":")[1]) {
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
pasif.addHitPasif("briefcase", (user, target, { item, itm, ent, multiplier }) => {
  if (!user || !target || target.typeId.split(":")[1] === "item") return;
  let status = ent.status(),
    damage = 0;

  switch (item.typeId.split(":")[1]) {
    case "pandora": // Pasif Out Of Box
      let stack = status.getStatus("outBox").lvl || 0;
      if (stack > 0)
        ent.addEffect([
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
  ent.addDamage(damage * multiplier, {
    cause: "entityAttack",
    damagingEntity: user,
  });
});

// Custom Sword Modifier
pasif.addHitPasif("minecraft:is_sword", (user, target, { item }) => {
  if (!user || !target) return;
  let mods = item.getLore().map((e) => {
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
pasif.addKillPasif("minecraft:is_sword", (user, target, { item }) => {
  if (!user || !target) return;
  let mods = item.getLore().map((e) => {
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
