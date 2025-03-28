import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { ItemStack, EnchantmentType, system } from "@minecraft/server";
import { Specialist, Game, Terra } from "../module.js";

import * as jsonData from "../../data.js";

const admin = ["admin","superadmin"],
  roleType = ["member","admin","superadmin"];

const guildUi = (player) => {
  let guild = Terra.guild.gd().find(e => e.member.some(r => r.id === player.id));
  let ui = new ActionFormData()
    .title({ translate: "cz.guild" })
    .body({ translate: "cz.guild.body" })
    .button({ translate: "system.guild.me" })
    .button({ translate: "system.guild.create" })
    .button({ translate: "system.guild.list" })

  if(guild) ui.button({ translate: "guild.shop" })

  ui.show(player)
    .then(r => {
      if(r.canceled) return;

      switch(r.selection) {
        case 0:
          if(!guild) return player.sendMessage({ translate: "system.guild.notHave" });
          guildInfo(player, guild, true);
          break;
        case 1:
          if(guild) return player.sendMessage({ translate: "system.guild.have" });
          guildCreate(player);
          break;
        case 2: guildList(player); break;
        case 3: guildShop(player); break;
      }
    });
};

const guildCreate = (player) => {
  const apply = [
    { translate: "guild.notUseApprove" },
    { translate: "guild.useApprove" }
  ];
  let ui = new ModalFormData()
    .title({ translate: "system.guild.create" })
    .textField({ translate: "guild.name" }, { translate: "guild.name.info" })
    .textField({ translate: "guild.des" }, { translate: "guild.des.body" })
    .dropdown({ translate: "guild.approve" }, apply)

    .show(player)
    .then(r => {
      if(r.canceled) return;

      const [name, des, ap] = r.formValues, sp = new Specialist(player);
      if(name.length < 1) return player.sendMessage({ translate: "system.guild.validation" })

      let guild = Terra.guild.getGuild(name)
      if(guild) return player.sendMessage({ translate: "system.guild.name.duplicate" })
      //console.warn(name, des, ap)
      let gui = new MessageFormData().title({ translate: "system.guild.createConfirm" })
        .body({ rawtext: [{ translate: "system.guild.ct" },{ text: ` ${name}§r ` },{ translate: "system.guild.ct1" }]})
        .button2({ translate: "system.yes" })
        .button1({ translate: "system.cancel" })

        .show(player)
        .then(s => {
          if(s.canceled || !s.selection || s.selection === 0) return;
          let lock = false
          if(ap == 1) lock = true

          if(sp.getMoney() < 1000) return player.sendMessage({ translate: "system.guild.create.noMoney" })

          Terra.guild.createGuild({ name, des, lock }, player)
          sp.takeMoney(1000)
          player.sendMessage({ rawtext: [{ translate: "system.guild.created" },{ text: ` ${name}§r` }]})
        })
    })
};

const guildEdit = (player, { name, id, des, request, member }) => {
  const apply = [
    { translate: "guild.notUseApprove" },
    { translate: "guild.useApprove" }
  ]
  let ui = new ModalFormData().title({ translate: "system.guild.edit" })
    .textField({ translate: "guild.name" }, { translate: "guild.name.info" }, name)
    .textField({ translate: "guild.des" }, { translate: "guild.des.body" }, des)
    .dropdown({ translate: "guild.approve" }, apply, request ? 1 : 0)

    .show(player)
    .then(r => {
      if(r.canceled) return;

      let [newName, newDes, newAp] = r.formValues, find = member.find(r => r.id === player.id);
      if(!admin.includes(find.role)) return player.sendMessage({ translate: "system.guild.notAdmin" })

      if(newName.length < 1) newName = name;
      if(newDes.length < 1) newDes = des;
      newAp === 1 ? newAp = true : newAp = false;
      //console.warn(newName, newDes, newAp)

      Terra.guild.updateGuild(id, { name: newName, des: newDes, request: newAp })
      player.sendMessage({ rawtext: [{ translate: "system.guild.update" },{ text: ` ${newName}§r` }]})
    })
};

const guildList = (player) => {
  let guild = Terra.guild.gd()
  let ui = new ActionFormData()
    .title({ translate: "system.guild.list" })
    .body({ translate: "system.guild.list.body" })
  
  if(guild.length < 1) 
    ui.button({ translate: "system.cancel" })

  guild.forEach(e => ui.button(e.name))
  ui.show(player)
    .then(e => {
      if(e.canceled || guild.length < 1) return;
      guildInfo(player, guild[e.selection])
    })
};

