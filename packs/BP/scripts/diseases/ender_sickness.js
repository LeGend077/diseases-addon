import { world } from "@minecraft/server";

const enderSicknessProps = {
  enderPearlCount: 0, // Number of ender pearls thrown by the player
  maxEnderPearl: 8, // Max ender pearls a player needs to throw to get sick
  lastIncrementTime: 0, // Last time (in ms) the enderPearlCount was incremented
};

world.afterEvents.itemUse.subscribe((ev) => {
  const { itemStack, source } = ev;

  if (itemStack.typeId === "minecraft:ender_pearl") {
    const currentTime = Date.now();

    // Check if at least one second has passed since the last increment
    // We need to do this since the use of ender pearls has a one second cooldown
    if (currentTime - enderSicknessProps.lastIncrementTime >= 1000) {
      enderSicknessProps.lastIncrementTime = currentTime;

      if (
        enderSicknessProps.enderPearlCount < enderSicknessProps.maxEnderPearl &&
        Math.random() < 0.5 // 50% chance of incrementing
      ) {
        enderSicknessProps.enderPearlCount++;
      } else {
        source.setDynamicProperty("has_ender_sickness", true);
        // We just need to implement what to do when player gets ender sickness
      }
    }
  }
});
