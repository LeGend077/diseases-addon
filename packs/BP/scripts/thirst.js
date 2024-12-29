import {
  world,
  system,
  TicksPerSecond,
  GameMode,
  EntityComponentTypes,
  Player,
} from "@minecraft/server";
import { clamp } from "./index.js";

const thirstProps = {
  thirstMax: 100, // Maximum thirst a player can have
  thirstAdd: 20, // The amount thats added to thirst when player drinks. This property is also used to amount to subtract when player eats
  thirstLostFromFood: 5,
  loseThirstEverySeconds: 5, // The time (in seconds) should player lose thirst
  foodsToEat: [
    "cooked_porkchop",
    "cooked_beef",
    "cooked_mutton",
    "cooked_chicken",
    "cooked_rabbit",
    "cooked_salmon",
    "cooked_cod",
  ],
};

function addThirstEffect(source, factor, effect, amp) {
  const playerThirst = source.getDynamicProperty("thirst");

  if (playerThirst < factor) {
    source.addEffect(effect, TicksPerSecond * 5, {
      showParticles: false,
      amplifier: amp,
    });
  }
}

system.runInterval(() => {
  world.getAllPlayers().forEach((source) => {
    if (source.getGameMode() !== GameMode.survival) return;

    const playerThirst = source.getDynamicProperty("thirst");

    source.onScreenDisplay.setTitle(`di:${playerThirst}`);

    // Add the effects of thirstness
    addThirstEffect(source, 50, "slowness", 1);
    addThirstEffect(source, 30, "mining_fatigue", 2);
    addThirstEffect(source, 25, "nausea", 1);

    if (playerThirst === undefined) {
      source.setDynamicProperty("thirst", thirstProps.thirstMax);
    }
  });
});

system.runInterval(() => {
  world.getAllPlayers().forEach((source) => {
    if (source.getGameMode() !== GameMode.survival) return;

    const thirstLostIncreaser = JSON.parse(
      source.getDynamicProperty("diseaseProperties")
    ).thirstLostIncrease || 0;
    const playerThirst = source.getDynamicProperty("thirst");

    if ((source.isSprinting || source.isSwimming) && playerThirst > 0) {
      source.setDynamicProperty("thirst", playerThirst - (1 + thirstLostIncreaser));
    }
  });
}, TicksPerSecond * thirstProps.loseThirstEverySeconds);

world.afterEvents.entityDie.subscribe((ev) => {
  const {deadEntity} = ev
  if (deadEntity instanceof Player) {
    // Reset
    deadEntity.setDynamicProperty("thirst", thirstProps.thirstMax);
    deadEntity.setDynamicProperty('has_rabies', false)
    deadEntity.setDynamicProperty('has_food_poison', false)
    deadEntity.setDynamicProperty('has_sunburn', false)
    deadEntity.setDynamicProperty('has_ender_sickness', false)
    deadEntity.setDynamicProperty('has_cold', false)
    deadEntity.setDynamicProperty('has_zombie_plague', false)
    deadEntity.setDynamicProperty('diseaseProperties', '{}')
  }
});

world.afterEvents.itemCompleteUse.subscribe((ev) => {
  const { itemStack, source } = ev;

  if (source.getGameMode() !== GameMode.survival) return;
  let playerThirst = source.getDynamicProperty("thirst");

  const playerHasRabies = source.getDynamicProperty("has_rabies");

  if (itemStack.typeId === "minecraft:potion") {
    if (playerHasRabies) {
      source.sendMessage(
        "§cYou can't drink any liquids due to rabies hydrophobia."
      );

      const inventory = source.getComponent(EntityComponentTypes.Inventory);
      inventory.container.setItem(source.selectedSlotIndex, itemStack);

      return;
    }

    playerThirst += thirstProps.thirstAdd;
  } else if (
    thirstProps.foodsToEat.includes(
      itemStack.typeId.replaceAll("minecraft:", "")
    )
  ) {
    const thirstLostIncreaser = JSON.parse(
      source.getDynamicProperty("diseaseProperties")
    ).thirstLostIncrease || 0;

    playerThirst -= (thirstProps.thirstLostFromFood + thirstLostIncreaser);
  }

  source.setDynamicProperty(
    "thirst",
    clamp(playerThirst, 0, thirstProps.thirstMax)
  );
});
