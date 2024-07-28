import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { Specialist } from "../../../system.js";
import { Game } from "../module.js";

import * as jsonData from "../../data.js";

const admin = ["admin","superadmin"],
  roleType = ["member","admin","superadmin"];

const guildUi = (player) => {
  let guild = new Game().guild().gd().find(e => e.member.some(r => r.id === player.id));
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

      let guild = new Game().guild().getGuild(name)
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

          new Game().guild().createGuild({ name, des, lock }, player)
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

      new Game().guild().updateGuild(id, { name: newName, des: newDes, request: newAp })
      player.sendMessage({ rawtext: [{ translate: "system.guild.update" },{ text: ` ${newName}§r` }]})
    })
};

const guildList = (player) => {
  let guild = new Game().guild().gd()
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
      new Game().guild().deleteGuild(id)
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
      new Game().guild().removeMemberGuild(id, player.id)
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
      let gd = new Game().guild(), guild = gd.gd().find(r => r.member.some(d => d.id === player.id));

      if(guild) return player.sendMessage({ translate: "system.guild.have" })

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
      let gd = new Game().guild(), guild = gd.gd().find(r => r.member.some(d => d.id === player.id));

      if(guild) return player.sendMessage({ translate: "system.guild.have" })

      gd.applyMemberGuild(id, player.id)
      player.sendMessage({ translate: "system.guild.requested" })
    })
};

const guildApplier = (player, { id, apply }) => {
  let ui = new ActionFormData()
    .title({ translate: "system.guild.request.join" })
    .body({ translate: "system.guild.request.list" })

  if(apply.length < 1)
    ui.button({ translate: "system.cancel" });
  apply.forEach(e => ui.button(e.name));

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

      switch(e.selection) {
        case 0:
          new Game().guild().rejectMemberGuild(id , apply[select].id);
          player.sendMessage({ rawtext: [{ text: `${apply[select].username} ` },{ translate: "system.guild.rejected" }]})
          break;
        case 1:
          new Game().guild().approveMemberGuild(id , apply[select]);
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
    .title({ rawtext: [{ translate: "system.guild.role.ch" },{ text: ` ${user.username}` }]})
    .dropdown({ translate: "system.guild.role.sel" }, role)
    
  ui.show(player)
    .then(e => {
      if(e.canceled) return;

      let [roleId] = e.formValues;

      new Game().guild().updateMemberGuild(id, player, roleType[roleId])
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

      new Game().guild().removeMemberGuild(id. player.id)
      player.sendMessage({ rawtext: [{ text: `${member[select].username} ` },{ translate: "system.guild.kicked" }]})
    })
};

const guildShop = (player) => {
  let guild = new Game().guild().gd().find(e => e.member.some(r => r.id === player.id)),
    shop = jsonData.guildShop.filter(r => r.lvl >= guild.act.lvl);

  let ui = new ActionFormData()
    .title("cz:guild_shop")
    .body({ translate: "guild.shop.body" })

  shop.forEach(e => {
    let name = e.item.replace("cz:", "").replace(/_/g, " ") || "none",
      modName = name
        .split(" ")
        .map(e => e.charAt(0).toUpperCase() + e.slice(1))
        .join(" ");
    ui.button(`${e.amount ? e.amount : "1"} ${modName}\n${e.price} Token`, e.img)
  })
  
  ui.show(player)
    .then(e => {
      if(e.canceled) return;
      
      guildBuy(player, { select: e.selection, id: guild.id, token: guild.token, shop })
    })
};

const guildBuy = (player, { select, id, token, shop }) => {
  let stack = shop[select], itm = stack.item.replace("cz:","").split("_").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ");
  let ui = new ModalFormData()
    .title({ rawtext: [{ translate: "guild.token" },{ text: ` ${token}` }]})
    .textField({ rawtext: [{ translate: "system.wantBuy" },{ text: ` 1 ${itm} ${stack.price} ` },{ translate: "guild.token" }]}, { translate: "system.input.buy" })
    .show(player)
    .then(r => {
      if(r.canceled) return;
      
      let [amount] = r.formValues;
      if(!amount) return;
      
      if(stack.price * amount > token)
        return player.sendMessage({ translate: "system.buy.outToken" });

      player.runCommand(`give @s ${stack.item} ${amount}`)
      player.sendMessage({ rawtext: [{ translate: "system.buy" },{ text: `${amount} ${itm} ` },{ translate: "system.buy2" },{ text: `${amount * stack.price} ` },{ translate: "guild.token" }]})
      new Game().guild().minToken(id, stack.price*amount)

      guildShop(player)
    })
};

export { guildUi, guildList };