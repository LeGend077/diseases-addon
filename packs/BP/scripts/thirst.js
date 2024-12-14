import { world, system, TicksPerSecond } from "@minecraft/server";

const thirstProps = {
  thirstMax: 100, // Maximum thirst a player can have
  thirstAdd: 20, // The amount thats added to thirst when player drinks. This property is also used to amount to subtract when player eats
  loseThirstEverySeconds: 5, // The time (in seconds) should player lose thirst
  foodsToEat: [
    "cooked_porkchop",
    "cooked_beef",
    "cooked_mutton",
    "cooked_chicken",
    "cooked_rabbit",
    "cooked_salmon",
    "cooked_cod"
  ]
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function addThirstEffect(source, factor, effect, amp) {
  const playerThirst = source.getDynamicProperty('thirst');

  if (playerThirst < factor) {
    source.addEffect(effect, TicksPerSecond, {
      showParticles: false,
      amplifier: amp
    });
  }
}

system.runInterval(() => {
  world.getAllPlayers().forEach((source) => {
    const playerThirst = source.getDynamicProperty('thirst');

    source.onScreenDisplay.setTitle(`di:${playerThirst}`);

    // Add the effects of thirstness
    addThirstEffect(source, 50, 'slowness', 1);
    addThirstEffect(source, 30, 'mining_fatigue', 2);
    addThirstEffect(source, 25, 'nausea', 1);

    if (playerThirst === undefined) {
      source.setDynamicProperty('thirst', thirstProps.thirstMax);
    }
  });
});

system.runInterval(() => {
  world.getAllPlayers().forEach((source) => {
    const playerThirst = source.getDynamicProperty('thirst');

    if ((source.isSprinting || source.isSwimming) && playerThirst > 0) {
      source.setDynamicProperty('thirst', playerThirst - 1)
    }
  });
}, TicksPerSecond * thirstProps.loseThirstEverySeconds);

world.afterEvents.itemCompleteUse.subscribe((ev) => {
  const { itemStack, source } = ev;

  let playerThirst = source.getDynamicProperty('thirst');

  if (itemStack.typeId === 'minecraft:potion') {
    playerThirst += thirstProps.thirstAdd;
  } else if (thirstProps.foodsToEat.includes(itemStack.typeId.replaceAll('minecraft:', ''))) {
    playerThirst -= thirstProps.thirstAdd;
  }

  source.setDynamicProperty('thirst', clamp(playerThirst, 0, thirstProps.thirstMax));
});