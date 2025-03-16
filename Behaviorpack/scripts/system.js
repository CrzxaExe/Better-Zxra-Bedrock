import { EffectTypes, ItemStack, system, world, Player } from "@minecraft/server";
import { leveling, Entity, Items } from "./lib/ZxraLib/module.js";
import { Npc } from "./lib/npc-class.js";
import {
  Terra
} from "./lib/ZxraLib/class.js";
import * as data from "./lib/data.js";

// Main Class of Block UI
export class BlockUi {
	static blocks = []

	static addBlock(block, callback, item) {
		this.blocks.push({ block, item, callback })
	}
}
// Spawn Particle
export function spawnParticles(particle, dimension, location) {
	world.getDimension(dimension).spawnParticle(particle, location)
}

// Classes

// Block Class
export class Tile {
	constructor(block) {
		if(!block) throw new Error("Invalid block")
		this.block = block
		this.world = Terra
		this.entity = world.getEntityAtBlock(this.block, "block_data")
		if(!this.entity || this.entity == undefined || this.entity == null) {
          world.getDimension(block.dimension.id).spawnEntity("cz:block_data")
          this.entity = this.world.getEntityAtBlock(this.block, "block_data")
        }

		this.data = new BlockEntity(this.entity, block)
	}

	// Power Method
	getPower() {
		let data = this.data.getData()

		if(data.power == undefined) return undefined
		return { power: data.power, text: `${Number(data.power.stored).toFixed(2)}/${data.power.max}` }
	}
	addPower(amount) {
		let data = this.data.getData();
		amount= Number(amount)

		if(this.getPower() == undefined) return
		data.power.stored + amount <= data.power.max ? data.power.stored += amount : data.power.stored = data.power.max;
		this.data.setData(data)
	}
	getPowerStatus() {
		let data = this.data.getData(), on;

		if(data.powerStatus == undefined) return undefined
		data.powerStatus == true ? on = "On": on = "Off";
		return on
	}
	switchPower(type) {
		let data = this.data.getData();

		if(this.getPowerStatus() == undefined) return Error("Not power block")
		data.powerStatus = !data.powerStatus

		switch(type) {
			case "generator":
			  data.powerStatus == false ? this.data.entity.removeTag("generator") : this.data.entity.addTag("generator")
			  break;
		}
		this.data.setData(data)
	}
	generatePower(power, fuel) {
		let data = this.data.getData()

		if(this.getFuel() == undefined || data.fuel - fuel < -0.001) return
		if(data.power == undefined) return

		this.addPower(power)
		this.minFuel(fuel)
	}
	isGenerate() {
		let power = this.getPower()
		return this.data.entity.hasTag("generator") && this.getFuel() >= 0.4 && power.power.stored < power.power.max
	}
	getVolt() {
		let data = this.data.getData(), volt = -1

		if(data.generator == undefined) return volt
		this.isGenerate() ? volt = data.generator/5 : volt = 0;
		return volt
	}
	// Fuel Method
	getFuel() {
		let data = this.data.getData()

        if(data.fuel == undefined) return undefined
        return data.fuel.toFixed(2)
	}
	addFuel(amount) {
		let data = this.data.getData()

		if(data.fuel == undefined) return
		data.fuel += Number(amount)
		this.data.setData(data)
	}
	minFuel(amount) {
		this.addFuel(-Number(amount))
	}
	
}
// Block Entity Class
export class BlockEntity {
	/*
	 * Class for Block Entity
	*/
	constructor(entity, block) {
		if(!entity || !block) throw new Error("Invalid Entity or Block")
		this.entity = entity
		this.block = block
		this.raw = data.blockData
	}

	// Data method
	getData() {
		let data = this.raw[this.block.type.id.split(":")[1]]
		if(this.entity.getDynamicProperty("block_data") !== undefined) data = JSON.parse(this.entity.getDynamicProperty("block_data"))
		return data
	}
	setData(obj) {
		this.entity.setDynamicProperty("block_data", JSON.stringify(obj))
	}
	clearData() {
		this.entity.setDynamicProperty("block_data", JSON.stringify(this.raw[this.block.type.id.split(":")[1]]))
	}
	
}
// CrzxaExe3--