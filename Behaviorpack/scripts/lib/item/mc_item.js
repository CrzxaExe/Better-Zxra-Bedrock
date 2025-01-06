import { Specialist } from "../../system.js";
import { world, system, ItemStack } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

import { teleportUi, teleportConfirm, teleportToPlayer, Game, SpecialItem, Entity } from '../ZxraLib/module.js';

// Add Section
SpecialItem.addItem("card_of_return", (player, item) => {
    let loc = player.getSpawnPoint();
    if(!loc) return player.sendMessage({ translate: "system.playersp.no" });

    teleportConfirm(player, loc, { translate: "system.confirm.teleportReturn" }, item)
})

SpecialItem.addItem("card_of_teleportation", (player, item) => {
    if(!player || !item) return;

    teleportUi(player, item)
})

SpecialItem.addItem("card_of_player", (player, item) => {
    if(!player || !item) return;

    teleportToPlayer(player, item)
})

SpecialItem.addItem("card_of_worldspawn", (player, item) => {
    let loc = world.getDefaultSpawnLocation();
    if(!loc) return player.sendMessage({ translate: "system.playersp.no" });

    teleportConfirm(player, {...loc, dimension: { id: "minecraft:overworld" } }, { translate: "system.confirm.teleportSpawn" }, item)
})


SpecialItem.addItem("money_card", (player, item) => {
  new Specialist(player).addMoney(2000)
  player.sendMessage({ rawtext: [{ translate: "system.get" },{ text: " $2000" }]})
  player.runCommand(`clear @s ${item.typeId} 0 1`)
})

SpecialItem.addItem("guild_max_member_up", (player, item) => {
  let gd = new Game().guild().gd().findIndex(e => e.id === id);
  if(!gd) return player.sendMessage({ translate: "system.guild.notHave" });
  new Game().guild().addMaxMember(gd.id, 1);
  player.runCommand(`clear @s ${item.typeId} 0 1`)
})

// Use Section
SpecialItem.useItem("potion", (player) => {
	new Specialist(player).addThirst("value", 14)
})

SpecialItem.useItem("honey_bottle", (player) => {
	new Specialist(player).addThirst("value", 4)
})

SpecialItem.useItem("apple", (player) => {
	new Specialist(player).addThirst("value", 5)
})

SpecialItem.useItem("melon_slice", (player) => {
	new Specialist(player).addThirst("value", 4)
})