import { EffectTypes, system, world, Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { Specialist } from "../system.js";
import { userPanel } from "./items.js";
import { Npc } from "./npc-class.js";
import { Game, Entity, farmerShop } from './ZxraLib/module.js';
import * as jsonData from "./data.js";

var dis = {}

/*
*. 3rd Party Features
*/
system.afterEvents.scriptEventReceive.subscribe(s => {
	let entity = s.sourceEntity,
      message = s.message.split(" "),
      id = s.id.split(":")[1],
      initiator = s.initiator || entity.getEntitiesFromViewDirection()[0] || undefined;
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
Script.add("dash", (entity, { msg }) => {
	const [ hor = 0, ver = 0 ] = msg[0]

	let vel = entity.getVelocity(), rot = entity.getRotation();
    rot.y = (rot.y + 45)* Math.PI/180;
    const velocity = {
	  "x": (Math.cos(rot.y)-Math.sin(rot.y))*1,
	  "y": 0,
	  "z": (Math.sin(rot.y)+Math.cos(rot.y))*1,
	}

	new Entity(entity).knockback(velocity, Number(hor), Number(ver))
})

// Bind Feature
Script.add("bind", (entity, { msg }) => {
	new Entity(entity).bind(Number(msg[0]) || 1)
})

// Status Feature
Script.add("status", async (entity, { msg }) => {
	if(!msg[0]) return
	let ent = new Entity(entity),
      status = ent.status(),
	  [ name, duration = 1, lvl = 1, type = "none", stack = false, decay = "time" ] = msg;
	["yes","yup","true"].includes(msg[4]) ? stack = true : stack = false;
	// console.warn(JSON.stringify({ name, duration, lvl, type, stack, decay }))

	/*
	*. param1 = name - String
	*. param2 = duration - Number
	*. param3 = lvl - Number
	*. param4 = type - String
	*. param5 = stackable - Boolean || String
	*. param6 = decay type - String
	*/
	try {
		status.addStatus(name, duration, { lvl, type, stack, decay })
	} finally {
		status.addStatus(name, duration, { lvl, type, stack, decay })
	}
})

// Clear all status Feature
Script.add("clear_all_status", (entity) => {
	new Entity(entity).status().clearAll()
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
	let npc = ent.npc()
	npc.npcUi(entity)
})

// Shop[farmer] menu
Script.add("shop_farmer_menu", (entity, { initiator }) => {
  farmerShop(entity, initiator)
})

// Set on fire Feature
Script.add("set_on_fire", (entity, { msg }) => {
	if(!entity) return
	entity.setOnFire(msg[0] || 1)
})

// Money Features
// Add Money Feature
Script.add("give_money", (entity, { msg }) => {
	/*
	*. param: amount - Number
	*/
	if(!(entity instanceof Player)) return
	new Specialist(entity).addMoney(Number(msg[0]) || 0)
})
// Take Money Feature
Script.add("take_money", (entity, { msg }) => {
	/*
	*. param: amount - Number
	*/
	if(!(entity instanceof Player)) return
	new Specialist(entity).takeMoney(Number(msg[0]) || 0)
})
// Set Money Feature
Script.add("set_money", (entity, { msg }) => {
	/*
	*. param: amount - Number
	*/
	if(!(entity instanceof Player)) return
	new Specialist(entity).setMoney(Number(msg[0]) || 0)
})
// Reset Money Feature
Script.add("reset_money", (entity) => {
	if(!(entity instanceof Player)) return
	new Specialist(entity).resetMoney()
})

// Reputation Features
// Add Reputation Feature
Script.add("add_rep", (entity, { msg }) => {
	/*
	*. param: amount - Number
	*/
	if(!(entity instanceof Player)) return
	new Specialist(entity).addRep(Number(msg[0]) || 0)
})
// Min Reputation Feature
Script.add("min_rep", (entity, { msg }) => {
	/*
	*. param: amount - Number
	*/
	if(!(entity instanceof Player)) return
	new Specialist(entity).minRep(Number(msg[0]) || 0)
})
// Set Reputation Feature
Script.add("set_rep", (entity, { msg }) => {
	/*
	*. param: amount - Number
	*/
	if(!(entity instanceof Player)) return
	new Specialist(entity).setRep(Number(msg[0]) || 0)
})
// Reset Reputation Feature
Script.add("reset_rep", (entity) => {
	if(!(entity instanceof Player)) return
	new Specialist(entity).resetRep()
})

// Specialist Features
Script.add("sp_add", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity),
      [ key = "xp", num = 0 ] = msg

	if(!sp.getData().specialist[key]) return
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
	let sp = new Specialist(entity),
      [ key = "value", num = 0 ] = msg

	if(!sp.getThirst()[key]) return
	sp.addThirst(key, num)
})
// Min Thirst
Script.add("min_thist", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity),
      [ key = "value", num = 0 ] = msg

	if(!sp.getThirst()[key]) return
	sp.minThirst(key, num)
})
// Set Thirst
Script.add("set_thist", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity),
      [ key = "value", num = 0 ] = msg

	if(!sp.getThirst()[key]) return
	sp.setThirst(key, num)
})
// Reset Value Thirst
Script.add("reset_value_thist", (entity) => {
	if(!(entity instanceof Player)) return
	new Specialist(entity).setValueDefaultThirst()
})
// Stamina Features
// Add Stamina
Script.add("add_stamina", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity),
      [ key = "value", num = 0 ] = msg

	if(!sp.getStamina()[key]) return
	sp.addStamina(key, num)
})
// Min Stamina
Script.add("min_stamina", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity),
      [ key = "value", num = 0 ] = msg

	if(!sp.getStamina()[key]) return
	sp.minStamina(key, num)
})
// Set Stamina
Script.add("set_stamina", (entity, { msg }) => {
	/*
	*. param1: key - String
	*. param2: amount - Number
	*/
	if(!(entity instanceof Player)) return
	let sp = new Specialist(entity),
        [ key = "value", num = 0 ] = msg

	if(!sp.getStamina()[key]) return
	sp.setStamina(key, num)
})
// Reset Value Stamina
Script.add("reset_value_stamina", (entity) => {
	if(!(entity instanceof Player)) return
	new Specialist(entity).setValueDefaultStamina()
})


// Reset Leaderboard
Script.add("reset_data_leaderboard", (entity, { msg }) => {
  new Game().leaderboard().resetLb()
})
// Delete All Guild
Script.add("delete_all_guild", (entity, { msg }) => {
  new Game().guild().resetGd()
})