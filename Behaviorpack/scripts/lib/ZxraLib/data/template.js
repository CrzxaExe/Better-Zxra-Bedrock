export const rawSpecialist = {
  specialist: { lvl: 0, xp: 0 },
  reputation: 0,
  money: 0,
  voxn: 0,
  temp: 32,
  dirty: 0,
  stamina: { max: 100, value: 100, add: 0 },
  thirst: { max: 100, value: 100 },
  cd: [],
  status: []
}

export const rawRune = {
  maxRune: 3,
  runes: [],
  usedRune: []
}

export const rawRuneStat = {
  atk: 0,
  atkFlat: 0,
  skill: 0,
  skillFlat: 0,
  healingEffectifity: 0,
  fragile: 0,
  artFragile: 0,
  fireFragile: 0,
  moneyDrop: 0,
  critChance: 0,
  critDamage: 1.2,
  skillDodge: 0,
  skillDamageRed: 0,
  skillDamageRedFlat: 0,
  staminaReduction: 0
}

export const rawWorld = {
  setting: {},
  leaderboard: {},
  guild: [],
  redeem: []
}

export const setting = {
  rules: {
    naturalregeneration: true,
    recipesunlock: false,
    showcoordinates: true,
    spawnradius: 1
  },
  staminaCooldown: true,
  staminaExhaust: 3,
  staminaRecovery: 1.5,
  staminaAction: 3,
  staminaHurt: 3,
  staminaRun: 0.5,
  thirstDown: 0.001,
  customChat: true,
  customChatPrefix: "%guild%name > %msg",
  shopMultiplier: 1.0,
  xpMultiplier: 1.0,
  debug: false,
  useBzbRules: true,
  deathLocation: true,
  damageIndicator: true,
  starterItem: true,
  starterItemMessage: "system.welcome.item",
  starterItems: "cz:stats*1",
  uiLevelRequirement: true,
  saveInterval: 5000
}