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
  staminaRun: 1.0,
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
 "slayer",
 "reaper",
 "century",
 "gun",
 "staff",
 "artsword",
 "greatsword",
 "breifcase",
 "spear",
 "katana",
 "hammer"
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

export var shop = {
  minerals: [
    { item: "cz:chlorophyte_ingot", price: 14.3, img: "textures/items/chlorophyte/ingot" },
    { item: "cz:dexterite_ingot", price: 14.3, img: "textures/items/dexterite/ingot" },
    { item: "copper_ingot", price: 0.4, img: "textures/items/copper_ingot" },
    { item: "diamond", price: 5.8, img: "textures/items/diamond" },
    { item: "cz:diamond_ingot", price: 10.6, img: "textures/items/diamond_ingot" },
    { item: "iron_ingot", price: 2.6, img: "textures/items/iron_ingot" },
    { item: "gold_ingot", price: 7.5, img: "textures/items/gold_ingot" },
    { item: "netherite_scrap", price: 9.4, img: "textures/items/netherite_scrap" },
    { item: "cz:plasma_ingot", price: 14.3, img: "textures/items/plasma/ingot" }
  ],
  crops: [
    { item: "apple", price: 0.3, img: "textures/items/apple" },
    { item: "bamboo", price: 0.2, img: "textures/items/bamboo" },
    { item: "beetroot", price: 0.1, img: "textures/items/beetroot" },
    { item: "carrot", price: 0.3, img: "textures/items/carrot" },
    { item: "glow_berries", price: 0.2, img: "textures/items/glow_berries" },
    { item: "kelp", price: 0.4, img: "textures/items/kelp" },
    { item: "melon_slice", price: 0.2, img: "textures/items/melon" },
    { item: "nether_wart", price: 0.8, img: "textures/items/nether_wart" },
    { item: "potato", price: 0.6, img: "textures/items/potato" },
    { item: "sugar_cane", price: 0.9, img: "textures/items/reeds" },
    { item: "sweet_berries", price: 0.2, img: "textures/items/sweet_berries" },
    { item: "wheat", price: 0.6, img: "textures/items/wheat" }
  ],
  foods: [
    { item: "bread", price: 1.2, img: "textures/items/bread" },
    { item: "beef", price: 1.0, img: "textures/items/beef_raw" },
    { item: "beetroot", price: 0.4, img: "textures/items/beetroot" },
    { item: "cake", price: 3.8, img: "textures/items/cake" },
    { item: "chicken", price: 0.7, img: "textures/items/chicken_raw" },
    { item: "cod", price: 0.8, img: "textures/items/fish_raw" },
    { item: "cooked_beef", price: 1.3, img: "textures/items/beef_cooked" },
    { item: "cooked_chicken", price: 1.0, img: "textures/items/chicken_cooked" },
    { item: "cooked_cod", price: 1.0, img: "textures/items/fish_cooked" },
    { item: "cooked_mutton", price: 1.0, img: "textures/items/mutton_cooked" },
    { item: "cooked_salmon", price: 1.1, img: "textures/items/fish_salmon_cooked" },
    { item: "cookie", price: 0.6, img: "textures/items/cookie" },
    { item: "pumpkin_pie", price: 1.1, img: "textures/items/pumpkin_pie" },
    { item: "golden_carrot", price: 1.0, img: "textures/items/carrot_golden" },
    { item: "salmon", price: 0.9, img: "textures/items/fish_salmon_raw" },
    { item: "cz:slice_bread", price: 0.8, img: "textures/items/food/slice_bread" },
    { item: "cz:toast", price: 1.1, img: "textures/items/food/toast" },
    { item: "cz:white_bread", price: 1.3, img: "textures/items/food/white_bread" }
  ],
  blocks: [
    { item: "brick", price: 0.4, img: "textures/blocks/brick" },
    { item: "cobblestone", price: 0.1, img: "textures/blocks/cobblestone" },
    { item: "end_stone", price: 0.7, img: "textures/blocks/end_stone" },
    { item: "dirt", price: 0.3, img: "textures/blocks/dirt" },
    { item: "gravel", price: 0.2, img: "textures/blocks/gravel" },
    { item: "ice", price: 0.4, img: "textures/blocks/ice" },
    { item: "netherrack", price: 0.3, img: "textures/blocks/netherrack" },
    { item: "stone", price: 0.1, img: "textures/blocks/stone" }
  ],
  materials: [
    { item: "bone", price: 0.5, img: "textures/items/bone" },
    { item: "book", price: 1.2, img: "textures/items/book_normal" },
    { item: "cz:ender_shard", price: 4.8, img: "textures/items/ender_shard" },
    { item: "string", price: 0.7, img: "textures/items/string" }
  ],
  redstone: [
    { item: "piston", price: 3.2, img: "textures/blocks/piston_side" },
    { item: "redstone", price: 0.7, img: "textures/items/redstone_dust" },
    { item: "redstone_block", price: 6.1, img: "textures/blocks/redstone_block" },
    { item: "redstone_lamp", price: 2.4, img: "textures/blocks/redstone_lamp_off" },
    { item: "redstone_torch", price: 1.4, img: "textures/blocks/redstone_torch_on" }
  ],
  special: [
    { item: "cz:card_of_return", price: 5, voxn: true, img: "textures/items/cards/teleport" },
    { item: "cz:card_of_teleportation", price: 6, voxn: true, img: "textures/items/cards/teleport" },
    { item: "cz:card_of_worldspawn", price: 5, voxn: true, img: "textures/items/cards/teleport" }
  ]
}

