import { world, system } from "@minecraft/server";
import { Leaderboard, Guild, ZxraLib } from "../module.js";
import * as json from "../../data.js";

const players = [];

class Game {
  constructor() {
   if(Game.#instance) 
      throw new Error("Game must be singleton");
      
    this.guild = null;
    this.leaderboard = null;
  }
  
  static #instance = null;
  
  static getInstance() {
    if(!Game.#instance) {
      Game.#instance = new Game();
    }
    return Game.#instance;
  }
  
  initialize() {
    this.leaderboard = new Leaderboard();
    this.guild = new Guild();
    
    this.guild.setup(this);
    this.leaderboard.setup(this);
  }

  // Data Method
  getData(namespace = "option", def) {
    let data = def;
    if(world.getDynamicProperty(namespace) !== undefined) data = JSON.parse(world.getDynamicProperty(namespace))
    return data
  };
  
  setData(namespace = "option", obj) {
    if(!obj) throw new Error("Error : There is no Object to be set");
 
    world.setDynamicProperty(namespace, JSON.stringify(obj));
  };
  
  /* -------------------------------------------------------------------------------
  * // Method
  --------------------------------------------------------------------------------*/
  getPlayerName(name) {
	if(!name) throw new Error("No Name for searching");
	return world.getPlayers().find(i => i.name == name );
  };

  getPlayerById(id) {
	if(!id) throw new Error("No id for searching");
	return world.getPlayers().find(i => i.id == id );
  };
  
  getOnlineCount() {
	return world.getPlayers().length;
  };
  
  getEntityAtBlock(block, type) {
    if(!block || !type) return;
	let entity = world.getDimension(block.dimension.id).getEntitiesAtBlockLocation(block.location);
    return entity.filter(i => i.typeId.split(":")[1] == type)[0];
  };

  setWorldSetting(rules) {
    if(!rules) return;
	console.warn(`Load...\n[BZB] Version v${ZxraLib.packVersion}\n[BZB] Using ZxraLib v${ZxraLib.version}\n[BZB] Setting morld gamerules...`);
	Object.keys(rules).forEach(r => world.getDimension("minecraft:overworld").runCommand(`gamerule ${r} ${rules[r]}`));
  };

  getActiveDimension() {
    return world.getPlayers().reduce((all, cur) => {
      if(all.includes(cur.dimension.id)) return all;
      all.push(cur.dimension.id);
      return all;
    }, [])
  }
  
  /* -------------------------------------------------------------------------------
  * // Efficiency Method
  --------------------------------------------------------------------------------*/
  
  allPlayers() {
    return players;
  }
  setPlayers(arr) {
    if(Array.isArray(arr)) throw new Error("Error on setting players")
    players.splice(0)
    players.push(...arr)
  }
  
  /* -------------------------------------------------------------------------------
  * // Setting Method
  --------------------------------------------------------------------------------*/
  getSetting() {
    return this.getData("option") ? JSON.parse(this.getData("option")) : json.setting;
  };
  setSetting(obj) {
    this.setData("option", JSON.stringify(obj));
  };
}

export { Game };