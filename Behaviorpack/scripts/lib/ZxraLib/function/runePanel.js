import { Specialist, runeData, formatName } from "../module.js";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { world } from "@minecraft/server";

const runePanel = (player) => {
  const rune = new Specialist(player).rune(),
    data = rune.getRune(),
    stat = rune.getAllUsedRuneStat();
    
  const {
    atk,
    atkFlat,
    critChance,
    critDamage,
    healingEffectifity,
    moneyDrop,
    skill,
    skillFlat,
    skillDamageRed,
    skillDamageRedFlat,
    skillDodge,
    staminaReduction,
    
    fragile,
    artFragile,
    fireFragile
  } = stat;

  const ui = new ActionFormData()
    .title("cz.rune")
    .body({
      rawtext: [
        { translate: "system.rune" },
        {
          text: `

Rune [${formatName(data.usedRune)}]

Atk +${(atk * 100).toFixed(1)}%% ${atkFlat > 0 ? "+ " + atkFlat : ""}
Crit Chance ${(critChance * 100).toFixed(1)}%%
Crit Damage ${(critDamage * 100).toFixed(1)}%%
Healing Effectifity +${(healingEffectifity * 100).toFixed(1)}%%
Money Drop +$${moneyDrop.toFixed(1)}/kill
Skill +${(skill * 100).toFixed(1)}%% ${skillFlat > 0 ? "+ "+skillFlat : ""}
Skill Damage Reduction ${(skillDamageRed * 100).toFixed(1)}%% ${skillDamageRedFlat > 0 ? "+ "+skillDamageRedFlat : ""}
Skill Dodge Chance ${(skillDodge * 100).toFixed(1)}%%
Stamina Reduction ${staminaReduction.toFixed(1)}/s

`
        },
        { translate: "system.fragility" },
        {
          text: `
Fragile ${(fragile * 100).toFixed(1)}%%
Art Fragile ${(artFragile * 100).toFixed(1)}%%
Fire Fragile ${(fireFragile * 100).toFixed(1)}%%

`
        }
      ]
     })
    .button({ translate: "system.rune.equipped" })
    .button({ translate: "system.rune.listing" })
    .show(player)
    .then(e => {
      if(e.canceled) return;

      [
        runeEquip,
        runeList
      ][e.selection]?.(player, { rune, data })
    })
}

const runeEquip = (player, { rune, data }) => {
  const ui = new ActionFormData()
    .title("cz.rune")
    .body({ translate: "system.rune.equip", with: [String(data.maxRune)] })

  data.usedRune.forEach(e => ui.button(formatName(e)))

  ui.button({ translate: "system.back" })
    .show(player)
    .then(e => {
      if(e.canceled || e.selection >= data.usedRune.length) return runePanel(player);

      runeStat(player, { rune, data, item: runeData[data.usedRune[e.selection]], name: data.usedRune[e.selection], backFunction: runeEquip });
    })
}

const runeList = (player, { rune, data }) => {
  const ui = new ActionFormData()
    .title("cz.rune")
    .body({ translate: "system.rune.list" })

  data.runes.forEach(e => ui.button(formatName(e)))

  ui.button({ translate: "system.back" })
    .show(player)
    .then(e => {
      if(e.canceled || e.selection >= data.runes.length) return runePanel(player);

      runeStat(player, { rune, data, item: runeData[data.usedRune[e.selection]], name: data.runes[e.selection], backFunction: runeList });
    })
}

const runeStat = (player, { rune, data, item, name, backFunction }) => {
  const ui = new ActionFormData()
    .title(formatName(name))
    .body({ translate: "system.rune.stat", with: [String(item)] })

  data.usedRune.includes(name) ? ui.button({ translate: "system.rune.unequip" }) : ui.button({ translate: "system.rune.equip" });

  ui.button({ translate: "system.back" })
    .show(player)
    .then(e => {
      if(e.canceled || e.selection >= 1) return backFunction?.(player, { rune, data });

      if(data.usedRune.includes(name)) {
        // Unequip
        data.usedRune.splice(data.usedRune.findIndex(r => r === name), 1);
        rune.setData(data)
        backFunction?.(player, { rune, data });
        return;
      }
      // Equip
      if(data.usedRune.length + 1 > data.maxRune) {
        runeStat(player, { rune, data, item, name, backFunction });
        return;
      }

      data.usedRune.push(name)
      rune.setData(data)
      backFunction?.(player, { rune, data })
    })
}

const runeAdmin = (player) => {
  const runes = Object.keys(runeData);
  
  const select = [
    { translate: "system.select.all" }
  ]
  
  const allPlayer = world.getPlayers()

  allPlayer.forEach(e => select.push(e.name))
  const ui = new ModalFormData()
    .title("cz.rune")
    .dropdown({ translate: "system.method.rune" }, select)
    .dropdown({ translate: "cz.rune" }, runes.map(e => formatName(e)))
    .show(player)
    .then(e => {
      if(e.canceled) return;
      
      const [id, index] = e.formValues;
      
      if(id < 1) {
        world.getPlayers().forEach(e => {
          new Specialist(e).rune().addRune({ runes: runes[index] });
        })
      } else {
        new Specialist(allPlayer[id-1]).rune().addRune({ runes: runes[index] });
      }
    })
}

export { runePanel, runeAdmin };