import {
  system,
  world,
  TimeOfDay,
  MinecraftDimensionTypes,
  TicksPerSecond,
  EntityComponentTypes,
  EquipmentSlot,
  BlockVolume,
  WeatherType,
} from "@minecraft/server";
import { createNotif } from "../index.js";

const sunburnProps = {
  secsToGetSunburn: 300, // About 5 minutes to get sunburned
  sunburnTickCounter: 0,
  thirstLostIncreaseNum: 5,
  currentWeather: WeatherType.Clear,
};

function increaseThirstLost(source) {
  const diseaseProperties = JSON.parse(
    source.getDynamicProperty("diseaseProperties")
  );
  diseaseProperties.thirstLostIncrease = sunburnProps.thirstLostIncreaseNum;

  source.setDynamicProperty(
    "diseaseProperties",
    JSON.stringify(diseaseProperties)
  );
}

world.afterEvents.weatherChange.subscribe(
  (ev) => (sunburnProps.currentWeather = ev.newWeather)
);

system.runInterval(() => {
  const time = world.getTimeOfDay();
  const dim = world.getDimension(MinecraftDimensionTypes.overworld);

  if (
    ((time >= TimeOfDay.Day && time < TimeOfDay.Noon) || // Day
      (time >= TimeOfDay.Noon && time < TimeOfDay.Sunset)) && // Noon
    sunburnProps.currentWeather === WeatherType.Clear
  ) {
    sunburnProps.sunburnTickCounter++;
  }

  if (sunburnProps.sunburnTickCounter === sunburnProps.secsToGetSunburn) {
    sunburnProps.sunburnTickCounter = 0;

    world.getAllPlayers().forEach((source) => {
      const equipmentComp = source.getComponent(
        EntityComponentTypes.Equippable
      );
      const headArmor = equipmentComp.getEquipment(EquipmentSlot.Head);

      const { x, y, z } = source.location;

      const posCheck1 = dim.containsBlock(
        new BlockVolume(source.location, { x: x + 4, y: y + 4, z: z + 4 }),
        {
          includeTypes: ["minecraft:snow", "minecraft:snow_layer"],
        }
      );
      const posCheck2 = dim.containsBlock(
        new BlockVolume(source.location, { x: x - 4, y: y - 4, z: z - 4 }),
        {
          includeTypes: ["minecraft:snow", "minecraft:snow_layer"],
        }
      );

      const topMostBlock = dim.getBlockFromRay(
        source.location,
        { x: 0, y: 1, z: 0 },
        { includePassableBlocks: false }
      )?.block;

      if (
        !topMostBlock &&
        !headArmor &&
        !(posCheck1 || posCheck2) // Make it not run when in cold biomes
      ) {
        if (!source.getDynamicProperty("has_sunburn")) {
          createNotif(
            source,
            "DISEASE:",
            "You've caught Sunburn.",
            "textures/gui/newgui/mob_effects/fire_resistance_effect",
            "disease"
          );

          source.setOnFire(4, true);
        }

        source.setDynamicProperty("has_sunburn", true);
      }
    });
  }
}, TicksPerSecond);

export { increaseThirstLost };
