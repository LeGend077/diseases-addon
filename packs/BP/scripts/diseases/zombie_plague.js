import {
  Player,
  world,
  MinecraftDimensionTypes,
  TimeOfDay,
  EntityComponentTypes,
  EquipmentSlot,
} from "@minecraft/server";
import { createNotif } from "../index.js";

const zombiePlagueMobs = [
  "minecraft:zombie",
  "minecraft:husk",
  "minecraft:zombie_villager",
  "minecraft:zombie_villager_v2",
  "minecraft:zombie_pigman",
];

function burnFromSunlight(source) {
  const time = world.getTimeOfDay();
  const dim = world.getDimension(MinecraftDimensionTypes.overworld);
  dim.spawnParticle('di:weird_particle', source.location);

  if (
    (time >= TimeOfDay.Day && time < TimeOfDay.Noon) || // Day
    (time >= TimeOfDay.Noon && time < TimeOfDay.Sunset) // Noon
  ) {
    const equipmentComp = source.getComponent(EntityComponentTypes.Equippable);
    const headArmor = equipmentComp.getEquipment(EquipmentSlot.Head);

    const topMostBlock = dim.getBlockFromRay(
      source.location,
      { x: 0, y: 1, z: 0 },
      { includePassableBlocks: false }
    )?.block;

    if (!topMostBlock && !headArmor) {
      source.setOnFire(2, true);
    }
  }
}

world.afterEvents.entityHurt.subscribe((e) => {
  const { hurtEntity, damageSource } = e;

  if (
    hurtEntity instanceof Player &&
    zombiePlagueMobs.includes(damageSource.damagingEntity?.typeId) &&
    Math.random() < 0.05
  ) {
    hurtEntity.setDynamicProperty("has_zombie_plague", true);
    createNotif(
      hurtEntity,
      "DISEASE:",
      "You've caught Zombie Plague.",
      "textures/items/rotten_flesh",
      "disease"
    );
  }
});

export { burnFromSunlight };
