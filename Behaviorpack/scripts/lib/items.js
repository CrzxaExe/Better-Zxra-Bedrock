import { world, system, ItemStack } from "@minecraft/server";
import { Specialist } from "../system.js";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { Game, Quest, guildUi, adminPanel, questPanel, shop, SpecialItem } from "./ZxraLib/module.js";
import * as data from "./data.js"

import "./item/vial.js";
import "./item/place_item.js";
import "./item/mc_item.js";

export {
	userPanel
}

let shopPanel = (plyr, lib) => {
	let data = new Specialist(plyr), day = lib.options.shopMultiplier
	let hpk = new ActionFormData()
	  .title("cz:shop")
	  .body({ translate: "cz.shop.body" })
	  .button({ translate: "cz.blocks" }, "textures/blocks/bookshelf")
	  .button({ translate: "cz.crops" }, "textures/items/wheat")
	  .button({ translate: "cz.foods" }, "textures/items/mutton_cooked")
	  .button({ translate: "cz.materials" }, "textures/items/coal")
	  .button({ translate: "cz.minerals" }, "textures/items/diamond_ingot")
	  .button({ translate: "cz.redstone" }, "textures/items/redstone_dust")
	  .button({ translate: "cz.special" }, "textures/items/diamond_ascend")

	// Showing Shop panel and getting the res
	hpk.show(plyr).then(r => {
		if(r.canceled) return
		let menu = "blocks",
          bol = new ActionFormData()
            .title("cz:shop")
            .body({ translate: "cz.shop.body" })

		// Get menu
		switch(r.selection) {
			case 0: menu = "blocks"; break;
			case 1: menu = "crops"; break;
			case 2: menu = "foods"; break;
			case 3: menu = "materials"; break;
			case 4: menu = "minerals"; break;
			case 5: menu = "redstone"; break;
			case 6: menu = "special"; break;
		}

		// Button item factory
		shop[menu].forEach(i => {
	      let name = i.item.replace("cz:", "").replace(/_/gi, " "), img = i.img || ""
	      if(i.voxn) return bol.button(`${name.charAt(0).toUpperCase() + name.slice(1)}\n${i.price} Voxn`, img)
          bol.button(`${name.charAt(0).toUpperCase() + name.slice(1)}\n$${(i.price * day).toFixed(2)}`, img)
          
        })

        // Showing the item factory and get res
		bol.show(plyr).then(r => {
		  if(r.canceled) return
		  shop[menu][r.selection].voxn ?
            buyPanelVoxn(plyr, menu, r.selection) :
            buyPanel(plyr, menu, r.selection, "cz:shop", day);
         })
    })
}, buyPanel = (player, type, id, bal, day) => {
	let data = new Specialist(player),
      { item, price } = shop[type][id],
      itm = item.replace("cz:","").charAt().toUpperCase() + item.replace("cz:", "").slice(1).replace(/_/gi, " "),
	  khn = new ModalFormData().title(`$${data.getMoney()}`)
	    .textField(itm + " $" + (price * day).toFixed(2), { translate: "system.buy.amount" })
	    .show(player).then(r => {
	      if(r.canceled || r.formValues[0] == undefined) return
      
	      let value = r.formValues[0] || 0
	      if(value < 1) return
	      if(data.getMoney() < price * value * day) return player.sendMessage({ translate: "system.buy.outMoney" })
	      player.runCommand(`give @s ${item} ${value}`)
	      player.sendMessage({ rawtext: [{ translate: "system.buy" },{ text: `${value} ${itm} ` },{ translate: "system.buy2" },{ text: `$${(value * price * day).toFixed(2)}` }]})
	      data.takeMoney(price * value * day)
	    })
}, buyPanelVoxn = (player, type, id) => {
	let data = new Specialist(player),
	  { item, price } = shop[type][id],
      itm = item.replace("cz:","").charAt(0).toUpperCase() + item.replace("cz:", "").slice(1).replace(/_/gi, " "),
	  khn = new ModalFormData()
        .title(`${data.getVoxn()} Voxn`)
	    .textField(itm + " " + price +" Voxn", { translate: "system.buy.amount" })
	    .submitButton({ translate: "system.buy.button" })
	    .show(player).then(r => {
	   	if(r.canceled || r.formValues[0] == undefined) return
  
	   	let value = r.formValues[0] || 0
	   	if(value < 1) return
   		if(data.getVoxn() < price * value) return player.sendMessage({ translate: "system.buy.outVoxn" })
	   	player.runCommand(`give @s ${item} ${value}`)
	   	player.sendMessage({ rawtext: [{ translate: "system.buy" },{ text: `${value} ${itm} ` },{ translate: "system.buy2" },{ text: `${(value * price)} Voxn` }]})
	   	data.minVoxn(price * value)
    	})
}, userPanel = (player) => {
	let data = new Specialist(player),
      jlm = new ActionFormData()
	    .title(player.name)
	    .body({ translate: "cz.user.body" })
	    .button({ translate: "user.reset" })
	    .button({ translate: "system.transfer" })
	    .button({ translate: "system.reload" })

    if(player.hasTag("Admin")) {
      jlm.button({ translate: "user.reset.bal" })
      jlm.button({ translate: "user.reset.stamina" })
      jlm.button({ translate: "user.reset.temp" })
      jlm.button({ translate: "user.reset.thirst" })
      jlm.button({ translate: "user.reset.rep" })
      jlm.button({ translate: "user.reset.dirty" })
      jlm.button({ rawtext: [{ translate: "system.add" },{ text: " $5000" }]})
      jlm.button({ rawtext: [{ translate: "system.add" },{ text: " 20 Voxn" }]})
      jlm.button({ translate: "user.random.quest" })
    }

	jlm.show(player).then(r => {
		if(r.canceled) return
		switch(r.selection) {
			case 0: data.clearData(); player.sendMessage({ translate: "system.reset.user" }); break;
			case 1: transferPanel(player); break;
			case 2: world.getDimension(player.dimension.id).runCommand("reload"); break;
			case 3: data.resetMoney(); player.sendMessage({ translate: "system.reset.bal" }); break;
			case 4: data.resetAllStamina(); player.sendMessage({ translate: "system.reset.stamina" }); break;
			case 5: data.temp().reset(); player.sendMessage({ translate: "system.reset.temp" }); break;
			case 6: data.resetAllThirst(); player.sendMessage({ translate: "system.reset.thirst" }); break;
			case 7: data.resetRep(); player.sendMessage({ translate: "system.reset.rep" }); break;
			case 8: data.resetDirty(); player.sendMessage({ translate: "system.reset.dirty" }); break;
			case 9: data.addMoney(5000); player.sendMessage({ rawtext: [{ translate: "system.get" },{ text: " $5000" }]}); break;
			case 10: data.addVoxn(20); player.sendMessage({ rawtext: [{ translate: "system.get" },{ text: " 20 Voxn" }]}); break;
			case 11: new Quest(player).randomQuest(); break;
		}
    })
}, transferPanel = (player) => {
	let data = new Specialist(player), players = world.getPlayers().map(r => { return r.name })
	players.unshift("None")
	players.splice(players.findIndex(f => f == player.name), 1)

	let pnl = new ModalFormData()
	.title({ rawtext: [{ translate: "system.transfer.title" },{ text: `$${data.getMoney()}`}]})
	.dropdown({ translate: "system.transfer.user" }, players)
	.textField({ translate: "system.transfer.ls" }, { translate: "system.transfer.lsB" })
	.show(player).then(r => {
		if(r.canceled) return

		let [user, amount] = r.formValues, target = players[user]
		if(!target || target == "None") return player.sendMessage({ translate: "system.invalidPlayer.name" })
		data.transferMoney(new Game().getPlayerName(target), Number(amount))
	})
}

