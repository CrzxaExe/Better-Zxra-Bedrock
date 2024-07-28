import { world } from "@minecraft/server";
import { Leaderboard, Guild } from "../module.js";
import * as json from "../../data.js";

class Game {
  constructor(wld) {
     this.game = wld || world
  }
  // Data Method
  getData(namespace = "option") {
    let data;
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
	let entity = world.getDimension(block.dimension.id).getEntitiesAtBlockLocation(block.location), filtered = entity.filter(i => i.typeId.split(":")[1] == type);
    return filtered[0];
  };

  setWorldSetting(rules) {
    if(!rules) return;
	console.warn("[BZB] Setting morld gamerules with custom rules...");
	Object.keys(rules).forEach(r => world.getDimension("minecraft:overworld").runCommand(`gamerule ${r} ${rules[r]}`));
  };
  
  /* -------------------------------------------------------------------------------
  * // Setting Method
  --------------------------------------------------------------------------------*/
  getSetting() {
    return this.getData("option") ? JSON.parse(this.getData("option")) : json.setting;
  };
  setSetting(obj) {
    this.setData("option", JSON.stringify(obj));
  };
  
  /* -------------------------------------------------------------------------------
  * // Leaderboard Method
  --------------------------------------------------------------------------------*/
  leaderboard() {
    return new Leaderboard(this)
  };
  /* -------------------------------------------------------------------------------
  * // Guild Method
  --------------------------------------------------------------------------------*/
  guild() {
    return new Guild(this)
  };
}

export { Game };