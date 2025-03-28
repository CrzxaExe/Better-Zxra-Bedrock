import { world } from "@minecraft/server";
import {
  ActionFormData,
  ModalFormData,
  MessageFormData,
} from "@minecraft/server-ui";
import { setOptions } from "../../../main.js";
import { mergeObject, Specialist, runeAdmin, Terra } from "../module.js";

const adminPanel = (player, lib) => {
  let ui = new ActionFormData()
    .title({ translate: "cz.adminPanel" })
    .body({ translate: "cz.adminPanel.body" })
    .button({ translate: "system.settings" })
    .button({ translate: "system.economy" })
    .button({ translate: "system.guildLvl" })
    .button({ translate: "system.guildToken" })
    .button("Voxn")
    .button({ translate: "system.reset.leaderboard" })
    .button({ translate: "system.announce" })
    .button({ translate: "system.rune.add" })

    .show(player)
    .then((e) => {
      if (e.canceled) return;

      [
        settingPanel,
        economy,
        guildLvl,
        guildToken,
        voxn,
        resetLb,
        announcePanel,
        runeAdmin
      ][e.selection]?.(player, lib);
    });
};

const settingPanel = (player, lib) => {
  let {
      useBzbRules,
      debug,
      staminaCooldown,
      staminaExhaust,
      staminaAction,
      staminaHurt,
      staminaRun,
      staminaRecovery,
      thirstDown,
      customChat,
      customChatPrefix,
      shopMultiplier,
      xpMultiplier,
      deathLocation,
      damageIndicator,
      starterItem,
      starterItems,
      starterItemMessage,
      uiLevelRequirement,
    } = lib.options,
    ui = new ModalFormData()
      .title({ translate: "system.settings" })

      .toggle({ translate: "option.useBzbRules" }, useBzbRules)
      .toggle({ translate: "option.debug" }, debug)
      .textField(
        { translate: "option.staminaAction" },
        { translate: "type.float" },
        `${staminaAction}`
      )
      .toggle({ translate: "option.staminaCooldown" }, staminaCooldown)
      .textField(
        { translate: "option.staminaExhaust" },
        { translate: "type.float" },
        `${staminaExhaust}`
      )
      .textField(
        { translate: "option.staminaHurt" },
        { translate: "type.float" },
        `${staminaHurt}`
      )
      .textField(
        { translate: "option.staminaRecovery" },
        { translate: "type.float" },
        `${staminaRecovery}`
      )
      .textField(
        { translate: "option.staminaRun" },
        { translate: "type.float" },
        `${staminaRun}`
      )
      .textField(
        { translate: "option.thirstDown" },
        { translate: "type.float" },
        `${thirstDown}`
      )
      .toggle({ translate: "option.customChat" }, customChat)
      .textField(
        { translate: "option.customChatPrefix" },
        { translate: "type.string" },
        `${customChatPrefix}`
      )
      .textField(
        { translate: "option.shopMultiplier" },
        { translate: "type.float" },
        `${shopMultiplier}`
      )
      .textField(
        { translate: "option.xpMultiplier" },
        { translate: "type.float" },
        `${xpMultiplier}`
      )
      .toggle({ translate: "option.deathLocation" }, deathLocation)
      .toggle({ translate: "option.damageIndicator" }, damageIndicator)
      .toggle({ translate: "option.starterItem" }, starterItem)
      .textField(
        { translate: "option.starterItemMessage" },
        { translate: "type.string" },
        `${starterItemMessage}`
      )
      .textField(
        { translate: "option.starterItems" },
        { translate: "type.string" },
        `${starterItems}`
      )
      .toggle({ translate: "option.uiLevelRequirement" }, uiLevelRequirement)

      .submitButton({ translate: "option.submit" })
      .show(player)
      .then((e) => {
        if (e.canceled) return adminPanel(player, lib);

        let [
          uBR,
          dbg,
          sA,
          sC,
          sE,
          sH,
          sRv,
          sR,
          tD,
          cC,
          cCP,
          sM,
          xM,
          dL,
          dI,
          sI,
          sIM,
          sIs,
          uLR,
        ] = e.formValues;
        const newOptions = {
          useBzbRules: uBR,
          debug: dbg,
          staminaAction: Number(sA),
          staminaCooldown: sC,
          staminaExhaust: Number(sE),
          staminaHurt: Number(sH),
          staminaRecovery: Number(sRv),
          staminaRun: Number(sR),
          thirstDown: Number(tD),
          customChat: cC,
          customChatPrefix: cCP,
          shopMultiplier: Number(sM),
          xpMultiplier: Number(xM),
          deathLocation: dL,
          damageIndicator: dI,
          starterItem: sI,
          starterItemMessage: sIM,
          starterItems: sIs,
          uiLevelRequirement: uLR,
        };

        setOptions(mergeObject(lib.options, newOptions));

        Terra.game.setSetting(mergeObject(lib.options, newOptions));
        player.sendMessage({ translate: "system.settings.update" });
      });
};

