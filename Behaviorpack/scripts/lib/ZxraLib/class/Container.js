import { system } from "@minecraft/server";

class ItemContainer {
  constructor(item) {
    if(!item)
      throw new Error("No items");

    this.item = item;
  }

  // Get Method
  getAll() {
    return this.item.getLore() || []; // Return Array
  }

  getContentIndex(content) {
    if(!content) return;
    return this.getAll().findIndex(e => e.include(content));
  }

  getSlot(index = 0) {
    return this.getAll()[index];
  }

  getItemSlot(index = 0) {
    const slot = this.getSlot(index);
    return {
      item: slot.trim().split("*")[0].replace("minecraft:", "").split("_").map(e => e.startsWith("cz:") ? e.substring(0,3) + e.charAt(3).toUpperCase() + e.slice(4) : e.charAt(0).toUpperCase() + e.slice(1) ),
      count: Number(slot.trim().split("*")[1]) || 1
    };
  }

  // Add Method
  addSlot({ item, count = 1 }) {
    if(!item) return;
    const data = this.getAll(),
      findIndex = data.findIndex(e => e.includes(item.trim().replace("minecraft:", "").split("_").map(e => e.startsWith("cz:") ? e.substring(0,3) + e.charAt(3).toUpperCase() + e.slice(4) : e.charAt(0).toUpperCase() + e.slice(1) )));

    if(findIndex === -1) {
      data.push(`${item.trim().replace("minecraft:", "").split("_").map(e => e.startsWith("cz:") ? e.substring(0,3) + e.charAt(3).toUpperCase() + e.slice(4) : e.charAt(0).toUpperCase() + e.slice(1) )}*${count}`);
      this.save(data);
      return;
    }

    const [itemName, quantity] = data[findIndex].split("*")
    data[findIndex] = `${itemName}*${quantity+count}`;
    this.save(data);
  }

  // Save Method
  async save(arr) {
    try {
      this.item.setLore(arr)
    } catch(err) {
      console.warn(err)
    }
  }

  // Remove Method
  remSlot(index) {
    if(!index) return new Error("Index must be integer");
    const data = this.getAll();
    data.splice(index, 0);
    this.save(data);
  }

  reset() {
    this.save([]);
  }

  // Update Method
  update(index, content) {
    if(!index || !content) return new Error("Error from index or content not found");
    const data = this.getAll();

    data[index] = content;

    this.save(data)
  }
}

class BlockContainer {
  constructor(block) {
    if(!block)
      throw new Error("No block");
    this.block = block;
  }
}

export { BlockContainer, ItemContainer };