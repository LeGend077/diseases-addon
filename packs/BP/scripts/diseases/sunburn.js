import { system, world, TimeOfDay, MinecraftDimensionTypes, TicksPerSecond, EntityComponentTypes, EquipmentSlot } from "@minecraft/server";
import { clamp } from '../index.js';

const sunburnProps = {
  secsToGetSunburn: 600, // About 10 minutes to get sunburned
  maxYToCheck: 50, // Check if theres any block 50 blocks above the players head
  sunburnTickCounter: 0
};

system.runInterval(() => {
  sunburnProps.sunburnTickCounter++

  if (sunburnProps.sunburnTickCounter === sunburnProps.secsToGetSunburn) {
    sunburnProps.sunburnTickCounter = 0;

    const time = world.getTimeOfDay();
    const dim = world.getDimension(MinecraftDimensionTypes.overworld);

    if (!(
      (time >= TimeOfDay.Day && time < TimeOfDay.Noon) || // Day
      (time >= TimeOfDay.Noon && time < TimeOfDay.Sunset) // Noon
    )) return;

    world.getAllPlayers().forEach((source) => {
      const headLoc = Math.floor(source.getHeadLocation().y);

      for (let i = headLoc; i < clamp(headLoc + sunburnProps.maxYToCheck, dim.heightRange.min, dim.heightRange.max); i++) {
        const blockAbove = dim.getBlock({ x: source.location.x, y: i, z: source.location.z });

        const equipmentComp = source.getComponent(EntityComponentTypes.Equippable);
        const headArmor = equipmentComp.getEquipment(EquipmentSlot.Head);

        if (
          blockAbove.isAir &&
          (i + 1) === (headLoc + sunburnProps.maxYToCheck) && // This is to make the code inside only run once
          !headArmor
        ) {
          source.setDynamicProperty('has_sunburn', true);
          // We just need to implement what to do when player gets sunburn
        }
      }
    });
  }
}, TicksPerSecond);