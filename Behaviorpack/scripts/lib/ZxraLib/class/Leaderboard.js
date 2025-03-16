import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { Specialist } from "../module.js";
import * as jsonData from "../../data.js";

class Leaderboard {
  constructor() {
    this.c = null;
    this.lib = jsonData.leaderboardLb;
  };
  
  setup(game) {
    if(this.c) return;
    this.c = game;
  };
  
  lb() {
    //console.warn(JSON.stringify(this.getData("leaderboard")))
    return this.c.getData("leaderboard") !== undefined ? this.c.getData("leaderboard") : this.lib;
  };
  setLb(obj) {
    //console.warn(JSON.stringify(obj))
    this.c.setData("leaderboard", obj);
  };
  resetLb() {
    this.c.setLb(this.lib)
  };

  getLeaderboard(player) {
    if(!player) return;
    let lbData = ["deaths","kills","chatting"];

    let gui = new ActionFormData().title({ translate: "cz.leaderboard" }).body({ translate: "cz.leaderboard.body" })
      .button({ translate: "sort.chatting" })
      .button({ translate: "sort.deaths" })
      .button({ translate: "sort.guild" })
      .button({ translate: "sort.kills" })
      .button({ translate: "sort.money" })
      .button({ translate: "sort.rep" })
      .button({ translate: "sort.specialist" })
      .button({ translate: "sort.voxn" })
      .show(player)
      .then(r => {
        let data = this.lb();

        if(r.canceled) return;
        let gui2 = new ActionFormData()

        switch(r.selection) {
          case 0:
            let chat = data.chatting
              .sort((a, b) => b.count - a.count)
              .reduce((arr, r, i) => {
                arr.push({ text: `\n${i+1}. ${r.name} - ` },{ translate: "system.chat" },{ text: ` ${r.count}`})
                return arr
              }, [])
            gui2.title({ translate: "cz.leaderboard.chatting" }).body({ rawtext: [{ translate: "cz.leaderboard.chatting.body" },{ text: `\n` }, ...chat]}).button({ translate: "system.yes" }).show(player)
            break;
          case 1:
            let death = data.deaths
              .sort((a, b) => b.count - a.count)
              .reduce((arr, r, i) => {
                arr.push({ text: `\n${i+1}. ${r.name} -` },{ text: ` ${r.count} `},{ translate: "system.death" })
                return arr
              }, [])
            gui2.title({ translate: "cz.leaderboard.deaths" }).body({ rawtext: [{ translate: "cz.leaderboard.deaths.body" },{ text: `\n` }, ...death]}).button({ translate: "system.yes" }).show(player)
            break;
          case 2:
            let guilds = this.c.guild.gd()
              .sort((a, b) => b - a)
              .map((e, i) => `\n${i+1}. ${e.name}§r lvl ${e.act.lvl}`)
              .join("")
            gui2.title({ translate: "cz.leaderboard.guild" }).body({ rawtext: [{ translate: "cz.leaderboard.guild.body" },{ text: guilds }]}).button({ translate: "system.yes" }).show(player)
            break;
          case 3:
            let kill = data.kills
              .sort((a, b) => b.count - a.count)
              .reduce((arr, r, i) => {
                arr.push({ text: `\n${i+1}. ${r.name} - ` },{ translate: "system.kill" },{ text: ` ${r.count} mob`})
                return arr
              }, [])
            gui2.title({ translate: "cz.leaderboard.kills" }).body({ rawtext: [{ translate: "cz.leaderboard.kills.body" },{ text: `\n` }, ...kill]}).button({ translate: "system.yes" }).show(player)
            break;
          case 4:
            let money = world.getPlayers().map(t => {
              let sp = new Specialist(t).getData();
              
              return { id: t.id, name: t.name, money: sp.money };
            })
            .sort((a, b) => b.money - a.money)
            .reduce((arr, r, i) => {
               arr.push({ text: `\n${i+1}. ${r.name} - $${r.money}`})
               return arr
            }, [])
            gui2.title({ translate: "cz.leaderboard.money" }).body({ rawtext: [{ translate: "cz.leaderboard.money.body" },{ text: `\n` }, ...money]}).button({ translate: "system.yes" }).show(player)
            break;
          case 5:
            let rep = world.getPlayers().map(t => {
              let sp = new Specialist(t).getData();
              
              return { id: t.id, name: t.name, rep: sp.reputation };
            })
            .sort((a, b) => b.rep - a.rep)
            .reduce((arr, r, i) => {
               arr.push({ text: `\n${i+1} ${r.name} ` },{ translate: "system.rep" },{ text: ` ${r.rep}`})
               return arr
            }, [])
            gui2.title({ translate: "cz.leaderboard.rep" }).body({ rawtext: [{ translate: "cz.leaderboard.rep.body" },{ text: `\n` }, ...rep]}).button({ translate: "system.yes" }).show(player)
            break;
          case 6:
            let spl = world.getPlayers().map(t => {
              let sp = new Specialist(t).getData();
              
              return { id: t.id, name: t.name, specialist: sp.specialist.lvl };
            })
            .sort((a, b) => b.specialist - a.specialist)
            .reduce((arr, r, i) => {
               arr.push({ text: `\n${i+1}. ${r.name} - ` },{ translate: "system.sp" },{ text: ` ${r.specialist}`})
               return arr
            }, [])
            gui2.title({ translate: "cz.leaderboard.specialist" }).body({ rawtext: [{ translate: "cz.leaderboard.specialist.body" },{ text: `\n` }, ...spl]}).button({ translate: "system.yes" }).show(player)
            break;
          case 7:
            let voxn = world.getPlayers().map(t => {
              let sp = new Specialist(t).getData();
              
              return { id: t.id, name: t.name, voxn: sp.voxn };
            })
            .sort((a, b) => b.voxn - a.voxn)
            .reduce((arr, r, i) => {
               arr.push({ text: `\n${i+1}. ${r.name} - ${r.voxn} Voxn`})
               return arr
            }, [])
            gui2.title({ translate: "cz.leaderboard.voxn" }).body({ rawtext: [{ translate: "cz.leaderboard.voxn.body" },{ text: `\n` }, ...voxn]}).button({ translate: "system.yes" }).show(player)
            break;
          default: {
            gui2.title({ translate: "cz.leaderboard.none" }).body({ translate: "cz.leaderboard.none.body" }).button({ translate: "system.yes" }).show(player)
          }
        };
      })

  };
  addLb(player, { amount, type }) {
    let data = this.lb(), find = data[type].findIndex(e => e.id === player.id);
    // console.warn(JSON.stringify(data))
    
    if(find !== -1) {
      data[type][find].count = data[type][find].count + Number(amount);
    } else {
      data[type].push({
        id: player.id,
        name: player.name,
        count: Number(amount)
      })
    }
    this.setLb(data);
  };
}

export { Leaderboard };