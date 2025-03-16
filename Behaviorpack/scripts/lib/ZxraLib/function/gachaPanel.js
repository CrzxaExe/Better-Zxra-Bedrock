import { ActionFormData } from "@minecraft/server-ui";
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

    .show(player)
    .then(e => {
      if(e.canceled) return;

      [
        weaponGacha,
        runeGacha
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


export { gachaPanel };