const guildInfo = (player, { name, id, member, token, maxMember, request, act, des, apply }, join) => {
  let ui = new ActionFormData()
    .title(name)
    .body({
      rawtext: [
        { translate: "guild.name" },
        { text: `\n> ${name}§r\n\nLvl ${act.lvl} | ${act.xp} XP\n\n${des}\n\nID ${id}\n` },
        { translate: "guild.token" },
        { text: ` ${token}\n${member.length}/${maxMember} ` },
        { translate: "guild.member" },
        { text: "\n\n" },
        { translate: "guild.approve" },
        { text: ` ${request}` }
      ]
    })

  let find = member.find(r => r.id === player.id);

  join ? 
    ui.button({ translate: "system.guild.leave" }) : 
    !request ?
      ui.button({ translate: "system.guild.join" }) :
      ui.button({ translate: "system.guild.joinRequest" });
  ui.button({ translate: "guild.member" })

  if(find !== -1 && admin.includes(find?.role))
    ui.button({ translate: "system.guild.edit" }).button({ translate: "system.guild.applier" }).button({ translate: "system.guild.delete" })

  ui.show(player)
    .then(e => {
      if(e.canceled) return;

      switch(e.selection) {
        case 0:
          if(join) return guildLeave(player, { name, id, member });
          !request ?
            guildJoin(player, { name, id }) :
            guildRequest(player, { name, id });
          break;
        case 1: guildMember(player, { member, id }); break;
        case 2: guildEdit(player, { name, id, des, request, member }); break;
        case 3: guildApplier(player, { id, apply }); break;
        case 4: guildDelete(player, { name, id }); break;
      }
    })
};

const guildDelete = (player, { name, id }) => {
  let ui = new MessageFormData()
    .title({ translate: "guild.delete" })
    .body({ rawtext: [{ translate: "system.guild.del" },{ text: ` ${name}§r ` },{ translate: "system.guild.del1" }]})
    .button2({ translate: "system.yes" })
    .button1({ translate: "system.cancel" })

    .show(player)
    .then(s => {
      if(s.canceled || !s.selection || s.selection === 0) return;

      player.sendMessage({ rawtext: [{ translate: "guild.deleted" },{ text: ` ${name}` }]})
      Terra.guild.deleteGuild(id)
    })
};

const guildLeave = (player, { id, name, member }) => {
  let ui = new MessageFormData()
    .title({ translate: "guild.leave" })
    .body({ rawtext: [{ translate: "system.guild.leaveConfirm" },{ text: ` ${name}?` }]})
    .button2({ translate: "system.yes" })
    .button1({ translate: "system.cancel" })

    .show(player)
    .then(s => {
      if(s.canceled || !s.selection || s.selection === 0) return;

      if(member.some(e => e.id === player.id && e.role === "superadmin")) return player.sendMessage({ translate: "system.guild.isOwner" })
      Terra.guild.removeMemberGuild(id, player)
      player.sendMessage({ translate: "system.guild.leaved" })
    })
};

const guildJoin = (player, { id, name }) => {
  let ui = new MessageFormData()
    .title({ translate: "guild.join" })
    .body({ rawtext: [{ translate: "system.guild.join" },{ text: ` ${name}` }]})
    .button2({ translate: "system.yes" })
    .button1({ translate: "system.cancel" })

    .show(player)
    .then(s => {
      if(s.canceled || !s.selection || s.selection === 0) return;
      let gd = Terra.guild, guild = gd.gd().find(r => r.member.some(d => d.id === player.id));

      if(guild) return player.sendMessage({ translate: "system.guild.have" })
      if(gd.getGuildById(id).member.length + 1 > gd.getGuildById(id).maxMember) return player.sendMessage({ translate: "system.guild.full" })

      gd.addMemberGuild(id, player)
      player.sendMessage({ translate: "system.guild.joined" })
    })
};

