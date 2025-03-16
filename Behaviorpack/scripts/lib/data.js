export let setting = {
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
  uiLevelRequirement: true
}

export const weaponType = [
 "artsword",
 "breifcase",
 "century",
 "dagger",
 "flute",
 "greatsword",
 "gun",
 "hammer",
 "katana",
 "lance",
 "reaper",
 "slayer",
 "spear",
 "staff"
]

export const damageColor = {
  anvil: "§l^",
  blockExplosion: "§l§6",
  campfire: "§6v",
  contact: "§c^",
  drowning: "§3^",
  entityAttack: "§c",
  entityExplosion: "§6^",
  fall: "§l_",
  fallingBlock: "§l^",
  fatal: "§c§l",
  fire: "§6",
  fireTick: "§6^",
  fireworks: "§6#",
  flyIntoWall: "§l>",
  freezing: "§q",
  lava: "§6v",
  lightning: "§1^",
  magic: "§d",
  magma: "§c_",
  none: "§l",
  override: "§l~",
  piston: "§l>",
  projectile: "§c~",
  ramAttack: "§c§l",
  selfDestruct: "§l§6",
  sonicBoom: "§b§l",
  soulCampfire: "§b_",
  stalactite: "§l`",
  stalagmite: "§l*",
  starve: "§e~",
  suffocation: "§l[]",
  suicide: "§2§l",
  temperature: "°",
  thorns: "§e^",
  "void": "§l__",
  wither: "§9"
}

export const guildShop = [
  { item: "enchanted_apple", type: "foods", amount: 1, price: 25, lvl: 5, img: "textures/items/apple_golden" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "aqua_affinity*1", amount: 1, price: 23, lvl: 5, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "bane_of_arthropods*1", amount: 1, price: 25, lvl: 5, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "blast_protection*1", amount: 1, price: 26, lvl: 5, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "breach*1", amount: 1, price: 25, lvl: 8, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "channeling*1", amount: 1, price: 30, lvl: 8, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "density*1", amount: 1, price: 40, lvl: 8, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "depth_strider*1", amount: 1, price: 29, lvl: 6, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "efficiency*1", amount: 1, price: 27, lvl: 5, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "feather_falling*1", amount: 1, price: 30, lvl: 8, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "fire_aspect*1", amount: 1, price: 28, lvl: 6, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "fire_protection*1", amount: 1, price: 26, lvl: 5, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "flame*1", amount: 1, price: 28, lvl: 6, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "fortune*1", amount: 1, price: 32, lvl: 7, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "frost_walker*1", amount: 1, price: 28, lvl: 6, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "impaling*1", amount: 1, price: 30, lvl: 6, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "infinity*1", amount: 1, price: 38, lvl: 8, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "knockback*1", amount: 1, price: 29, lvl: 6, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "looting*1", amount: 1, price: 31, lvl: 7, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "loyalty*1", amount: 1, price: 28, lvl: 6, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "luck_of_the_sea*1", amount: 1, price: 23, lvl: 6, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "lure*1", amount: 1, price: 30, lvl: 6, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "mending*1", amount: 1, price: 48, lvl: 10, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "multishot*1", amount: 1, price: 35, lvl: 7, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "piercing*1", amount: 1, price: 26, lvl: 6, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "power*1", amount: 1, price: 32, lvl: 8, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "projectile_protection*1", amount: 1, price: 26, lvl: 5, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "protection*1", amount: 1, price: 26, lvl: 5, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "punch*1", amount: 1, price: 27, lvl: 7, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "quick_charge*1", amount: 1, price: 26, lvl: 7, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "respiration*1", amount: 1, price: 32, lvl: 8, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "riptide*1", amount: 1, price: 32, lvl: 8, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "sharpness*1", amount: 1, price: 38, lvl: 8, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "silk_touch*1", amount: 1, price: 35, lvl: 7, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "smite*1", amount: 1, price: 25, lvl: 5, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "soul_speed*1", amount: 1, price: 30, lvl: 7, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "swift_sneak*1", amount: 1, price: 32, lvl: 8, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "thorns*1", amount: 1, price: 38, lvl: 7, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "unbreaking*1", amount: 1, price: 35, lvl: 6, img: "textures/items/book_enchanted" },
  { item: "minecraft:enchanted_book", type: "enchant", enchant: "wind_burst*1", amount: 1, price: 32, lvl: 8, img: "textures/items/book_enchanted" },
  { item: "golden_apple", type: "foods", amount: 6, price: 20, lvl: 0, img: "textures/items/apple_golden" },
  { item: "cz:mina_ingot", type: "minerals", amount: 4, price: 25, lvl: 3, img: "textures/items/mina/ingot" }
  { item: "cz:plasma_ingot", type: "minerals", amount: 4, price: 12, lvl: 2, img: "textures/items/plasma/ingot" },
  { item: "shulker_shell", type: "materials", amount: 4, price: 30, lvl: 7, img: "textures/items/shulker_shell" },
  { item: "totem_of_undying", type: "special",  amount: 2, price: 19, lvl: 0, img: "textures/items/totem" },
  { item: "cz:quest_scroll", type: "special", amount: 1, price: 5, lvl: 0, img: "textures/items/quest_scroll" }
]

