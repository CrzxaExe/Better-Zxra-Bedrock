import { Entity, Game, gachaData, gachaFeatured, userPity, runeData } from "../module.js";

class Gacha {
  static getData() {
    return gachaData;
  }

  static getFeatured() {
    return new Game().getData("gacha", gachaFeatured);
  }

  static getUserPity(player) {
    if(!player) return userPity;
    return new Entity(player).getDataEnt("pity", userPity);
  }
  
  static setUserPity(player, obj) {
    if(!player || !obj) throw new Error("No Player or Object");

    new Entity(player).setDataEnt(obj, "pity");
  }
  
  static addUserPity(player, key, amount) {
    if(!player || !key) return;
    if(!["normal","featured"].includes(key)) return;

    const data = this.getUserPity(player);
    data.pityWeapon[key] += amount;
    this.setUserPity(player, data);
  }
  
  static resetUserPity(player, key) {
    if(!player || !key) return;
    if(!["normal","featured"].includes(key)) return;

    const data = this.getUserPity(player);
    data.pityWeapon[key] = 0;
    this.setUserPity(player, data);
  }

  static randomWeapon(player) {
    if(!player) return;

    const pity = this.getUserPity(player),
      data = this.getData().weapon,
      featured = this.getFeatured();

    const chance = Math.floor(Math.random() * 101) + pity.pityWeapon.normal;

    const rarity = chance > 92 ?
      "unique" : chance > 75 ?
        "epic" : chance > 35 ?
          "legend" : "rare";

    chance > 92 ? this.resetUserPity(player, "normal") : this.addUserPity(player, "normal", 1);

    const subChance = Math.floor(Math.random() * 98) + pity.pityWeapon.featured;

    const wpn = subChance > 95 ? featured[rarity][Math.floor(Math.random() * featured[rarity].length)] : data[rarity][Math.floor(Math.random() * data[rarity].length)];
    subChance > 95 && featured.unique.includes(wpn) ? this.resetUserPity(player, "featured") : this.addUserPity(player, "featured", 1);
    
    return { rarity, weapon: wpn };
  }

  static randomRune(player) {
    if(!player) return;

    const data = Object.keys(runeData);

    return data[Math.floor(Math.random() * data.length)];
  }
}

export { Gacha }