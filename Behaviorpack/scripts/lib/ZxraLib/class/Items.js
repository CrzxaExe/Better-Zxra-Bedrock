class Items {
  constructor(item) {
    if(!item) throw new Error("Invalid Item")
    this.item = item
  }
  
  // Method
  getDurability() {
    return this.item.getComponent("durability")
  }
  getTag() {
    return this.item.getTags()
  }
  getTier() {
    return this.getTag()
          .filter(e => e.startsWith("tier_"))
          .reduce((all, cur) => cur.split("_")[1] > all ? all = cur.split("_")[1] : 0, 0 )
  }
  getType() {
	return this.getTag().find(e => data.weaponType.includes(e))
  }
  enchant() {
	return new Ench(this.item)
  }
}

class SpecialItem {
  static item = []
  static use = []
  static con = []
  
  static addItem(item, callback) {
	this.item.push({ item, callback })
  }
  static useItem(item, callback) {
	this.use.push({ item, callback })
  }
  static placeItem(item, callback) {
	this.con.push({ item, callback })
  }
}

export { Items, SpecialItem };