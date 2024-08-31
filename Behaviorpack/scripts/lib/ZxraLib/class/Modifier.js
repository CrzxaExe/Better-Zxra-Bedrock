export class Modifier {
  static mod = [];

  static addMod(mod, type = "hit", callback, option) {
    this.mod.push({ mod, type, callback, option });
  }

  static getModByType(type = "hit") {
    return this.mod.filter(e => e.type === type);
  }

  static getModByTag(tag) {
    if (!tag) return;
    return this.mod.filter(e => e.option.tag.inlcudes(tag));
  }

  static getModByTypeAndTag(type = "hit", tag) {
    if (!tag) return;
    return this.mod.filter(e => e.type === type && e.option.tag.includes(tag));
  }
}