export let blockData = {
  plasma_core: {
    type: "plasma_core",
    power: { stored: 0, max: 5000 },
    powerStatus: false,
    generator: 120,
    fuel: 0,
    inventory: []
  }
}

export const npcFile = {
  yuri: {
    mood: 0,
    emotion: 0,
    status: [],
    stat: {
	  talkMaxOptions: 2,
      maxMood: 3,
      emotions: [
        "angry",
        "happy",
        "normal",
        "open"
      ],
      itemFav: [
        { item: "salmon", mood: 0.3, text: "yuri.like" },
        { item: "cooked_salmon", mood: 0.5, text: "yuri.like" },
        { item: "cod", mood: 0.3, text: "yuri.like" },
        { item: "cooked_cod", mood: 0.5, text: "yuri.like" }
      ],
      itemDis: [
        { item: "carrot", mood: -0.8, text: "yuri.dislike" },
        { item: "potato", mood: -0.7, text: "yuri.dislike" },
        { item: "apple", mood: -0.8, text: "yuri.dislike" }
      ],
      greet: [
        "yuri.greet0",
        "yuri.greet1",
        "yuri.greet2",
        "yuri.greet3",
        "yuri.greet4",
        "yuri.greet5"
      ],
      talk: [
        {
	      text: "npc.yuri.talk1_q",
	      ans: "npc.yuri.talk1_a",
	      mood: 0.1,
	      minMood: 0
        },
        {
	      text: "npc.yuri.talk2_q",
	      ans: "npc.yuri.talk2_a",
	      mood: 0.1,
	      minMood: 0
        },
        {
	      text: "npc.yuri.talk3_q",
	      ans: "npc.yuri.talk3_a",
	      mood: 0.1,
	      minMood: 0
        },
        {
	      text: "npc.yuri.talk4_q",
	      ans: "npc.yuri.talk4_a",
	      mood: 0.1,
	      minMood: 0
        },
        {
	      text: "npc.yuri.talk5_q",
	      ans: "npc.yuri.talk5_a",
	      mood: 0.1,
	      minMood: 0
        }
      ]
    }
  }
}

export const leaderboardLb = {
  deaths: [],
  kills: [],
  chatting: []
}

export const guild = {
  name: "",
  id: "",
  member: [],
  act: { lvl: 0, xp: 0 },
  token: 0,
  maxMember: 5,
  des: "",
  request: false,
  apply: []
}

export const toolsMod = {
  explosive: {
    maxLvl: 3,
    type: ["sword"],
    up: [
      { price: 9.3, voxn: 2, item: [] },
      { price: 15.1, voxn: 3, item: ["gunpowder/5"] },
      { price: 17.5, voxn: 1, item: ["gunpowder/10"] }
    ]
  },
  vampiric: {
    maxLvl: 2,
    type: ["sword"],
    up: [
      { price: 12.4, voxn: 3, item: ["golden_apple/1"] },
      { price: 18.9, voxn: 3, item: ["golden_apple/2"] }
    ]
  },
  lifesteal: {
    maxLvl: 2,
    type: ["sword"],
    up: [
      { price: 15.7, voxn: 4, item: ["soul_sand/20"] },
      { price: 20.5, voxn: 3, item: ["soul_sand/50","golden_apple/3"] }
    ]
  },
  slower: {
    maxLvl: 2,
    type: ["sword"],
    up: [
      { price: 10.4, voxn: 2, item: [] },
      { price: 12.8, voxn: 3, item: ["gunpowder/10"] }
    ]
  },
  sweeping: {
    maxLvl: 1,
    type: ["sword"],
    up: [
      { price: 12.7, voxn: 4, item: ["lapiz_lazuli/20"] }
    ]
  },
  steal: {
    maxLvl: 4,
    type: ["sword"],
    up: [
      { price: 12.2, voxn: 2, item: [] },
      { price: 14.7, voxn: 4, item: ["gold_ingot/5"] },
      { price: 17.4, voxn: 7, item: ["gold_ingot/12"] }
    ]
  }
}

