import { GameMode, system } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { ItemContainer, Specialist } from "../module.js";

const couponEdit = (player, item, data, container) => {
  if(player.getGameMode() !== GameMode.creative) return

  const ui = new ActionFormData()
    .title({ translate: "system.coupon.edit" })
    .body({ translate: "system.coupon.edit.body" });

  data.forEach(e => {
    const [itemName, quantity = 1] = e.split("*");
    ui.button({ text: `${quantity} × ${itemName}` });
  })
  
  ui.button({ translate: "system.coupon.add" })
    .show(player)
    .then(e => {
      if(e.canceled) {
        new ItemContainer(player.getComponent("inventory").container.getSlot(player.selectedSlotIndex)).save(data)
        player.sendMessage({ translate: "system.coupon.save" });
        return;
      }

      if(e.selection < data.length) {
        const [prevItem, prevQuantity] = data[e.selection].split("*");

        const input = new ModalFormData()
          .title({ translate: "system.coupon.edit" })
          .textField({ translate: "type.itemName" }, { translate: "type.string" }, prevItem.replace(/ /gi, "_").toLowerCase())
          .textField({ translate: "type.count" }, { translate: "type.number" }, prevQuantity)
          .submitButton({ translate: "system.edit" })
          .show(player)
          .then(e => {
            if(e.canceled) {
              couponEdit(player, item, data, container);
              return;
            }

            const [newItem, quantity = 1] = e.formValues;

            data.splice(e.selection, 1, `${newItem.trim().replace("minecraft:", "").split("_").map(e => e.startsWith("cz:") ? e.substring(0,3) + e.charAt(3).toUpperCase() + e.slice(4) : e.charAt(0).toUpperCase() + e.slice(1)).join(" ")}*${parseInt(quantity)}`);
            couponEdit(player, item, data, container);
            return;
          })
      } else if(e.selection == data.length) {
        const input = new ModalFormData()
          .title({ translate: "system.coupon.input" })
          .textField({ translate: "type.itemName" }, { translate: "type.string" })
          .textField({ translate: "type.count" }, { translate: "type.number" })
          .submitButton({ translate: "system.add" })
          .show(player)
          .then(e => {
            if(e.canceled) {
              couponEdit(player, item, data, container);
              return;
            }

            const [itemName, quantity = 1] = e.formValues;

            data.push(`${itemName.trim().replace("minecraft:", "").split("_").map(e => e.startsWith("cz:") ? e.substring(0,3) + e.charAt(3).toUpperCase() + e.slice(4) : e.charAt(0).toUpperCase() + e.slice(1)).join(" ")}*${parseInt(quantity || 1)}`)
            couponEdit(player, item, data, container);
            return;
          })
      }
    })
}

const couponUse = (player, item) => {
  const container = new ItemContainer(item),
    data = container.getAll();

  if(data.length < 1) {
    player.sendMessage({ translate: "system.coupon.invalid" });
    return;
  }

  data.forEach(e => {
    const [item, quantity = 1] = e.split("*");
    
    const itemName = item.trim().replace(/ /gi, "_").toLowerCase();

    if(itemName.startsWith("$")) {
      new Specialist(player).addMoney(parseInt(itemName.slice(1)));
      player.sendMessage({ translate: "system.get.money", with: [String(itemName.slice(1))] });
    } else if(itemName.startsWith("xp")) {
      player.addExperience(parseInt(itemName.split("_")[1] || 1));
      player.sendMessage({ translate: "system.get.xp", with: [String(itemName.split("_")[1])] });
    } else {
      player.runCommand(`give @s ${itemName} ${quantity}`);
    }
  })
}

export { couponEdit, couponUse };