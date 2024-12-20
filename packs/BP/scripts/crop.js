import { EquipmentSlot, GameMode, world } from "@minecraft/server";

/** @type {import("@minecraft/server").BlockCustomComponent} */

const CustomCropGrowthBlockComponent = {
  onRandomTick({ block }) {
    if (Math.random() < 0.3) {
      block.setPermutation(block.permutation.withState("di:stage", 1));
    }
  },
  
  onPlayerInteract({ block, dimension, player }) {
    const equippable = player?.getComponent("minecraft:equippable");
    const mainhandItem = equippable.getEquipment(EquipmentSlot.Mainhand);
    if (mainhandItem?.typeId !== "minecraft:bone_meal")
      return;

    if (player?.getGameMode() === GameMode.creative) {
      block.setPermutation(block.permutation.withState("di:stage", 1));
    } else {
      block.setPermutation(block.permutation.withState("di:stage", 1));

      // Decrement stack
      if (mainhandItem.amount > 1) mainhandItem.amount--;
      else mainhandItem.setItem(undefined);
    }

    // Play effects
    const effectLocation = block.center();
    dimension.playSound("item.bone_meal.use", effectLocation);
    dimension.spawnParticle("minecraft:crop_growth_emitter", effectLocation);
  },
};

world.beforeEvents.worldInitialize.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "di:ginger_crop_growth",
    CustomCropGrowthBlockComponent
  );
});