export const questIndex = [
  {
	title: "quest.no0",
	des: "quest.no0.des",
	rep: 0,
	task: [
      { act: "kill", target: "zombie", amount: 90 }
    ],
	reward: [
	  { type: "cash", amount: 123.4 },
	  { type: "rep", amount: 3 },
	  { type: "voxn", amount: 2 },
	  { type: "item/cz:diamond_ascend", amount: 1 },
	  { type: "item/iron_ingot", amount: 3 },
	  { type: "token", amount: 5 }
    ]
  },
  {
	title: "quest.no1",
	des: "quest.no1.des",
	rep: 0,
	task: [
      { act: "kill", target: "skeleton", amount: 100 }
    ],
	reward: [
	  { type: "cash", amount: 118.6 },
	  { type: "rep", amount: 4 },
	  { type: "voxn", amount: 2 },
	  { type: "item/cz:diamond_ascend", amount: 1 },
	  { type: "token", amount: 4 }
    ]
  },
  {
	title: "quest.no2",
	des: "quest.no2.des",
	rep: 0,
	task: [
      { act: "kill", target: "creeper", amount: 40 }
    ],
	reward: [
	  { type: "cash", amount: 130.8 },
	  { type: "rep", amount: 4 },
	  { type: "voxn", amount: 2 },
	  { type: "item/cz:diamond_ascend", amount: 1 },
	  { type: "item/gunpowder", amount: 40 },
	  { type: "token", amount: 4 }
    ]
  },
  {
	title: "quest.no3",
	des: "quest.no3.des",
	rep: 0,
	task: [
      { act: "kill", target: "zombie", amount: 80 },
      { act: "kill", target: "skeleton", amount: 100 }
    ],
	reward: [
	  { type: "cash", amount: 146.4 },
	  { type: "rep", amount: 8 },
	  { type: "voxn", amount: 4 },
	  { type: "item/cz:diamond_ascend", amount: 1 },
	  { type: "item/gunpowder", amount: 80 },
	  { type: "token", amount: 6 }
    ]
  },
  {
	title: "quest.no4",
	des: "quest.no4.des",
	rep: 0,
	task: [
	  { act: "destroy", target: "dirt", amount: 200 },
	  { act: "destroy", target: "stone", amount: 75 }
	],
	reward: [
	  { type: "cash", amount: 90.2 },
	  { type: "rep", amount: 7 },
	  { type: "voxn", amount: 4 },
	  { type: "item/iron_pickaxe", amount: 1 },
	  { type: "token", amount: 3 }
	]
  },
  {
	title: "quest.no5",
	des: "quest.no5.des",
	rep: 0,
	task: [
	  { act: "destroy", target: "sand", amount: 94 }
	],
	reward: [
	  { type: "cash", amount: 90.6 },
	  { type: "voxn", amount: 2 },
	  { type: "rep", amount: 5 },
	  { type: "token", amount: 1 }
	]
  },
  {
	title: "quest.no6",
	des: "quest.no6.des",
	rep: 50,
	task: [
	  { act: "kill", target: "creeper", amount: 50 },
	  { act: "kill", target: "skeleton", amount: 90 },
	  { act: "kill", target: "zombie", amount: 120 }
	],
	reward: [
	  { type: "cash", amount: 386.9 },
	  { type: "rep", amount: 8 },
	  { type: "voxn", amount: 6 },
	  { type: "item/cz:diamond_ascend", amount: 1 },
	  { type: "item/cz:plasma_ingot", amount: 4 },
	  { type: "token", amount: 9 }
	]
  },
  {
	title: "quest.no7",
	des: "quest.no7.des",
	rep: 120,
	task: [
	  { act: "kill", target: "ender_dragon", amount: 1 }
	],
	reward: [
	  { type: "cash", amount: 1023.9 },
	  { type: "rep", amount: 8 },
	  { type: "voxn", amount: 4 },
	  { type: "item/cz:diamond_ascend", amount: 1 },
	  { type: "token", amount: 7 }
	]
  },
  {
	title: "quest.no8",
	des: "quest.no8.des",
	rep: 230,
	task: [
	  { act: "kill", target: "ender_dragon", amount: 5 }
	],
	reward: [
	  { type: "cash", amount: 8239.8 },
	  { type: "rep", amount: 18 },
	  { type: "voxn", amount: 14 },
	  { type: "item/cz:diamond_ascend", amount: 2 },
	  { type: "item/end_crystal", amount: 4 },
	  { type: "token", amount: 30 }
	]
  },
  {
	title: "quest.no9",
	des: "quest.no9.des",
	rep: 0,
	task: [
	  { act: "destroy", target: "lapis_ore", amount: 43 }
	],
	reward: [
	  { type: "cash", amount: 78.8 },
	  { type: "rep", amount: 3 },
	  { type: "voxn", amount: 2 },
	  { type: "token", amount: 1 }
	]
  },
  {
	title: "quest.no10",
	des: "quest.no10.des",
	rep: 50,
	task: [
	  { act: "destroy", target: "stone", amount: 238 },
	  { act: "destroy", target: "cobblestone", amount: 85 }
	],
	reward: [
	  { type: "cash", amount: 92.4 },
	  { type: "rep", amount: 7 },
	  { type: "voxn", amount: 4 },
	  { type: "item/iron_block", amount: 9 },
	  { type: "token", amount: 4 }
	]
  },
  {
	title: "quest.no11",
	des: "quest.no11.des",
	rep: 50,
	task: [
	  { act: "destroy", target: "netherrack", amount: 164 }
	],
	reward: [
	  { type: "cash", amount: 55.6 },
	  { type: "rep", amount: 6 },
	  { type: "voxn", amount: 2 },
	  { type: "item/blaze_rod", amount: 5 },
	  { type: "token", amount: 6 }
	]
  },
  {
	title: "quest.no12",
	des: "quest.no12.des",
	rep: 20,
	task: [
	  { act: "kill", target: "sheep", amount: 83 },
	  { act: "kill", target: "cow", amount: 76 }
	],
	reward: [
	  { type: "cash", amount: 76.3 },
	  { type: "rep", amount: 3 },
	  { type: "voxn", amount: 4 },
	  { type: "item/cooked_mutton", amount: 64 },
	  { type: "token", amount: 3 }
	]
  },
  {
	title: "quest.no13",
	des: "quest.no13.des",
	rep: 500,
	task: [
	  { act: "kill", target: "kyle", amount: 1 }
	],
	reward: [
	  { type: "cash", amount: 1203.25 },
	  { type: "rep", amount: 12 },
	  { type: "voxn", amount: 25 },
	  { type: "item/cz:diamond_ascend", amount: 24 },
	  { type: "token", amount: 69 }
	]
  },
  {
	title: "quest.no14",
	des: "quest.no14.des",
	rep: 0,
	task: [
	  { act: "destroy", target: "coal_ore", amount: 128 }
	],
	reward: [
	  { type: "cash", amount: 77.2 },
	  { type: "rep", amount: 3 },
	  { type: "voxn", amount: 2 },
	  { type: "token", amount: 2 }
	]
  },
  {
	title: "quest.no15",
	des: "quest.no15.des",
	rep: 0,
	task: [
	  { act: "destroy", target: "iron_ore", amount: 128 }
	],
	reward: [
	  { type: "cash", amount: 69.7 },
	  { type: "rep", amount: 3 },
	  { type: "voxn", amount: 2 },
	  { type: "token", amount: 2 }
	]
  },
  {
	title: "quest.no16",
	des: "quest.no16.des",
	rep: 0,
	task: [
	  { act: "destroy", target: "gold_ore", amount: 128 }
	],
	reward: [
	  { type: "cash", amount: 72.2 },
	  { type: "rep", amount: 5 },
	  { type: "voxn", amount: 2 },
  	{ type: "token", amount: 2 }
	]
  },
  {
	title: "quest.no17",
	des: "quest.no17.des",
	rep: 30,
	task: [
	  { act: "destroy", target: "gold_ore", amount: 140 },
	  { act: "destroy", target: "iron_ore", amount: 140 },
  	{ act: "destroy", target: "diamond_ore", amount: 140 }
	],
	reward: [
	  { type: "cash", amount: 242.8 },
	  { type: "rep", amount: 12 },
	  { type: "voxn", amount: 5 },
	  { type: "item/diamond_pickaxe", amount: 1 },
	  { type: "token", amount: 5 }
	]
  },
  {
	title: "quest.no18",
	des: "quest.no18.des",
	rep: 30,
	task: [
	  { act: "kill", target: "pig", amount: 89 },
	  { act: "kill", target: "rabbit", amount: 32 }
	],
	reward: [
	  { type: "cash", amount: 96.3 },
	  { type: "rep", amount: 3 },
	  { type: "voxn", amount: 4 },
	  { type: "token", amount: 6 }
	]
  },
  {
	title: "quest.no19",
	des: "quest.no19.des",
	rep: 50,
	task: [
	  { act: "kill", target: "drowned", amount: 100 },
	  { act: "kill", target: "zombie", amount: 64 }
	],
	reward: [
	  { type: "cash", amount: 164.3 },
	  { type: "rep", amount: 12 },
	  { type: "voxn", amount: 8 },
	  { type: "item/trident", amount: 1 },
	  { type: "token", amount: 8 }
	]
  },
  {
	title: "quest.no20",
	des: "quest.no20.des",
	rep: 10,
	task: [
	  { act: "kill", target: "drowned", amount: 36 }
	],
	reward: [
	  { type: "cash", amount: 76.3 },
	  { type: "rep", amount: 4 },
	  { type: "voxn", amount: 2 },
	  { type: "token", amount: 7 }
	]
  }
]