export const guildShop = [
  { item: "totem_of_undying", amount: 2, price: 11, lvl: 0, img: "textures/items/totem" },
  { item: "cz:quest_scroll", amount: 1, price: 5, lvl: 0, img: "textures/items/quest_scroll" }
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

export let npcFile = {
  yuri: {
    mood: 0,
    emotion: 0,
    status: [],
    stat: {
	  talkMaxOptions: 3,
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
    up: [
      { price: 9.3, voxn: 2, item: [] },
      { price: 15.1, voxn: 3, item: ["gunpowder/5"] },
      { price: 17.5, voxn: 1, item: ["gunpowder/10"] }
    ]
  },
  vampiric: {
    maxLvl: 2,
    up: [
      { price: 12.4, voxn: 3, item: ["golden_apple/1"] },
      { price: 18.9, voxn: 3, item: ["golden_apple/2"] }
    ]
  },
  lifesteal: {
    maxLvl: 2,
    up: [
      { price: 15.7, voxn: 4, item: ["soul_sand/20"] },
      { price: 20.5, voxn: 3, item: ["soul_sand/50","golden_apple/3"] }
    ]
  },
  slower: {
    maxLvl: 2,
    up: [
      { price: 10.4, voxn: 2, item: [] },
      { price: 12.8, voxn: 3, item: ["gunpowder/10"] }
    ]
  },
  sweeping: {
    maxLvl: 1,
    up: [
      { price: 12.7, voxn: 4, item: ["lapiz_lazuli/20"] }
    ]
  }
}

export let questIndex = [
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
	rep: 60,
	task: [
	  { act: "kill", target: "ender_dragon", amount: 1 }
	],
	reward: [
	  { type: "cash", amount: 223.9 },
	  { type: "rep", amount: 8 },
	  { type: "voxn", amount: 4 },
	  { type: "item/cz:diamond_ascend", amount: 1 },
	  { type: "token", amount: 7 }
	]
  },
  {
	title: "quest.no8",
	des: "quest.no8.des",
	rep: 120,
	task: [
	  { act: "kill", target: "ender_dragon", amount: 5 }
	],
	reward: [
	  { type: "cash", amount: 1239.8 },
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
	rep: 100,
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
	rep: 0,
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