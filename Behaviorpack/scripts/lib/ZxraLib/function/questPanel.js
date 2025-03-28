import { ActionFormData } from "@minecraft/server-ui";
import { Quest } from "../module.js";

const questPanel = (player) => {
  let data = new Quest(player),
    quest = data.getQuest(),
    kl = data.questData();
  
  if(quest.title == "quest.nope")
    return player.sendMessage({ translate: "quest.nope" });
	
  
  let ui = new ActionFormData()
    .title("cz:quest")
    .body({ rawtext: [
      { translate: `${quest.title}` },
      { text: "\n \n" },
      { translate: `${quest.des}` },
      { text: `\n${data.actRaw()}\n\n` },
      { translate: "system.reward" },
      { text: `${data.rewardRaw()}` }
      ]})
    .button({ translate: "cz.back" })
    
    .show(player)
};

export { questPanel };