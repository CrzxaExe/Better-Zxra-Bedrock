import { runeData } from "../module.js";

const gachaData = {
  weapon: {
    unique: [
      "boltizer",
      "catlye",
      "destiny",
      "destreza",
      "endless",
      "lectaze",
      "liberator",
      "mudrock",
      "pandora",
      "quezn",
      "silent",
      "skyler"
    ],
    epic: [
      "berserk",
      "bringer",
      "cenryter",
      "crusher",
      "undying",
      "yume_staff"
    ],
    legend: [
      "azyh",
      "cervant",
      "harmist_flute",
      "harmony",
      "hyrant",
      "lighter",
      "musha",
      "sui",
      "vitage"
    ],
    rare: [
      "greatsword",
      "hammer",
      "katana",
      "reaper",
      "spear"
    ]
  }
}

const gachaFeatured = {
  name: "Hard as Oriron",
  unique: [
    "mudrock"
  ],
  epic: [
    "cenryter",
    "undying",
    "yume_staff"
  ],
  legend: ["cervant","harmist_flute"],
  rare: ["katana"]
}

const userPity = {
  pull: 0,
  pityWeapon: {
    normal: 0,
    featured: 0
  }
}
export { gachaData, gachaFeatured, userPity };