import { SpecialItem, Entity, Specialist } from "../ZxraLib/module.js";
import { world, system, ItemStack } from "@minecraft/server";

SpecialItem.useItem("vial_water", (player) => {
	new Specialist(player).addThirst("value", 10)
})

// Stamina
SpecialItem.useItem("vial_stamina_0", (player) => {
	let data = new Specialist(player)
	data.addStamina("value", 50)
	data.addThirst("value", 10)
})
SpecialItem.useItem("vial_stamina_1", (player) => {
	let data = new Specialist(player)
	data.addStamina("value", 75)
	data.addThirst("value", 10)
})
SpecialItem.useItem("vial_stamina_2", (player) => {
	let data = new Specialist(player)
	data.addStamina("value", 100)
	data.addThirst("value", 10)
})

SpecialItem.useItem("vial_stamina_stuck_0", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.status().addStatus("stamina_stuck", 60*0.8, { decay: "time", lvl: 1, stack: false, type: "st_stuck"})
})

SpecialItem.useItem("vial_stamina_recovery_0", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.status().addStatus("stamina_recovery", 60*1, { decay: "time", lvl: 1, stack: false, type: "st_recovery"})
})

// Atk Buff
SpecialItem.useItem("vial_atk_0", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.status().addStatus("power", 60*1.3, { decay: "time", lvl: 20, stack: false, type: "damage"})
})
SpecialItem.useItem("vial_atk_1", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.status().addStatus("power", 60*2.7, { decay: "time", lvl: 40, stack: false, type: "damage"})
})

// Heal
SpecialItem.useItem("vial_heal_0", (player, item) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.heal(15)
})
SpecialItem.useItem("vial_heal_1", (player, item) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.heal(25)
})
SpecialItem.useItem("vial_heal_2", (player, item) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.heal(30)
})

// Skill Buff
SpecialItem.useItem("vial_skill_0", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.status().addStatus("skill_power", 60*1.5, { decay: "time", lvl: 30, stack: false, type: "skill"})
})
SpecialItem.useItem("vial_skill_1", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.status().addStatus("skill_power", 60*3.1, { decay: "time", lvl: 60, stack: false, type: "skill"})
})
SpecialItem.useItem("vial_skill_2", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.status().addStatus("skill_power", 60*3.6, { decay: "time", lvl: 70, stack: false, type: "skill"})
})

// Speed & Jump Buff
SpecialItem.useItem("vial_speed_jump_0", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.addEffect([{ name: "speed", duration: 20*60*1.5, lvl: 1 },{ name: "jump_boost", duration: 20*60*1.5, lvl: 0 }])
})
SpecialItem.useItem("vial_speed_jump_1", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.addEffect([{ name: "speed", duration: 20*60*2, lvl: 2 },{ name: "jump_boost", duration: 20*60*2, lvl: 1 }])
})
SpecialItem.useItem("vial_speed_jump_2", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.addEffect([{ name: "speed", duration: 20*60*3, lvl: 2 },{ name: "jump_boost", duration: 20*60*3, lvl: 2 }])
})

// Fire Res & Res Buff
SpecialItem.useItem("vial_fireres_def_0", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.addEffect([{ name: "fire_resistance", duration: 20*60*1.5, lvl: 0 },{ name: "resistance", duration: 20*60*1.5, lvl: 0 }])
})
SpecialItem.useItem("vial_fireres_def_1", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.addEffect([{ name: "fire_resistance", duration: 20*60*1.8, lvl: 0 },{ name: "resistance", duration: 20*60*1.8, lvl: 1 }])
})
SpecialItem.useItem("vial_fireres_def_2", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.addEffect([{ name: "fire_resistance", duration: 20*60*2.4, lvl: 0 },{ name: "resistance", duration: 20*60*2.4, lvl: 1 }])
})