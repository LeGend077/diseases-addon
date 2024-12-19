import { world } from "@minecraft/server";
import { createNotif } from "../index.js";

const enderSicknessProps = {
  enderPearlCount: 0, // Number of ender pearls thrown by the player
  maxEnderPearl: 8, // Max ender pearls a player needs to throw to get sick
  lastIncrementTime: 0, // Last time (in ms) the enderPearlCount was incremented
};

function cantUseEnderPearls(source) {
  const diseaseProperties = JSON.parse(
    source.getDynamicProperty("diseaseProperties")
  );
  diseaseProperties.cantUseEnderPearls = true;

  source.setDynamicProperty(
    "diseaseProperties",
    JSON.stringify(diseaseProperties)
  );
}

world.beforeEvents.itemUse.subscribe((ev) => {
  const { itemStack, source } = ev;
  const diseaseProperties = JSON.parse(
    source.getDynamicProperty("diseaseProperties")
  );

  if (itemStack.typeId === "minecraft:ender_pearl") {
    if (diseaseProperties.cantUseEnderPearls) {
      ev.cancel = true;
      source.sendMessage(
        "§cYou can't throw ender pearls due to ender sickness."
      );

      return;
    }

    const currentTime = Date.now();

    // Check if at least one second has passed since the last increment
    // We need to do this since the use of ender pearls has a one second cooldown
    if (currentTime - enderSicknessProps.lastIncrementTime >= 1000) {
      enderSicknessProps.lastIncrementTime = currentTime;

      if (
        enderSicknessProps.enderPearlCount < enderSicknessProps.maxEnderPearl
      ) {
        if (Math.random() < 0.5) {
          // 50% chance of incrementing
          enderSicknessProps.enderPearlCount++;
        }
      } else {
        if (!source.getDynamicProperty("has_ender_sickness")) {
          createNotif(
            source,
            "DISEASE:",
            "You've caught Ender Sickness.",
            "textures/items/ender_pearl",
            "disease"
          );
        }

        enderSicknessProps.enderPearlCount = 0;
        source.setDynamicProperty("has_ender_sickness", true);
      }
    }
  }
});

export { cantUseEnderPearls };
