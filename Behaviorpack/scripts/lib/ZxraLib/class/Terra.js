import {
  Game,
  Guild,
  Leaderboard,
  setting
} from "../module.js";
import { world } from "@minecraft/server";

class Terra {
  static game = new Game(this);
  static guild = new Guild(this.game);
  static leaderboard = new Leaderboard(this.game);
  
  // Player Data
  //
  // Data for all player, this are cache
  static players = [];
  
  // Player Method
  static setPlayers(players) {
    if(!Array.isArray(players)) return;
    this.players.splice(0, this.players.length);
    this.players.push(...players)
  }
  
  static getPlayer(finder) {// ex finder = { name: "agus" }
    if(!finder) {
      return this.players;
    }

    const key = Object.keys(finder)[0];
    return this.players.find(e => e[key] === finder[key]);
  }

  static totalPlayers() {
    return this.players.length;
  }

  // World Data
  //
  // Temporary data(Cache) of world, before be saved to property
  static world = {};
  
  // World method
  static getActiveDimension() {
    return this.players.reduce((all, cur) => {
      if(all.includes(cur.dimension.id)) return all;
      all.push(cur.dimension.id)
      return all;
    }, [])
  }

  static getWorldProperty() {
    return JSON.parse(world.getDynamicProperty("world") ||  "{}");
  }
  
  static saveWorldProperty() {
    if(!this.world) throw new Error("Missing object on world data cache");
    if(typeof this.world === "object" && !Array.isArray(this.world))
      throw new Error("Data must be object");
    
    world.setDynamicProperty("world", JSON.stringify(this.world));
  }

  static getWorldData() {
    return this.world;
  }

  static setWorldData(data) {
    this.world = data;
  }
  
  // World(Setting) method
  static getSetting() {
    return this.world.setting || setting;
  }

  static setSetting(data) {
    if(!data) throw new Error("Missing object");
    if(typeof data === "object" && !Array.isArray(data))
      throw new Error("Data must be object");

    this.world.setting = data;
  }
  
  // World(Redeem) method
  static getRedeem() {
    return this.world.redeem || [];
  }

  static setRedeem(data) {
    if(!data) throw new Error("Missing array");
    if(!Array.isArray(data))
      throw new Error("Data must be array");

    this.world.redeem = data;
  }

  static addRedeem(data) {
    if(!data) throw new Error("Missing object");
    if(typeof data === "object" && !Array.isArray(data))
      throw new Error("Data must be object");

    const {
        key,
        id,
        rewards = []
      } = data;

    if(!key || !id) throw new Error("Invalid redeem data");

    this.world.redeem.push({
      key,
      id,
      rewards
    });
  }

  static updateRedeem(finder, data) {
  }

  static removeRedeem(id) {
    if(!id) throw new Error("Missing id");

    const index = this.world.redeem.findIndex(e => e.id === id);

    if(index === -1) throw new Error("Id not found");
    this.world.redeem.splice(index, 1);
  }

  static clearRedeem() {
  }

  // World(Gacha) method
  static getFeatured() {
  }

  static setFeatured(data) {
  }

  // Specialist Data
  //
  // Temporary data(Cache) of specialist, before be saved to property
  static specialist = [];

  static newSpecialist(player) {
  }
}

export { Terra };