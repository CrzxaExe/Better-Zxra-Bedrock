import { EffectTypes, system, world, Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { Entity, Specialist } from "../system.js";
import { userPanel } from "./items.js";
import { Npc } from "./npc-class.js";
import { Game } from './ZxraLib/module.js';
import * as jsonData from "./data.js";

var dis = {}

/*
*. 3rd Party Features
*/
system.afterEvents.scriptEventReceive.subscribe(s => {
	let entity = s.sourceEntity, message = s.message.split(" "), id = s.id.split(":")[1], initiator = s.initiator || entity.getEntitiesFromViewDirection()[0] || undefined
	//console.warn(JSON.stringify(s))

	let find = Script.script.find(e => e.id == id)
	if(!find) return
	find.callback(entity, { msg: message, initiator })
}, { namespaces: ["cz"] })

class Script {
	static script = []

	static add(id, funct) {
		this.script.push({ id, callback: funct })
	}
}

// Dash Feature
Script.add("dash", (entity, lib) => {
	let ent = new Entity(entity), hor = Number(lib.msg[0]) || 0, ver = Number(lib.msg[1]) || 0

	let vel = entity.getVelocity(), rot = entity.getRotation();
    rot.y = (rot.y + 45)* Math.PI/180;
    let velocity = {
	  "x": (Math.cos(rot.y)-Math.sin(rot.y))*1,
	  "y": 0,
	  "z": (Math.sin(rot.y)+Math.cos(rot.y))*1,
	}

	ent.knockback(velocity, hor, ver)
})

// Bind Feature
Script.add("bind", (entity, { msg }) => {
	let ent = new Entity(entity), dur = Number(msg[0]) || 1

	ent.bind(dur)
})

// Status Feature
Script.add("status", async (entity, { msg }) => {
	if(!lib.msg[0]) return
	let ent = new Entity(entity), status = ent.status(), name = msg[0], duration = msg[1] || 1, lvl = msg[2] || 1, type = msg[3] || "none", decay = msg[5] || "time"
	let stack
	["yes","yup","true"].includes(msg[4]) ? stack = true : stack = false;

	/*
	*. param1 = name - String
	*. param2 = duration - Number
	*. param3 = lvl - Number
	*. param4 = type - String
	*. param5 = stackable - Boolean || String
	*. param6 = decay type - String
	*/
	try {
		await status.addStatus(name, duration, { lvl, type, stack, decay })
	} finally {
		status.addStatus(name, duration, { lvl, type, stack, decay })
	}
})

// Clear all status Feature
Script.add("clear_all_status", (entity) => {
	let ent = new Entity(entity)
	ent.status().clearAll()
})

// Player menu Feature
Script.add("player_menu", (entity) => {
	if(!(entity instanceof Player)) return
	entity.applyDamage(0)
	userPanel(entity)
})

// Yuri menu Feature
Script.add("yuri_menu", (entity, { initiator }) => {
	if(!initiator) return
	let ent = new Entity(initiator.entity)
	if(ent.isNpc() == false) return
	let npc = ent.npc()
	npc.npcUi(entity)
})

// Set on fire Feature
Script.add("set_on_fire", (entity, { msg }) => {
	if(!entity) return
	let duration = msg[0] || 1
	entity.setOnFire(duration)
})

// Money Features
// Add Money Feature
Script.add("give_money", (entity, { msg }) => {
	/*
	*. param: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), add = Number(msg[0]) || 0
	sp.addMoney(add)
})
// Take Money Feature
Script.add("take_money", (entity, { msg }) => {
	/*
	*. param: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), take = Number(msg[0]) || 0
	sp.takeMoney(take)
})
// Set Money Feature
Script.add("set_money", (entity, { msg }) => {
	/*
	*. param: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), sets = Number(msg[0]) || 0
	sp.setMoney(sets)
})
// Reset Money Feature
Script.add("reset_money", (entity) => {
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity)
	sp.resetMoney()
})

// Reputation Features
// Add Reputation Feature
Script.add("add_rep", (entity, { msg }) => {
	/*
	*. param: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), num = Number(msg[0]) || 0
	sp.addRep(num)
})
// Min Reputation Feature
Script.add("min_rep", (entity, { msg }) => {
	/*
	*. param: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), num = Number(msg[0]) || 0
	sp.minRep(num)
})
// Set Reputation Feature
Script.add("set_rep", (entity, { msg }) => {
	/*
	*. param: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), num = Number(msg[0]) || 0
	sp.setRep(num)
})
// Reset Reputation Feature
Script.add("reset_rep", (entity) => {
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity)
	sp.resetRep()
})

// Specialist Features
Script.add("sp_add", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), key = msg[0] || "xp", num = Number(msg[1]) || 0, data = sp.getData()

	if(data.specialist[key] == undefined) return
	sp.addSpecialist(key, num)
})

// Thirst Features
// Add Thirst
Script.add("add_thist", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), key = msg[0] || "value", num = Number(msg[1]) || 0, data = sp.getThirst()

	if(data[key] == undefined) return
	sp.addThirst(key, num)
})
// Min Thirst
Script.add("min_thist", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), key = msg[0] || "value", num = Number(msg[1]) || 0, data = sp.getThirst()

	if(data[key] == undefined) return
	sp.minThirst(key, num)
})
// Set Thirst
Script.add("set_thist", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), key = msg[0] || "value", num = Number(msg[1]) || 0, data = sp.getThirst()

	if(data[key] == undefined) return
	sp.setThirst(key, num)
})
// Reset Value Thirst
Script.add("reset_value_thist", (entity) => {
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity)

	sp.setValueDefaultThirst()
})
// Stamina Features
// Add Stamina
Script.add("add_stamina", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), key = msg[0] || "value", num = Number(msg[1]) || 0, data = sp.getStamina()

	if(data[key] == undefined) return
	sp.addStamina(key, num)
})
// Min Stamina
Script.add("min_stamina", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), key = msg[0] || "value", num = Number(msg[1]) || 0, data = sp.getStamina()

	if(data[key] == undefined) return
	sp.minStamina(key, num)
})
// Set Stamina
Script.add("set_stamina", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity), key = msg[0] || "value", num = Number(msg[1]) || 0, data = sp.getStamina()

	if(data[key] == undefined) return
	sp.setStamina(key, num)
})
// Reset Value Stamina
Script.add("reset_value_stamina", (entity) => {
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity)

	sp.setValueDefaultStamina()
})


// Reset Leaderboard
Script.add("reset_data_leaderboard", (entity, { msg }) => {
  new Game().leaderboard().resetLb()
})
// Delete All Guild
Script.add("delete_all_guild", (entity, { msg }) => {
  new Game().guild().resetGd()
})