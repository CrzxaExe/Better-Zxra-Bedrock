import { world } from "@minecraft/server";
import { Leaderboard, Guild, ZxraLib } from "../module.js";
import * as json from "../../data.js";

class Game {
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