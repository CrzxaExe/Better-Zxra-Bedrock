class Ench {
	constructor(item) {
		if(!item) throw new Error("No items");
		this.item = item;
	};

    enchant() {
    	return this.item.getComponent("minecraft:enchantable");
    };
	getEnchants() {
		return this.enchant().getEnchantments();
	};
	display() {
		let data = this.getEnchants();
		return data;
	};
};

export { Ench };