class ItemContainer {
  constructor(item) {
    if(!item)
      throw new Error("No items");

    if(!item.hasTag("cz:container"))
      throw new Error("Not have container");

    this.item = item;
  }

  // Get Method
  getAll() {
    return this.item.getLore(); // Return Array
  }

  getContentIndex(content) {
    if(!content) return;
    return this.getAll().findIndex(e => e.include(content));
  }

  getSlot(index = 0) {
    return this.getAll()[index];
  }

  getItemSlot(index = 0) {
    let slot = this.getSlot(index);
    return {
      item: slot.split("*")[0].trim(),
      count: Number(slot.split("*")[1].trim()) || 1
    };
  }

  // Save Method
  save(arr) {
    this.item.setLore(arr);
  }

  // Remove Method
  remSlot(index) {
    if(!index) return new Error("Index must be integer");
    let data = this.getAll();
    data.splice(index, 0);
    this.save(data);
  }

  reset() {
    this.save([]);
  }

  // Update Method
  update(index, content) {
    if(!index || !content) return new Error("Error from index or content not found");
    let data = this.getAll();

    data[index] = content;

    this.save(data)
  }
}

export { ItemContainer };