import { Game } from "./module.js";

let Terra = null

try {
  Terra = Game.getInstance();
  Terra.initialize()
} catch(err) {
  console.warn(err)
}

export {
  Terra
}
