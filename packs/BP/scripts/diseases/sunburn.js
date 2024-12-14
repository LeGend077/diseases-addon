import { system, world, TimeOfDay, MinecraftDimensionTypes, TicksPerSecond, EntityComponentTypes, EquipmentSlot, BlockVolume } from "@minecraft/server";
import { clamp } from '../index.js';

const sunburnProps = {
  secsToGetSunburn: 600, // About 10 minutes to get sunburned
  maxYToCheck: 50, // Check if theres any block 50 blocks above the players head
  sunburnTickCounter: 0
};

system.runInterval(() => {
  
    const time = world.getTimeOfDay();
    const dim = world.getDimension(MinecraftDimensionTypes.overworld);

    if (
      (time >= TimeOfDay.Day && time < TimeOfDay.Noon) || // Day
      (time >= TimeOfDay.Noon && time < TimeOfDay.Sunset) // Noon
    ) {sunburnProps.sunburnTickCounter++};

    if (sunburnProps.sunburnTickCounter === sunburnProps.secsToGetSunburn) {
      sunburnProps.sunburnTickCounter = 0;

    world.getAllPlayers().forEach((source) => {
      const headLoc = Math.floor(source.getHeadLocation().y);
      
      const equipmentComp = source.getComponent(EntityComponentTypes.Equippable);
      const headArmor = equipmentComp.getEquipment(EquipmentSlot.Head);

      const { x, y, z } = source.location;
      
      const posCheck1 = source.dimension.containsBlock(new BlockVolume(source.location, {x: x + 4, y: y + 4, z: z + 4}), {
          includeTypes: ["minecraft:snow", "minecraft:snow_layer"]
      });
      const posCheck2 = source.dimension.containsBlock(new BlockVolume(source.location, {x: x - 4, y: y - 4, z: z - 4}), {
          includeTypes: ["minecraft:snow", "minecraft:snow_layer"]
      });

      for (let i = headLoc; i < clamp(headLoc + sunburnProps.maxYToCheck, dim.heightRange.min, dim.heightRange.max); i++) {
        const blockAbove = dim.getBlock({ x: source.location.x, y: i, z: source.location.z });

        if (
          blockAbove.isAir &&
          (i + 1) === (headLoc + sunburnProps.maxYToCheck) && // This is to make the code inside only run once
          !headArmor &&
          !(posCheck1 || posCheck2) // Make it not run when in cold biomes
        ) {
          source.setDynamicProperty('has_sunburn', true);
          // We just need to implement what to do when player gets sunburn
        }
      }
    });
  }
}, TicksPerSecond);