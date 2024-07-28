import { specialItem, Entity, Specialist } from "../../system.js";
import { world, system, ItemStack } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

import { teleportUi, teleportConfirm } from '../ZxraLib/module.js';

// Add Section
specialItem.addItem("card_of_return", (player, item) => {
    let loc = player.getSpawnPoint();
    if(!loc) return player.sendMessage({ translate: "system.playersp.no" });

    teleportConfirm(player, loc, { translate: "system.confirm.teleportReturn" }, item)
})

specialItem.addItem("card_of_teleportation", (player, item) => {
    if(!player || !item) return;

    teleportUi(player, item)
})

specialItem.addItem("card_of_worldspawn", (player, item) => {
    let loc = world.getDefaultSpawnLocation();
    if(!loc) return player.sendMessage({ translate: "system.playersp.no" });

    teleportConfirm(player, {...loc, dimension: { id: "minecraft:overworld" } }, { translate: "system.confirm.teleportSpawn" }, item)
})


specialItem.addItem("money_card", (player, item) => {
  let sp = new Specialist(player);
  sp.addMoney(2000)
  player.sendMessage({ rawtext: [{ translate: "system.get" },{ text: " $2000" }]})
  player.runCommand(`clear @s ${item.typeId} 0 1`)
})

// Use Section
specialItem.useItem("potion", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 14)
})

specialItem.useItem("honey_bottle", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 4)
})

specialItem.useItem("apple", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 5)
})

specialItem.useItem("melon_slice", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 4)
})