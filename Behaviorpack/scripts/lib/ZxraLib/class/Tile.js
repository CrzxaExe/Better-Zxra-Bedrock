import { world } from "@minecraft/server";
import { BlockContainer } from "../module.js";
import { Terra } from "../class.js";

class Tile {
  constructor(block) {
    if(!block) throw new Error("Invalid Tile parameter");
    this.tile = block
  }

  getData() {
    return Terra.getData("blocks");
  }
  setData(obj) {
    Terra.setData("blocks", obj);
  }
  clearData(obj) {
    Terra.setData("blocks", []);
  }

  hasTag(tag = []) {
    return tag.map(e => this.tile.hasTag(e));
  }

  container() {
    if(!this.tile.hasTag("cz:container")) return;
    return new BlockContainer(this.tile);
  }
}

export { Tile };
