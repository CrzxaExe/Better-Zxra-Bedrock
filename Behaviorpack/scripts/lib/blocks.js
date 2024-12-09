import { world, system, ItemStack } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { BlockUi, BlockEntity, Tile, Specialist } from "../system.js";
import { Game } from "./ZxraLib/module.js";
import * as data from "./data.js";

// Ticking Block
system.runInterval(() => {
	let dimension = ["minecraft:overworld", "minecraft:nether", "minecraft:the_end"]
	for(let i = 0; i<dimension.length; i++) {
		world.getDimension(dimension[i]).getEntities({ tags: ["generator"], type: "cz:block_data" }).forEach(e => {
			try {
			  let block = world.getDimension(dimension[i]).getBlock(e.location) || undefined
			  if(block == undefined || !block || block == null) return

			  new Tile(block).generatePower(tile.data.getData().generator, 0.4)
		    } catch(e) {
			   //console.warn(e)
		    }
        })
	}
}, 100)

// Panel Resource
let core = (block, player, item) => {
	let pln =  new Tile(block);

    let panel = new ActionFormData()
	.title({ translate: `tile.${block.type.id.split(":")[1]}.name` })
	.body({ rawtext: [
      { text: " \n" },
      { translate: "system.power" },
	  { text: ` ${pln.getPower().text} Watt\n` },
	  { translate: "system.powerStatus" },
	  { text: ` ${pln.getPowerStatus()}\n \n` },
	  { translate: "system.fuel" },
	  { text: ` ${pln.getFuel()} `},
      { translate: "system.plasPower" },
      { text: "\n" },
      { translate: "system.volt" },
      { text: ` ${pln.getVolt()} ` },
      { translate: "system.volt" },
      { text: `/s\n \n \n \n \n \n` }
    ]})
	.button("On/Off")
	.show(player).then(r => {
		if(r.canceled) return
		switch (r.selection) {
			case 0:
			  pln.switchPower("generator")
			  core(block, player, item)
			  break;
		}
	})
}

BlockUi.addBlock("plasma_core", (block, player, item) => {
	switch(item.typeId.split(":")[1]) {
		case "transmiter":
	      core(block, player, item)
	      break;
	    case "plasma_dust":
	      new Tile(block).addFuel(3)
	      player.runCommand(`clear @s ${item.typeId} 0 1`)
	      break;
    }
}, ["transmiter", "plasma_dust"])

// CrzxaExe3--