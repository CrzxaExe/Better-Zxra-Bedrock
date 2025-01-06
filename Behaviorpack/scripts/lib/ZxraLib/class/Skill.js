// Templating Skill
import { skillData } from "../module.js";

class Skill {
  static s = []
  
  static runSkill(name, lib) {
    const callback = this.s.find(e => e.name === name);
    if(!callback) return;
    callback.run(lib);
  }
}

export { Skill };