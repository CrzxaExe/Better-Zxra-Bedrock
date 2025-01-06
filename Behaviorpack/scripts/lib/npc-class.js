import { system, world, Player, ItemStack } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { Specialist } from "../system.js";
import { shuffleObjects, Entity } from "./ZxraLib/module.js";
import * as option from "./data.js";

export {
	Npc
}
// Yuri
class YuriNpc {
   constructor(entity, npc) {
		if(!entity || !npc) throw new Error("No Entity or Npc")
		this.ent = new Entity(entity)
        this.entity = entity
        this.npc = npc
	}

	getData() {
		return this.npc.getData()
	}
	setData(obj) {
		this.npc.setData(obj)
	}

	mood() {
		return this.getData().mood
	}
	addMood(amount = 0) {
		let data = this.getData()
		data.mood + Number(amount) >= option.npcFile.yuri.stat.maxMood ? data.mood = option.npcFile.yuri.stat.maxMood : data.mood += Number(amount);
		this.setData(data)
	}
	minMood(amount) {
		this.addMood(-Number(amount))
	}
	
	openUi(player, lib) {
		let npcData = option.npcFile.yuri
        let greet = npcData.stat.greet[Math.floor(Math.random() * npcData.stat.greet.length)], data = this.getData()
		let ui = new ActionFormData().title(`cz:yuri_menu${data.emotion}`).body({ translate: greet })
		.button({ translate: "yuri.action" })
        .button({ translate: "yuri.talking" })
        .button({ translate: "yuri.gift" })
        .show(player)
        .then(r => {
          if(r.canceled) return
          switch(r.selection) {
		    case 0: this.actionUi(player); break;
		    case 1: this.talkUi(player); break;
		    case 2: this.giveItem(player); break;
		  }
        })
	}

	talkUi(player, lib) {
		let data = this.getData(), rawData = option.npcFile.yuri, talk = shuffleObjects(rawData.stat.talk, rawData.stat.talkMaxOptions)
		let ui = new ActionFormData().title(`cz:yuri_menu${data.emotion}`).body({ translate: "yuri.talkFor" })
		talk.forEach(r => ui.button({ translate: r.text }))
		ui.show(player).then(r => {
			if(r.canceled) return
			player.sendMessage({ rawtext: [{ text: "Yuri > " },{ translate: talk[r.selection].ans }]})
		})
	}
	
	giveItem(player, lib) {
		try {
		  let item = player.getComponent("inventory").container.getSlot(player.selectedSlotIndex), npcData = option.npcFile.yuri, data = this.getData()

		  let react = npcData.stat.itemDis.find(e => e.item === item.typeId.split(":")[1]) || npcData.stat.itemFav.find(e => e.item === item.typeId.split(":")[1]) || { item: item.typeId.split(":")[1], mood: 0.1, text: "yuri.thanks" }

	      this.addMood(react.mood)
	      player.onScreenDisplay.setActionBar({ translate: react.text })
	
	      player.runCommand(`clear ${player.name} ${item.typeId} 0 1`)
		} catch(err) {
			player.onScreenDisplay.setActionBar({ translate: "yuri.gift.noItem" })
        }
	}

    actionUi(player, lib) {
        let data = this.getData()
		let ui = new ActionFormData().title(`cz:yuri_menu${data.emotion}`).body({ translate: "yuri.action.body" })
        .button({ translate: "yuri.move" })
        .button({ translate: "yuri.scale" })
        .button({ translate: "yuri.eyeFix" })
        .show(player)
        .then(r => {
	        let sub = new ActionFormData().title(`cz:yuri_menu${data.emotion}`).body({ translate: "yuri.ask" })
	        if(r.canceled) return
	        switch(r.selection) {
		        case 0:
		          sub.button({ translate: "yuri.move.follow" })
		          sub.button({ translate: "yuri.move.stand" })
		          sub.button({ translate: "yuri.move.wander" })
		          sub.show(player).then(s => {
			        if(s.canceled) return
	                switch(s.selection) {
				        case 0: this.entity.triggerEvent("cz:follow"); break;
				        case 1: this.entity.triggerEvent("cz:stay"); break;
				        case 2: this.entity.triggerEvent("cz:free_walk"); break;
		            }
		          })
		          break;
	            case 1:
		          sub.button({ translate: "yuri.scale.l" })
		          sub.button({ translate: "yuri.scale.n" })
		          sub.button({ translate: "yuri.scale.p" })
		          sub.show(player).then(s => {
			        if(s.canceled) return
	                switch(s.selection) {
				        case 0: this.entity.triggerEvent("cz:size_loli"); break;
				        case 1: this.entity.triggerEvent("cz:size_n"); break;
				        case 2: this.entity.triggerEvent("cz:size_p"); break;
		            }
		          })
		          break;
		        case 2:
		          this.entity.triggerEvent("cz:yuri_blink")
		          break;
	        }
        })
	}
}

// Classes
class Npc {
	constructor(entity) {
		if(!entity) throw new Error("No Entity")
		this.npc = {
           ent: new Entity(entity),
           entity
        }
		this.raw = option.npcFile
	}

	getData() {
		let data = this.npc.ent.getDataEnt("npc")
		if(!data.npc) {
		  let rawData = {...this.raw[this.npc.entity.typeId.split(":")[1]]}
		  rawData.stat = undefined
          data = {...data, ...rawData}
        }
		return data
	}
	setData(obj) {
		this.npc.ent.setDataEnt(obj, "npc")
	}

	npcUi(player) {
		switch(this.npc.entity.typeId.split(":")[1]) {
		  case "yuri":
			 new YuriNpc(this.npc.entity, this).openUi(player)
	         break;
	    }
	}
	
}