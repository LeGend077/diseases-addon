import { world, Player } from "@minecraft/server";
import { createNotif } from '../index.js';

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
    if (!hurtEntity.getDynamicProperty('has_rabies')) {
      createNotif(hurtEntity, 'DISEASE:', 'You\'ve caught rabies', 'textures/ui/poison_effect', 'disease');
    }

    hurtEntity.setDynamicProperty('has_rabies', true);
  }
});