const resetLb = (player, lib) => {
  let ui = new MessageFormData()
    .title({ translate: "system.reset.leaderboard.confirm" })
    .body({ translate: "system.reset.leaderboard.body" })
    .button1({ translate: "system.cancel" })
    .button2({ translate: "system.yes" })

    .show(player)
    .then((e) => {
      if (e.canceled || !e.selection || e.selection === 0)
        return adminPanel(player, lib);

      player.sendMessage({ translate: "system.reseted.leaderboard" });
      Terra.leaderboard.resetLb();
    });
};

const economy = (player, lib) => {
  let players = world.getPlayers(),
    ui = new ModalFormData()
      .title({ translate: "system.economy" })
      .dropdown({ translate: "system.method.economy" }, [
        { translate: "system.add" },
        { translate: "system.min" },
        { translate: "system.set" },
      ])
      .dropdown(
        { translate: "system.username" },
        players.map((r) => r.name)
      )
      .textField({ translate: "type.value" }, { translate: "type.number" })
      .show(player)
      .then((e) => {
        if (e.canceled) return adminPanel(player, lib);

        let [type, id, value] = e.formValues,
          plyr = players[id];
        if (!plyr)
          return player.sendMessage({ translate: "system.invalidPlayer" });
        let sp = new Specialist(plyr);

        switch (type) {
          case 0:
            sp.addMoney(value);
            break;
          case 1:
            sp.takeMoney(value);
            break;
          case 2:
            sp.setMoney(value);
            break;
        }
      });
};

const voxn = (player, lib) => {
  let players = world.getPlayers(),
    ui = new ModalFormData()
      .title("Voxn")
      .dropdown({ translate: "system.method.voxn" }, [
        { translate: "system.add" },
        { translate: "system.min" },
        { translate: "system.set" },
      ])
      .dropdown(
        { translate: "system.username" },
        players.map((r) => r.name)
      )
      .textField({ translate: "type.value" }, { translate: "type.number" })
      .show(player)
      .then((e) => {
        if (e.canceled) return adminPanel(player, lib);

        let [type, id, value] = e.formValues,
          plyr = players[id];
        if (!plyr)
          return player.sendMessage({ translate: "system.invalidPlayer" });
        let sp = new Specialist(plyr);

        switch (type) {
          case 0:
            sp.addVoxn(value);
            break;
          case 1:
            sp.minVoxn(value);
            break;
          case 2:
            sp.setVoxn(value);
            break;
        }
      });
};

const guildToken = (player, lib) => {
  let guilds = Terra.guild.gd();
  let ui = new ModalFormData()
    .title({ translate: "system.guildToken" })
    .dropdown({ translate: "system.method.token" }, [
      { translate: "system.add" },
      { translate: "system.min" },
      { translate: "system.set" },
    ])
    .dropdown(
      { translate: "guild.name" },
      guilds.map((r) => r.name)
    )
    .textField({ translate: "type.value" }, { translate: "type.number" })
    .show(player)
    .then((e) => {
      if (e.canceled) return adminPanel(player, lib);

      let [type, id, amount] = e.formValues;

      switch (type) {
        case 0:
          Terra.guild.addToken(guilds[id].id, parseInt(amount));
          break;
        case 1:
          Terra.guild.minToken(guilds[id].id, parseInt(amount));
          break;
        case 2:
          Terra.guild.setToken(guilds[id].id, parseInt(amount));
          break;
      }
    });
};

const guildLvl = (player, lib) => {
  let guilds = Terra.guild.gd();
  let ui = new ModalFormData()
    .title({ translate: "system.guildLvl" })
    .dropdown({ translate: "system.method.gdLvl" }, [
      { translate: "system.add" },
      { translate: "system.min" },
      { translate: "system.set" },
    ])
    .dropdown({ translate: "system.method.gdKey" }, [
      { translate: "system.lvl" },
      { translate: "system.xp" },
    ])
    .dropdown(
      { translate: "guild.name" },
      guilds.map((r) => r.name)
    )
    .textField({ translate: "type.value" }, { translate: "type.number" })
    .show(player)
    .then((e) => {
      if (e.canceled) return adminPanel(player, lib);

      let [type, key, id, amount] = e.formValues;

      amount = parseInt(amount);

      switch(key) {
        case 0:
          switch(type) {
            case 0: Terra.guild.addLvl(guilds[id].id, amount); break;
            case 1: Terra.guild.minLvl(guilds[id].id, amount); break;
            case 2: Terra.guild.setLvl(guilds[id].id, amount); break;
          }
          break;
        case 1:
          switch(type) {
            case 0: Terra.guild.addXp(guilds[id].id, amount); break;
            case 1: Terra.guild.minXp(guilds[id].id, amount); break;
            case 2: Terra.guild.setXp(guilds[id].id, amount); break;
          }
          break;
      }
    });
};

const announcePanel = (player, lib) => {
  let ui = new ModalFormData()
    .title({ translate: "system.announce" })
    .textField(
      { translate: "system.announce.input" },
      { translate: "input.announce" }
    )
    .submitButton({ translate: "system.announce.submit" })

    .show(player)
    .then((e) => {
      if (e.canceled) return adminPanel(player, lib);

      let [form] = e.formValues;

      world.sendMessage({
        rawtext: [
          { translate: "system.announcement.pronounce" },
          { text: `\n${form}` },
          { text: `\n- ${player.name}` },
        ],
      });
    });
};

export { adminPanel, settingPanel };
