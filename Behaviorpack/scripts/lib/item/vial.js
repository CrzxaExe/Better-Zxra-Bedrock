import { specialItem, Entity, Specialist } from "../../system.js";
import { world, system, ItemStack } from "@minecraft/server";

specialItem.useItem("vial_water", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
})

// Stamina
specialItem.useItem("vial_stamina_0", (player) => {
	let data = new Specialist(player)
	data.addStamina("value", 50)
	data.addThirst("value", 10)
})
specialItem.useItem("vial_stamina_1", (player) => {
	let data = new Specialist(player)
	data.addStamina("value", 75)
	data.addThirst("value", 10)
})
specialItem.useItem("vial_stamina_2", (player) => {
	let data = new Specialist(player)
	data.addStamina("value", 100)
	data.addThirst("value", 10)
})

specialItem.useItem("vial_stamina_drop_0", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.status().addStatus("stamina_stuck", 60*1, { decay: "time", lvl: 1, stack: false, type: "st_stuck"})
})

// Atk Buff
specialItem.useItem("vial_atk_0", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.status().addStatus("power", 60*1.3, { decay: "time", lvl: 20, stack: false, type: "damage"})
})
specialItem.useItem("vial_atk_1", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.status().addStatus("power", 60*2.7, { decay: "time", lvl: 40, stack: false, type: "damage"})
})

// Heal
specialItem.useItem("vial_heal_0", (player, item) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.heal(15)
})
specialItem.useItem("vial_heal_1", (player, item) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.heal(25)
})

// Skill Buff
specialItem.useItem("vial_skill_0", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.status().addStatus("skill_power", 60*1.5, { decay: "time", lvl: 30, stack: false, type: "skill"})
})
specialItem.useItem("vial_skill_1", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.status().addStatus("skill_power", 60*3.1, { decay: "time", lvl: 60, stack: false, type: "skill"})
})

// Speed & Jump Buff
specialItem.useItem("vial_speed_jump_0", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.addEffect([{ name: "speed", duration: 20*60*1.5, lvl: 1 },{ name: "jump_boost", duration: 20*60*1.5, lvl: 0 }])
})
specialItem.useItem("vial_speed_jump_1", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.addEffect([{ name: "speed", duration: 20*60*2, lvl: 2 },{ name: "jump_boost", duration: 20*60*2, lvl: 1 }])
})
specialItem.useItem("vial_speed_jump_2", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.addEffect([{ name: "speed", duration: 20*60*3, lvl: 2 },{ name: "jump_boost", duration: 20*60*3, lvl: 2 }])
})

// Fire Res & Res Buff
specialItem.useItem("vial_fireres_def_0", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.addEffect([{ name: "fire_resistance", duration: 20*60*1.5, lvl: 0 },{ name: "resistance", duration: 20*60*1.5, lvl: 0 }])
})
specialItem.useItem("vial_fireres_def_1", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.addEffect([{ name: "fire_resistance", duration: 20*60*1.8, lvl: 0 },{ name: "resistance", duration: 20*60*1.8, lvl: 1 }])
})
specialItem.useItem("vial_fireres_def_2", (player) => {
	let data = new Specialist(player)
	data.addThirst("value", 10)
	data.addEffect([{ name: "fire_resistance", duration: 20*60*2.4, lvl: 0 },{ name: "resistance", duration: 20*60*2.4, lvl: 1 }])
})