const guildRequest = (player, { id, name }) => {
  let ui = new MessageFormData()
    .title({ translate: "guild.joinRequest" })
    .body({ rawtext: [{ translate: "system.guild.request" },{ text: ` ${name}?` }]})
    .button2({ translate: "system.yes" })
    .button1({ translate: "system.cancel" })

    .show(player)
    .then(s => {
      if(s.canceled || !s.selection || s.selection === 0) return;
      let gd = Terra.guild, guild = gd.gd().find(r => r.member.some(d => d.id === player.id));

      if(guild) return player.sendMessage({ translate: "system.guild.have" })

      gd.applyMemberGuild(id, player)
      player.sendMessage({ translate: "system.guild.requested" })
    })
};

const guildApplier = (player, { id, apply }) => {
  let ui = new ActionFormData()
    .title({ translate: "system.guild.request.join" })
    .body({ translate: "system.guild.request.list" })

  if(apply.length < 1)
    ui.button({ translate: "system.cancel" });
  apply.forEach(e => ui.button(e.username));

  ui.show(player)
    .then(e => {
      if(e.canceled || apply.length < 1) return;
      guildAcc(player, { id, apply, select: e.selection })
    })
};

const guildAcc = (player, { id, apply, select }) => {
  let ui = new MessageFormData()
    .title({ rawtext: [{ translate: "system.acc" },{ text: ` ${apply[select].username}` }]})
    .body({ translate: "system.acc.info" })
    .button1({ translate: "system.guild.reject" })
    .button2({ translate: "system.guild.acc" })
    .show(player)
    .then(e => {
      if(e.canceled) return;
      console.warn(id)

      switch(e.selection) {
        case 0:
          Terra.guild.rejectMemberGuild(id , apply[select].id);
          player.sendMessage({ rawtext: [{ text: `${apply[select].username} ` },{ translate: "system.guild.rejected" }]})
          break;
        case 1:
          if(Terra.guild.getGuildById(id).member.length + 1 > Terra.guild.getGuildById(id).maxMember)
            return player.sendMessage({ translate: "system.guild.full" });

          Terra.guild.approveMemberGuild(id , apply[select]);
          player.sendMessage({ rawtext: [{ text: `${apply[select].username} ` },{ translate: "system.guild.accepted" }]})
          break;
      };
    })
};

const guildMember = (player, { member, id }) => {
  let ui = new ActionFormData()
    .title({ translate: "guild.member" })
    .body({ translate: "guild.member.body" })

  if(member.length < 1) return player.sendMessage({ translate: "system.guild.noMember" })
  member.forEach(e => ui.button(e.username))
  
  ui.show(player)
    .then(e => {
      if(e.canceled) return;

      guildUser(player, { member, id, select: e.selection })
    })
};

const guildUser = (player, { member, id, select }) => {
  let ui = new ActionFormData()
    .title(member[select].username)
    .body({
      rawtext: [
        { translate: "guild.member.options" }
      ]
    })
    .button({ translate: "system.back" })

  if(admin.includes(member.find(e => e.id === player.id)?.role) && member[select].id !== player.id)
    ui
      .button({ translate: "system.guild.role" })
      .button({ translate: "system.guild.kick" });
    
  ui.show(player)
    .then(e => {
      if(e.canceled) return;
      
      switch(e.selection) {
        case 0: guildMember(player, { member, id }); break;
        case 1: guildRole(player, { member, id, select }); break;
        case 2: guildKick(player, { member, id, select }); break;
      };
    })
};

const guildRole = (player, { member, id, select }) => {
  let user = member[select].id,
    role = [
      { translate: "guild.role.member" },
      { translate: "guild.role.admin" },
      { translate: "guild.role.superadmin" }
    ],
    self = member.find(e => e.id === player.id);
  if(self.role !== "superadmin")
    role.pop();

  let ui = new ModalFormData()
    .title({ rawtext: [{ translate: "system.guild.role.ch" },{ text: ` ${member[select].username}` }]})
    .dropdown({ translate: "system.guild.role.sel" }, role, roleType.findIndex(r => r === member[select].role))
    
  ui.show(player)
    .then(e => {
      if(e.canceled) return;

      let [roleId] = e.formValues;

      Terra.guild.updateMemberGuild(id, member[select], roleType[roleId])
      player.sendMessage({ rawtext: [{ text: `${member[select].username} ` },{ translate: "system.guild.role.updated" }]})
    })
};

