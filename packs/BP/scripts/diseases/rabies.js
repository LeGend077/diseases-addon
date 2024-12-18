import { world, Player } from "@minecraft/server";

const animalsToGetRabiesFrom = [
  "minecraft:wolf",
  "minecraft:polar_bear"
];

world.afterEvents.entityHurt.subscribe((ev) => {
  const { damageSource, hurtEntity } = ev;

  if (
    animalsToGetRabiesFrom.includes(damageSource.damagingEntity?.typeId) &&
    hurtEntity instanceof Player &&
    Math.random() < 0.12 // 12% chance of getting rabies
  ) {
    hurtEntity.setDynamicProperty('has_rabies', true);
    // We just need to implement what to do when player gets rabies
  }
});