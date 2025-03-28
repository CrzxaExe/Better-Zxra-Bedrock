import { world, system } from "@minecraft/server";
import { durabilityControl } from "./ZxraLib/module.js";

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  /*
   *. Block Function
   */

  // Chair Function
  blockComponentRegistry.registerCustomComponent(
    "cz:chair",
    {
      onPlayerInteract({ block, player, dimension }) {
        //console.warn(JSON.stringify(block), JSON.stringify(player), JSON.stringify(dimension))
        const sit = dimension.spawnEntity("cz:seat", { x: block.location.x+0.5, y: block.location.y+0.52, z: block.location.z+0.5 })

        sit.runCommand(`ride ${player.name} start_riding @s`)
      }
    }
  )

  // Generator Function
  blockComponentRegistry.registerCustomComponent(
    "cz:generator",
    {
      onPlace({ block, dimension }) {
        dimension.spawnEntity("cz:block_data", { x: block.location.x, y: block.location.y, z: block.location.z })
      },

      onPlayerInteract({ block, dimension, player }) {
        console.warn("test")
      }
    }
  )

  // Ore Xp Function
  blockComponentRegistry.registerCustomComponent(
    "cz:ore_xp",
    {
      onPlayerDestroy({ block, player, dimension }) {
        let drop = 4;

        switch (block?.typeId.split(":")[1]) {
          case "dexterite_ore":
          case "chlorophyte_ore": drop = 6; break;
          case "ender_ore": drop = 8; break;
        }

        const itemStack = player?.getComponent("inventory")?.container.getSlot(player.selectedSlotIndex)?.getItem();
        if (!itemStack) return;

        const enchantable = itemStack.getComponent("minecraft:enchantable");
        const silkTouch = enchantable?.getEnchantment("silk_touch");
        if (silkTouch) return;

        for (let i = 0; i < drop; i++) {
          dimension.spawnEntity("minecraft:xp_orb", block.location);
        }
        
        durabilityControl(player, 1)
      }
    }
  )
})