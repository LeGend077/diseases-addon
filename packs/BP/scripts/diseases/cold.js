import {
  BlockVolume,
  system,
  TicksPerSecond,
  world,
  EntityComponentTypes,
  EquipmentSlot,
} from "@minecraft/server";
import { createNotif } from "../index.js";

const coldProps = {
  getColdIn: 10, // 5 minutes to get cold
  timer: 0,
};

system.runInterval(() => {
  world.getAllPlayers().forEach((player) => {
    const { x, y, z } = player.location;

    const posCheck1 = player.dimension.containsBlock(
      new BlockVolume(player.location, { x: x + 4, y: y + 4, z: z + 4 }),
      {
        includeTypes: ["minecraft:snow", "minecraft:snow_layer"],
      }
    );
    const posCheck2 = player.dimension.containsBlock(
      new BlockVolume(player.location, { x: x - 4, y: y - 4, z: z - 4 }),
      {
        includeTypes: ["minecraft:snow", "minecraft:snow_layer"],
      }
    );

    const equipmentComp = player.getComponent(EntityComponentTypes.Equippable);
    const chestArmor = equipmentComp.getEquipment(EquipmentSlot.Chest);

    if (
      (posCheck1 || posCheck2) &&
      chestArmor?.typeId !== "minecraft:leather_chestplate"
    ) { 
      coldProps.timer++; 
    }

    if (coldProps.timer === coldProps.getColdIn) {
      if (!player.getDynamicProperty("has_cold")) {
        createNotif(
          player,
          "DISEASE:",
          "You've caught Cold.",
          "textures/ui/freeze_heart",
          "disease"
        );
      }

      coldProps.timer = 0;
      player.setDynamicProperty("has_cold", true);
    }
  });
}, TicksPerSecond);
