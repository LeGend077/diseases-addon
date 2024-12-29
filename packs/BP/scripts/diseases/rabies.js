import { world, Player } from "@minecraft/server";
import { createNotif } from "../index.js";

function wait24HourToDie(source) {
  const diseaseProperties = JSON.parse(
    source.getDynamicProperty("diseaseProperties")
  );

  if (diseaseProperties.timeToDieDueRabies > 0) {
    diseaseProperties.timeToDieDueRabies -= 1;
  } else {
    if (
      Math.random() > 0.02 // 2% chance of surviving
    ) {
      source.kill();
    } else {
      source.sendMessage("§aYou've survived rabies!");
      source.setDynamicProperty("has_rabies", false);
      diseaseProperties.timeToDieDueRabies = 0;
    }
  }

  source.setDynamicProperty(
    "diseaseProperties",
    JSON.stringify(diseaseProperties)
  );
}

const animalsToGetRabiesFrom = ["minecraft:wolf", "minecraft:polar_bear"];

world.afterEvents.entityHurt.subscribe((ev) => {
  const { damageSource, hurtEntity } = ev;

  if (
    animalsToGetRabiesFrom.includes(damageSource.damagingEntity?.typeId) &&
    hurtEntity instanceof Player &&
    Math.random() < 0.12 // 12% chance of getting rabies
  ) {
    if (!hurtEntity.getDynamicProperty("has_rabies")) {
      createNotif(
        hurtEntity,
        "DISEASE:",
        "You've caught Rabies.",
        "textures/ui/poison_effect",
        "disease"
      );
    }

    const diseaseProperties = JSON.parse(
      hurtEntity.getDynamicProperty("diseaseProperties")
    );

    diseaseProperties.timeToDieDueRabies = 24000; // change this to 100 when debugging
    hurtEntity.setDynamicProperty("has_rabies", true);
    hurtEntity.setDynamicProperty(
      "diseaseProperties",
      JSON.stringify(diseaseProperties)
    );
  }
});

export { wait24HourToDie };
