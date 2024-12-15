import { system, world, TimeOfDay, MinecraftDimensionTypes, TicksPerSecond, EntityComponentTypes, EquipmentSlot, BlockVolume, WeatherType } from "@minecraft/server";

const sunburnProps = {
  secsToGetSunburn: 600, // About 10 minutes to get sunburned
  sunburnTickCounter: 0,
  currentWeather: WeatherType.Clear
};

world.afterEvents.weatherChange.subscribe((ev) => sunburnProps.currentWeather = ev.newWeather);

system.runInterval(() => {
  const time = world.getTimeOfDay();
  const dim = world.getDimension(MinecraftDimensionTypes.overworld);

  if (
    ((time >= TimeOfDay.Day && time < TimeOfDay.Noon) || // Day
    (time >= TimeOfDay.Noon && time < TimeOfDay.Sunset)) && // Noon
    sunburnProps.currentWeather === WeatherType.Clear
  ) {
    sunburnProps.sunburnTickCounter++
  };

  if (sunburnProps.sunburnTickCounter === sunburnProps.secsToGetSunburn) {
    sunburnProps.sunburnTickCounter = 0;

    world.getAllPlayers().forEach((source) => {
      const equipmentComp = source.getComponent(EntityComponentTypes.Equippable);
      const headArmor = equipmentComp.getEquipment(EquipmentSlot.Head);

      const { x, y, z } = source.location;
      
      const posCheck1 = dim.containsBlock(new BlockVolume(source.location, {x: x + 4, y: y + 4, z: z + 4}), {
          includeTypes: [ "minecraft:snow", "minecraft:snow_layer" ]
      });
      const posCheck2 = dim.containsBlock(new BlockVolume(source.location, {x: x - 4, y: y - 4, z: z - 4}), {
          includeTypes: [ "minecraft:snow", "minecraft:snow_layer" ]
      });

      const topMostBlock = dim.getBlockFromRay(source.location, { x: 0, y: 1, z: 0 }, { includePassableBlocks: false })?.block;

      if (
        !topMostBlock && !headArmor &&
        !(posCheck1 || posCheck2) // Make it not run when in cold biomes
      ) {
        source.setDynamicProperty('has_sunburn', true);
        // We just need to implement what to do when player gets sunburn
      }
    });
  }
}, TicksPerSecond);