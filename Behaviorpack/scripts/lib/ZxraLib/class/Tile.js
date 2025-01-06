import { world } from "@minecraft/server";
import { Game, BlockContainer } from "../module";

class Tile {
  constructor(block) {
    if(!block) throw new Error("Invalid Tile parameter");
    this.tile = block
  }

  getData() {
    return new Game().getData("blocks");
  }
  setData(obj) {
    new Game().setData("blocks", obj);
  }
  clearData(obj) {
    new Game().setData("blocks", []);
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
