import { Player, GameMode, EquipmentSlot } from "@minecraft/server";

const durabilityControl = (source, amount = 1) => {
  if (!(source instanceof Player)) return;

  const equippable = source.getComponent("minecraft:equippable");
  if (!equippable) return;

  const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
  if (!mainhand.hasItem()) return;

  if (source.getGameMode() === GameMode.creative) return;

  const itemStack = mainhand.getItem();

  const durability = itemStack.getComponent("minecraft:durability");
  if (!durability) return;

  const enchantable = itemStack.getComponent("minecraft:enchantable");
  const unbreakingLevel = enchantable?.getEnchantment("unbreaking")?.level;

  const damageChance = durability.getDamageChance(unbreakingLevel) / 100;

  if (Math.random() > damageChance) return;

  const shouldBreak = durability.damage === durability.maxDurability;

  if (shouldBreak) {
    mainhand.setItem(undefined);
    source.playSound("random.break");
  } else {
    durability.damage += amount;
    mainhand.setItem(itemStack);
  }
};

export { durabilityControl };
