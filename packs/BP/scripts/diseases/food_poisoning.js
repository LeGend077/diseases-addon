import { world } from "@minecraft/server";
import { createNotif } from "../index.js";

const rawFood = [
  "minecraft:porkchop",
  "minecraft:beef",
  "minecraft:mutton",
  "minecraft:chicken",
  "minecraft:rabbit",
  "minecraft:salmon",
  "minecraft:cod",
];

world.afterEvents.itemCompleteUse.subscribe((e) => {
  const { source, itemStack } = e;

  if (
    rawFood.includes(itemStack.typeId) &&
    Math.random() < 0.5 // 50% chance of food poisoning from raw food
  ) {
    if (!source.getDynamicProperty('has_food_poison')) {
      createNotif(
        source,
        "DISEASE:",
        "You've caught Food Poison.",
        "textures/ui/nausea_effect",
        "disease"
      );
    }
          
    source.setDynamicProperty("has_food_poison", true);
  }
});