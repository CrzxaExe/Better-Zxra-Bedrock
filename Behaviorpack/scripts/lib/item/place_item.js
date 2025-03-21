import { SpecialItem, Entity, Specialist } from "../ZxraLib/module.js";
import { world, system, ItemStack } from "@minecraft/server";

SpecialItem.placeItem("vial", (player, item, block) => {
	let sp = new Specialist(player)
	
	switch(block.type.id.split(":")[1]) {
		case "water":
		  if(item.amount - 1 < 1) return sp.setItem("cz:vial_water", 1);
		  let prevItem = new ItemStack(item.typeId)
		  prevItem.amount = item.amount - 1
	  	player.getComponent("inventory").container.setItem(player.selectedSlotIndex, prevItem)
		  sp.giveItem([{ id: "cz:vial_water", amount: 1 }])
		  break;
	}
})