const guildKick = (player, { member, id, select }) => {
  let ui = new MessageFormData()
    .title({ translate: "system.guild.kick" })
    .body({
      rawtext: [
        { translate: "system.guild.kickConfirm" },
        { text: ` ${member[select].username}?` }
      ]
    })
    .button2({ translate: "system.yes" })
    .button1({ translate: "system.cancel" })
    .show(player)
    .then(e => {
      if(e.canceled || !e.selection || e.selection === 0) return;

      player.sendMessage({ rawtext: [{ text: `${member[select].username} ` },{ translate: "system.guild.kicked" }]})
      Terra.guild.removeMemberGuild(id, member[select])
    })
};

const guildShop = (player) => {
  let guild = Terra.guild.gd().find(e => e.member.some(r => r.id === player.id)),
    shop = jsonData.guildShop.filter(r => guild.act.lvl >= r.lvl),
    types = shop.reduce((all, c) => {
      if(!all.includes(c.type)) all.push(c.type)
      return all
    },[]);
  // console.warn(types)

  let ui = new ActionFormData()
    .title("cz:guild_shop")
    .body({ translate: "guild.shop.body" })

  types.forEach(e => ui.button({ translate: "cz."+e }))
  
  ui.show(player)
    .then(e => {
      if(e.canceled) return;
      let type = types[e.selection];
      
      guildSubShop(player, { id: guild.id, token: guild.token, shop: shop.filter(r => r.type == type), type })
    })
};

const guildSubShop = (player, { type, shop, token, id }) => {
  //console.warn(JSON.stringify(shop))
  let ui = new ActionFormData()
    .title({ translate: "cz."+type })
    .body({ translate: "guild.shop.body" })
  
  shop.forEach(e => {
    let name = e.item.replace("cz:", "").replace("minecraft:","").replace(/_/g, " ") || "none";
    if(e.enchant) name = "Book " + e.enchant.split("*")[0].split("_").map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" ") + " Lvl" + e.enchant.split("*")[1];
    let modName = name
        .split(" ")
        .map(e => e.charAt(0).toUpperCase() + e.slice(1))
        .join(" ");
    ui.button(`${e.amount ? e.amount > 1 ? e.amount+" " : "" : ""}${modName}\n${e.price} Token`, e.img)
  })
  
  ui.show(player)
    .then(e => {
      if(e.canceled) return
      
      guildBuy(player, { select: e.selection, id, token, shop })
    })
};

const guildBuy = (player, { select, id, token, shop }) => {
  let stack = shop[select], itm = stack.item.replace("cz:","").replace("minecraft:", "").split("_").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ");
  let ui = new ModalFormData()
    .title({ rawtext: [{ translate: "guild.token" },{ text: ` ${token}` }]})
    .textField({ rawtext: [{ translate: "system.wantBuy" },{ text: ` ${stack.amount} ${itm}${stack.enchant ? ` (${stack.enchant.split("*")[0]} lvl ${stack.enchant.split("*")[1]})` : ""} ${stack.price} ` },{ translate: "guild.token" }]}, { translate: "system.input.buy" })
    .show(player)
    .then(r => {
      if(r.canceled) return;
      
      let [amount] = r.formValues;
      if(!amount) return;
      
      if(stack.price * amount > token)
        return player.sendMessage({ translate: "system.buy.outToken" });
      
      if(stack.enchant)
        return guildBuyEnchant(player, { token, id, amount, item: stack.item, enchant: stack.enchant, price: stack.price })

      player.runCommand(`give @s ${stack.item} ${amount * stack.amount}`)
      player.sendMessage({ rawtext: [{ translate: "system.buy" },{ text: `${amount} ${itm} ` },{ translate: "system.buy2" },{ text: `${amount * stack.price} ` },{ translate: "guild.token" }]})
      Terra.guild.minToken(id, stack.price*amount)

      guildShop(player)
    })
};

const guildBuyEnchant = (player, { amount, id, token, item, price, enchant }) => {
  if(amount * price > token)
    return player.sendMessage({ translate: "system.buy.outToken" });

  let itemStack = new ItemStack(item)
  itemStack.getComponent("enchantable").addEnchantment({ type: new EnchantmentType(enchant.split("*")[0]), level: Number(enchant.split("*")[1]) })

  for(let i = 1;i<=amount;i++) {
    player.getComponent("inventory").container.addItem(itemStack)
  }

  player.sendMessage({ rawtext: [{ translate: "system.buy" },{ text: `${amount} ${item} ` },{ translate: "system.buy2" },{ text: `${amount * price} ` },{ translate: "guild.token" }]})
  Terra.guild.minToken(id, price*amount)
};

export { guildUi, guildList };