SpecialItem.addItem("stats", (player, item, lib) => {
	let data = new Specialist(player), game = new Game(), guild = game.guild().gd().find(e => e.member.some(r => r.id === player.id));
	let specialist = data.getData();

    let stats = new ActionFormData()
      .title("cz:user")
      .body(`${player.name}
Lvl ${specialist.specialist.lvl} - ${specialist.specialist.xp.toFixed(1)}Xp\n
Guild ${guild ? "["+guild.name+"§r]\nLvl "+guild.act.lvl+" | "+guild.act.xp+" XP" : "[None]"}\n
Bal $${specialist.money.toFixed(2)}
Voxn ${specialist.voxn}
Rep ${specialist.reputation}
Stamina ${(specialist.stamina.value.toFixed(1))}/${specialist.stamina.max + specialist.stamina.add}
Thirst ${Number(specialist.thirst.value).toFixed(2)}/${specialist.thirst.max}%
Dirty ${specialist.dirty}%

Active Player ${game.getOnlineCount()}
Day ${world.getDay()}
      `.trim())
      .button({ translate: "cz.shop" }, "textures/ui/store_cz_icon")
      .button({ translate: "cz.leaderboard" }, "textures/items/zxra_book")
      .button({ translate: "cz.quest" }, "textures/items/book_writable")
      .button({ translate: "cz.guild" }, "textures/items/iron_sword")
      .button({ translate: "cz.user" }, "textures/ui/icon_steve")

    if(player.hasTag("Admin"))
      stats.button({ translate: "cz.adminPanel" }, "textures/items/stats")

    stats.show(player).then(r => {
    	if(r.canceled) return
        switch(r.selection) {
        	case 0: shopPanel(player, lib); break;
        	case 1: game.leaderboard().getLeaderboard(player); break;
            case 2: questPanel(player); break;
            case 3: guildUi(player); break;
            case 4: userPanel(player); break;
            case 5: adminPanel(player, lib); break;
        }
    })
})

SpecialItem.addItem("quest_scroll", (player, item) => {
	new Quest(player).randomQuest();
})

SpecialItem.addItem("stamina_up_book", (player) => {
    let data = new Specialist(player);
    data.addStamina("max", 4)
    data.runCommand([`clear @s cz:stamina_up_book 0 1`])
    player.onScreenDisplay.setActionBar(`Max Stamina++`)
})

SpecialItem.addItem("compass", (player, item) => {
	let { y } = player.getRotation(), compass = "compass.north"

	if(y > -45 && y < 49) compass = "compass.south"
	if(y > -165 && y < -39) compass = "compass.east"
	if(y > 45 && y < 149) compass = "compass.west"
	if(y > 135 && y < 230) compass = "compass.north"

	// Displaying the compass
	player.onScreenDisplay.setActionBar({ translate: `${compass}` })
})

SpecialItem.useItem("clean_water", (player, item) => {
	let data = new Specialist(player)
	data.addThirst("value", 35)
	data.addStamina("value", 20)
})

// CrzxaExe3--