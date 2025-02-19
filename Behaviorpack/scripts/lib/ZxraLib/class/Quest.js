import { world, ItemStack, system } from "@minecraft/server";
import { Game, Specialist } from "../module.js";
import * as data from "../../data.js";

export class Quest {
	/* CrzxaExe3--
	*
	* Class quest
	* This data for quest on every Player
	*/
	constructor(plyr) {
		this.quest = data.questIndex;

		if(!plyr) throw new Error("Invalid Player");
		this.player = plyr;
		this.data = new Specialist(plyr);
		this.on = {
			quest: false,
			id: 0,
			task: []
		}
	}

    // Data Method
    questData() {
    	let data = this.on;
        if(this.player.getDynamicProperty("quest") !== undefined) data = JSON.parse(this.player.getDynamicProperty("quest"));
        return data;
    }
    setQuestData(obj) {
    	this.player.setDynamicProperty("quest", JSON.stringify(obj));
	}
	clearQuestData() {
		this.player.setDynamicProperty("quest", JSON.stringify(this.on));
	}

    // Main Controller to update the quest data
	controller(ops) {
		let quest = this.getQuest()
		if(this.questData().quest == false) return

		quest.task.forEach(i => {
		  if(i.act !== ops.act) return
		  switch(ops.act) {
			  case "kill":
			    if(i.target == ops.target.typeId.split(":")[1]) this.updateQuest({ amount: 1, target: ops.target.typeId.split(":")[1] })
			    break;
			  case "destroy":
			    if(i.target == ops.target.type.id.split(":")[1]) this.updateQuest({ amount: 1, target: ops.target.type.id.split(":")[1] })
			    break;
		  }
		})
	}
	updateQuest(index) {
		let data = this.questData(), quest = this.getQuest()
		if(data.quest == false) return

        let task = quest.task.findIndex(s => s.target == index.target), targetName = quest.task[task].target.replace("cz:", "").replace(/_/gi, " ")
		if(data.task[task] + index.amount <= quest.task[task].amount) {
          data.task[task] = data.task[task] + index.amount
		  this.setQuestData(data)
		}
		this.player.onScreenDisplay.setActionBar(`${targetName.charAt(0).toUpperCase() + targetName.slice(1)} ${data.task[task]}/${quest.task[task].amount}`)

		let clear = data.task.every((x, i) => x >= quest.task[i].amount)
		if(!clear) return
		this.rewardQuest(quest)
	}

    // Quest Method
	getQuest() {
		if(this.questData().quest == false) return { title: "quest.nope", des: "quest.nope.des" }
		return this.quest[this.questData().id]
	}
	searchQuest(i) {
		return this.quest[i]
	}
	setQuest(i) {
		this.clearQuestData()
		let data = { quest: true, id: i, task:[] }, quest = this.searchQuest(i)

		quest.task.forEach(l => data.task.push(0))
		this.player.sendMessage({ rawtext: [{ translate: "quest.get" },{ translate: `${quest.title}` }]})
		this.setQuestData(data)
	}
	randomQuest() {
		let rep= this.data.getRep(), available = this.quest.filter(i => i.rep <= rep ), random = Math.floor(Math.random() * (available.length))
		let gets = this.quest.findIndex(l => available[random].title == l.title)
		this.setQuest(gets)
	}
	actRaw() {
		let data = this.questData(), quest = this.getQuest(), text = "";
		quest.task.forEach((i, id) => {
			let name = i.target.replace("cz:", "").replace(/_/gi, " ")
			text += `\n${i.act.charAt(0).toUpperCase() + i.act.slice(1)} ${(name.charAt(0).toUpperCase() + name.slice(1)).replace(/_/gi, " ")} ${data.task[id]}/${i.amount}`
		})
		return text
	}
	rewardRaw() {
		let data = this.questData(), text = ""
		this.quest[data.id].reward.forEach(i => {
			let index = i.type.split("/")
			if(index[0] !== "item") {
				index[0] === "cash" ?
                  text += `\n> ${i.type.charAt(0).toUpperCase() + i.type.slice(1)} $${i.amount} ${new Game().guild().gd().find(e => e.member.some(r => r.id === this.player.id)) ? "+$"+Number(i.amount/5).toFixed(1) : ""}` :
                  index[0] === "token" ?
                    new Game().guild().gd().find(e => e.member.some(r => r.id === this.player.id)) ?
                      text += `\n> Token ${i.amount}` : text += "" :
                      text += `\n> ${i.type.charAt(0).toUpperCase() + i.type.slice(1)} ${i.amount}`;
			} else {
				let item = index[1].replace("cz:", "").replace(/_/gi, " ")
                text += `\n> ${i.amount} ${item.charAt(0).toUpperCase() + item.slice(1)}`
            }
		})
		return text
	}
	rewardQuest(quest) {
		this.player.sendMessage({ rawtext: [{ translate: "system.clearQuest" }, { translate: quest.title }] })
		quest.reward.forEach(i => {
			let ins = i.type.split("/")
			switch(ins[0]) {
				case "cash":
				  let gets = i.amount;
				  if(new Game().guild().gd().find(e => e.member.some(r => r.id === this.player.id))) gets += i.amount/5;
                  this.data.addMoney(gets);
                  break;
				case "item":
				  let newItem = new ItemStack(ins[1])
				  newItem.amount = i.amount
                  this.player.getComponent("inventory").container.addItem(newItem)
                  break;
                case "token":
                  let guild = new Game().guild().gd().find(e => e.member.some(r => r.id === this.player.id));
                  if(!guild) return;
                  new Game().guild().addToken(guild.id, i.amount)
                  new Game().guild().addXp(guild.id, i.amount*2)
                  break;
                case "voxn": this.data.addVoxn(i.amount); break;
                case "rep": this.data.addRep(i.amount); break;
				default: return
			}
        })
        this.player.sendMessage({ translate: "quest.clear" })
        this.clearQuestData()
	}
}

// CrzxaExe3--