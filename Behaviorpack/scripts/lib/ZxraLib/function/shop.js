import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { system } from "@minecraft/server";
import { Specialist, Entity, npcShop, npcShopDialog, runPlayerDialog, Game } from "../module.js";

const askDialog = (player, type) => {
  runPlayerDialog(player, npcShopDialog[type][Math.floor(Math.random() * npcShopDialog[type].length)], 0);
}

const buyItemList = (player, type, rn) => {
  const shop = npcShop[type].buy;
  const ui = new ActionFormData()
    .title({ translate: `npc.shop.${type}.buy` })
    .body({ translate: `npc.shop.${type}.buy.des` })

  shop.forEach(({ item, amount, text, price, img }) => ui.button({ rawtext: [{ text: `${amount} × ` },{ translate: text },{ text: ` $${price}` }]}, img))

  ui.show(player)
    .then(e => {
      if(e.canceled) {
        system.clearRun(rn);
        return;
      }

      buyItem(player, shop[e.selection], type, rn)
    })
}

const buyItem = (player, buy, type, rn) => {
  const sp = new Specialist(player);
  
  const ui = new ModalFormData()
    .title({ translate: "system.confim.buy" })
    .textField({ rawtext: [{ text: `${buy.amount} x ` },{ translate: buy.text },{ text: ` $${buy.price}` }]}, { translate: "system.buy.amoumt" })
    .submitButton({ translate: "system.buy.button" })
    .show(player)
    .then(e => {
      if(e.canceled) {
        system.clearRun(rn);
        return;
      }
      
      let [amount = 0] = e.formValues;
      amount = parseInt(amount) || 0;
      
      if(amount <= 0) {
        player.sendMessage({ translate: `npc.shop.${type}.noBuy` });
        system.clearRun(rn);
        return;
      }

      if(sp.getMoney() < amount * buy.price) {
        player.sendMessage({ translate: `npc.shop.${type}.notEnoughMoney` });
        system.clearRun(rn);
        return;
      }
      
      sp.runCommand(`give @s ${buy.item} ${amount}`);
      sp.takeMoney(Number(amount * buy.price).toFixed(1));
      player.sendMessage({ rawtext: [{ translate: "system.buy" },{ text: `${amount} ` },{ translate: buy.item },{ translate: "system.buy2" },{ text: `$${Number(amount * buy.price).toFixed(2)}` }]})
    })
}

const sellItem = (player, type, rn) => {
  const shop = npcShop[type].sell,
    guild = new Game().guild().getTeammate(player.id),
    sp = new Specialist(player);
  const container = sp.getItems()?.filter(e => shop.map(r => r.name).includes(e.name))
    .sort((a,b) => a.name.localeCompare(b.name));

  if(container.length == 0) {
    player.sendMessage({ translate: `npc.${type}.noItem` })
    system.clearRun(rn)
    return;
  }

  const ui = new ModalFormData()
    .title({ translate: `npc.shop.${type}.sell` })
    .dropdown({ translate: "system.itemName" }, container.map(e => {
      const shopItem = shop.find(r => r.name == e.name);
      return { rawtext: [{ translate: shopItem.text },{ text: ` x ${e.amount} §e$${shopItem.price}§r(§e$${Number(e.amount * shopItem.price).toFixed(1)}§r)` }]}
    }))
    .textField({ translate: "system.itemAmount" }, { translate: "type.number" })
    .submitButton({ translate: "cz.sellItem" })
    .show(player)
    .then(e => {
      if(e.canceled) {
        system.clearRun(rn);
        return;
      }

      let [itemIndex, amount = 0] = e.formValues;
      amount = parseInt(amount);

      if(amount <= 0) {
        player.sendMessage({ translate: "type.only.number" });
        sellItem(player, type, rn);
        return;
      }
      if(amount > container[itemIndex].amount) amount = container[itemIndex].amount;

      sp.runCommand([`clear @s ${container[itemIndex].name} 0 ${amount}`])
      sp.addMoney(Number(amount * (shop.find(e => e.name == container[itemIndex].name).price + (!guild ? 0 : 0.2))).toFixed(1));
      player.sendMessage({ rawtext: [{ translate: "system.sell.1" },{ text: ` ${amount} ${container[itemIndex].name} ` },{ translate: "system.sell.2" },{ text: " " + Number(amount * (shop.find(e => e.name == container[itemIndex].name).price + (!guild ? 0 : 0.2))).toFixed(1)}] })
      system.clearRun(rn);
    })
}

const farmerShop = (player, initiator) => {
  const lockInitiator = system.runInterval(() => {
    new Entity(initiator.entity).bind(0.5)
  }, 10);

  const ui = new ActionFormData()
    .title("cz:npc_shop_farmer")
    .body({ translate: "npc.shop.farmer.body" })
    .button({ translate: "npc.ask" })
    .button({ translate: "npc.buy" })
    .button({ translate: "npc.sell" })
    .button({ translate: "cz.back" })
    
    .show(player)
    .then(e => {
      if(e.canceled) {
        system.clearRun(lockInitiator);
        return;
      }
      
      switch(e.selection) {
        case 0:
          askDialog(player, "farmer");
          system.clearRun(lockInitiator);
          break;
        case 1:
          buyItemList(player, "farmer", lockInitiator);
          break;
        case 2:
          sellItem(player, "farmer", lockInitiator);
          break;
        default: system.clearRun(lockInitiator);
      }
    })
}

export { farmerShop };