import { uniqueId, mergeObject, leveling, Specialist, Terra } from "../module.js";
import * as jsonData from "../../data.js";

class Guild {
  constructor(cls) {
    if(!cls) throw new Error("Guild must have Game Class");
    this.guild = cls;
    this.lib = jsonData.guild
  };

  gd() {
    //console.warn(JSON.stringify(this.getData("guilds")))
    return this.guild.getData("guilds") !== undefined ? this.guild.getData("guilds") : [];
  };
  setGd(obj) {
    //console.warn(JSON.stringify(obj))
    this.guild.setData("guilds", obj);
  };
  resetGd() {
    this.setGd([])
  };

  // Guild Method
  createGuild({ name, des, lock }, player) {
    let data = this.gd(), newGuild = {
      name,
      id: uniqueId(),
      member: [{ id: player.id, role: "superadmin", username: player.name }],
      act: { lvl: 0, xp: 0 },
      token: 0,
      maxMember: 5,
      des,
      request: lock,
      apply: []
    };

    data.push(newGuild)
    this.setGd(data)
  };

  deleteGuild(id) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    data.splice(find, 1)
    this.setGd(data)
  };

  getGuild(name) {
    return this.gd().find(e => e.name === name)
  };

  getGuildById(id) {
    return this.gd().find(e => e.id === id)
  };

  updateGuild(id, obj) {
    let data = this.gd(), find = data.find(e => e.id === id);

    if(!find) return;

    let merge = mergeObject(find, obj)
    data.splice(data.findIndex(e => e.id === id), 1, merge);
    this.setGd(data)
  };

  // Guild Member Method
  addMemberGuild(id, player) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    let member = data[find].member.map(e => e.id).includes(player.id)
    if(member) return;
    if(data[find].member.length + 1 > data[find].maxMember) return //player.sendMessage({ translate: "system.guild.full" });

    data[find].member.push({
      id: player.id,
      username: player.name || player.username,
      role: "member"
    })
    this.setGd(data)
  };
  
  updateMemberGuild(id, player, role) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    let member = data[find].member.findIndex(e => e.id === player.id)

    if(member === -1) return;
    data[find].member[member].role = role
    console.warn(JSON.stringify(data[find]))
    this.setGd(data)
  };
  
  removeMemberGuild(id, plyr) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    let member = data[find].member.findIndex(e => e.id === plyr.id)

    if(member === -1) return;
    data[find].member.splice(member, 1)
    this.setGd(data)
  };

  // Apply Member Guild
  approveMemberGuild(id, player) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    let apply = data[find].apply.findIndex(e => e.id === player.id)

    if(data[find].member.length + 1 > data[find].maxMember) return; //player.sendMessage({ translate: "system.guild.full" });

    if(apply === -1) return;

    this.rejectMemberGuild(id, player)
    this.addMemberGuild(id, player)
  };

  applyMemberGuild(id, player) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    data[find].apply.push({
      id: player.id,
      username: player.name
    });
    this.setGd(data);
  };
  
  rejectMemberGuild(id, plyr) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    let appl = data[find].apply.findIndex(e => e.id === plyr.id);
    
    if(appl === -1) return;
    data[find].apply.splice(appl, 1)
    this.setGd(data)
  };

  // Token Method
  getToken(id) {
    return this.getGuildById(id)?.token || 0;
  };

  addToken(id, amount) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    data[find].token += Number(amount);
    this.setGd(data)
  };

  minToken(id, amount) {
    this.addToken(id, -Number(amount))
  };

  setToken(id, value) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    data[find].token = Number(value);
    this.setGd(data)
  };

  resetToken(id) {
    this.setToken(id, 0)
  };

  // Xp Method
  getXp(id) {
    return this.gd().find(e => e.id === id)?.act?.xp;
  };

  addXp(id, amount) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    if(data[find].act.xp + Number(amount) > (50 * data[find].act.lvl) + 50) {
      let counter = leveling(data[find].act.xp + Number(amount), data[find].act.lvl, level => (50 * level) + 50);

      data[find].act = { xp: counter.xp, lvl: counter.lvl }
    } else
      data[find].act.xp += Number(amount);

    this.setGd(data)
  };

  minXp(id, amount) {
    this.addXp(id, -Number(amount))
  };

  setXp(id, value) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    data[find].act.xp = value;
    this.setGd(data)
  };

  resetXp(id) {
    this.setXp(id, 0)
  };

  // Level Method
  getLvl(id) {
    return this.gd().find(e => e.id === id);
  };
  addLvl(id, amount) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    data[find].act.lvl += amount;
    
    this.setGd(data)
  };
  minLvl(id, amount) {
    this.addLvl(id, -Number(amount));
  };
  setLvl(id, value) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    data[find].act.lvl = value;
    data[find].act.xp = 0;
    this.setGd(data)
  };
  resetLvl(id) {
    this.setLvl(id, 0);
  };
  
  // Max Member Method
  addMaxMember(id, value = 1) {
    let data = this.gd(), find = data.findIndex(e => e.id === id);

    if(find === -1) return;
    data[find].maxMember += Number(value);
    this.setGd(data);
  };
  minMaxMember(id, value) {
    this.addMember(id, -Number(value))
  };

  // Other Method
  getTeammate(id) {
    return this.gd().find(e => e.member.some(r => r.id === id))?.member.map(e => e.username);
  }
};

export { Guild };