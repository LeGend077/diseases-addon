import { Player, world } from "@minecraft/server";
import { createNotif } from "../index.js";

const zombiePlagueMobs = [
  "minecraft:zombie",
  "minecraft:husk",
  "minecraft:zombie_villager",
  "minecraft:zombie_villager_v2",
  "minecraft:zombie_pigman",
];

world.afterEvents.entityHurt.subscribe((e) => {
  const { hurtEntity, damageSource } = e;

  if (
    hurtEntity instanceof Player &&
    zombiePlagueMobs.includes(damageSource.damagingEntity?.typeId) &&
    Math.random() < 0.05
  ) {
    hurtEntity.setDynamicProperty("has_zombie_plague", true)
    createNotif(
      hurtEntity,
      "DISEASE:",
      "You've caught Zombie Plague.",
      "textures/ui/freeze_heart",
      "disease"
    );
  }
});
