import {
  GameMode,
  Player,
  world,
  EntityComponentTypes,
} from "@minecraft/server";
import { randInt } from "./index.js";
import { createNotif } from "./index.js";

world.afterEvents.itemCompleteUse.subscribe((ev) => {
  const { itemStack, source } = ev;
  let { x, y, z } = source.location;

  if (!(source instanceof Player)) return;

  const props = JSON.parse(source.getDynamicProperty("diseaseProperties"));

  switch (itemStack.typeId) {
    case "di:ender_mushroom_stew":
      source.setDynamicProperty("has_ender_sickness", false);
      props.cantUseEnderPearls = false;
      source.setDynamicProperty("diseaseProperties", JSON.stringify(props));

      source.addLevels(10);
      source.tryTeleport({
        x: x + randInt(-5, 5),
        y: y,
        z: z + randInt(-5, 5),
      });

      createNotif(
        source,
        "DISEASE:",
        "You've cured Ender Sickness.",
        "textures/items/ender_pearl",
        "success"
      );

      break;
    case "di:herbal_mushroom_stew_0":
      source.setDynamicProperty("has_food_poison", false);
      createNotif(
        source,
        "DISEASE:",
        "You've cured Food Poison.",
        "textures/ui/nausea_effect",
        "success"
      );
      break;
    case "di:herbal_mushroom_stew_1":
      source.setDynamicProperty("has_cold", false);
      createNotif(
        player,
        "DISEASE:",
        "You've cured Cold.",
        "textures/ui/freeze_heart",
        "success"
      );
      break;
    case "di:honey_rub":
      source.setDynamicProperty("has_sunburn", false);
      if (source.getGameMode() !== GameMode.creative) {
        source.getComponent(EntityComponentTypes.Inventory).container.setItem(source.selectedSlotIndex, undefined);
        props.thirstLostIncrease = 0;
        source.setDynamicProperty("diseaseProperties", JSON.stringify(props));
      }
      createNotif(
        source,
        "DISEASE:",
        "You've cured Sunburn.",
        "textures/gui/newgui/mob_effects/fire_resistance_effect",
        "success"
      );
      break;
    case "di:anti_rot_mushroom_stew":
      source.setDynamicProperty("has_zombie_plague", false)
      break;
  }
});
