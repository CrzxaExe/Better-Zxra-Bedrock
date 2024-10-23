import { world } from "@minecraft/server";
import { Game } from "../module";

class Tile {
  getData() {
    return new Game().getData("blocks");
  }
  setData(obj) {
    new Game().setData("blocks", obj);
  }
}

export { Tile };
