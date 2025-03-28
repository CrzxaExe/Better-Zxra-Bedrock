import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { Gacha, Specialist, formatName, gachaData } from "../module.js";

const WEAPON_GACHA_PRICE = 100,
  RUNE_GACHA_PRICE = 60;

const rarity = {
  unique: "§2",
  epic: "§5§l",
  legend: "§e",
  rare: "§d"
}

const gachaPanel = (player) => {
  const ui = new ActionFormData()
    .title({ translate: "cz.gacha" })
    .body({ translate: "cz.gacha.body" })
    .button({ translate: "gacha.weapon" })
    .button({ translate: "gacha.rune" })
    .button({ translate: "gacha.exchange" })

    .show(player)
    .then(e => {
      if(e.canceled) return;

      [
        weaponGacha,
        runeGacha,
        gachaExchange
      ][e.selection]?.(player);
    })
}

const weaponGacha = (player) => {
  const gacha = Gacha.getFeatured();

  const ui = new ActionFormData()
    .title("gacha.weapon")
    .body({
      rawtext: [
        { translate: "gacha.featured" },
        { text: `

§l${gacha.name}§r§f

[§2` },
        { translate: "rarity.unique" },
        { text: `§r§f]  ${formatName(gacha.unique)}
[§5§l` },
        { translate: "rarity.epic" },
        { text: `§r§f]    ${formatName(gacha.epic)}
[§e` },
        { translate: "rarity.legend" },
        { text: `§r§f] ${formatName(gacha.legend)}
[§d` },
        { translate: "rarity.rare" },
        { text: `§r§f]    ${formatName(gacha.rare)}` },
      ]
    })
    .button({ translate: "system.pull.1", with: [String(WEAPON_GACHA_PRICE*1)] })
    .button({ translate: "system.pull.3", with: [String(WEAPON_GACHA_PRICE*3)] })
    .button({ translate: "system.pull.5", with: [String(WEAPON_GACHA_PRICE*5)] })
    .show(player)
    .then(e => {
      if(e.canceled) return;
      
      const sp = new Specialist(player),
        total = [1,3,5][e.selection];

      if(player.getComponent("inventory").container.emptySlotsCount < total) {
        player.sendMessage({ translate: "system.fullInventory" })
        return;
      }
      
      if(sp.getVoxn() < WEAPON_GACHA_PRICE*total) {
        player.sendMessage({ translate: "system.buy.outVoxn" })
        return;
      }
      sp.minVoxn(WEAPON_GACHA_PRICE*total);

      for(let i = 1; i<=total; i++) {
        const mul = Gacha.randomWeapon(player)
        sp.giveItem({ id: "cz:"+mul.weapon, amount: 1 })
        player.sendMessage({ translate: "system.gacha.result.weapon", with: [`${rarity[mul.rarity]}${formatName(mul.weapon)}§r§f`] })
      }
    })
}

const runeGacha = (player) => {
  const ui = new ActionFormData()
    .title("gacha.rune")
    .body({ translate: "gacha.rune.body" })
    .button({ translate: "system.pull.1", with: [String(RUNE_GACHA_PRICE*1)] })
    .button({ translate: "system.pull.3", with: [String(RUNE_GACHA_PRICE*3)] })
    .show(player)
    .then(e => {
      if(e.canceled) return;
      
      const sp = new Specialist(player),
        runes = sp.rune().getRune().runes;
        
      const total = [1,3][e.selection];

      if(sp.getVoxn() < RUNE_GACHA_PRICE*total) {
        player.sendMessage({ translate: "system.buy.outVoxn" })
        return;
      }
      sp.minVoxn(RUNE_GACHA_PRICE*total)

      for(let i = 1; i<=total; i++) {
        const mul = Gacha.randomRune(player)

        runes.includes(mul) ? sp.giveItem({ id: "cz:diamond_ascend" }) : sp.rune().addRune({ runes: mul });

        player.sendMessage({ translate: "system.gacha.result.rune", with: [formatName(mul)] })
      }
    })
}

const gachaExchange = (player) => {
  const ui = new ActionFormData()
    .title({ translate: "gacha.exchange" })
    .body({ translate: "gacha.exchange.body" })
    .button({ translate: "rarity.unique" })
    .button({ translate: "rarity.epic" })
    .button({ translate: "rarity.legend" })
    .button({ translate: "rarity.rare" })
    .show(player)
    .then(e => {
      if(e.canceled) return;

      const ascend = {
        unique_ascend: 0,
        epic_ascend: 0,
        legend_ascend: 0,
        rare_ascend: 0
      };

      new Specialist(player).getItems().forEach(r => {
        if(!(Object.keys(ascend).includes(r.name.replace("cz:","")))) return;
        ascend[r.name.replace("cz:","")] += r.amount;
      })

      subGachaExchange(player, ["unique","epic","legend","rare"][e.selection], ascend)
    })
}

const subGachaExchange = (player, rarity, ascend) => {
  const ui = new ActionFormData()
    .title({ translate: "rarity."+rarity })
    .body({
      rawtext: [
        { translate: "rarity.unique" }, { text: " "+ascend["unique_ascend"]+"\n" },
        { translate: "rarity.epic" }, { text: " "+ascend["epic_ascend"]+"\n" },
        { translate: "rarity.legend" }, { text: " "+ascend["legend_ascend"]+"\n" },
        { translate: "rarity.rare"}, { text: " "+ascend["rare_ascend"] }
      ]
    })

  gachaData.weapon[rarity].forEach(e => ui.button(formatName(e)))

  ui.button({ translate: "system.cancel" })
    .show(player)
    .then(e => {
      if(e.canceled || e.selection === gachaData.weapon[rarity].length) return;

      const subUi = new MessageFormData()
        .title({ translate: "gacha.exchange.confirm" })
        .body({ translate: "gacha.exchange.to", with: [formatName(gachaData.weapon[rarity][e.selection])] })
        .button2({ translate: "system.yes" })
        .button1({ translate: "system.cancel" })

        .show(player)
        .then(r => {
          if(r.canceled || !r.selection || r.selection === 0) return;

          if(player.getComponent("inventory").container.emptySlotsCount < 1) {
            player.sendMessage({ translate: "system.fullInventory" })
            return;
          }
          
          if(ascend[rarity+"_ascend"] < 10) {
            player.sendMessage({ translate: "gacha.exchange.notEnough", with: [formatName(rarity+"_ascend")] })
            return;
          }
          
          new Specialist(player).giveItem({ id: "cz:"+gachaData.weapon[rarity][e.selection], amount: 1 })
          player.runCommand(`clear @s cz:${rarity}_ascend 0 10`)
        })
    })
}


export { gachaPanel };