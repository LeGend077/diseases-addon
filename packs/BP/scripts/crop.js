import { EquipmentSlot, GameMode, world, system } from "@minecraft/server";

/** @type {import("@minecraft/server").BlockCustomComponent} */

const CustomCropGrowthBlockComponent = {
  onRandomTick({ block }) {
    let growth = block.permutation.getState('di:stage')
    if (Math.random() < 0.35 && growth < 2) {
      block.setPermutation(block.permutation.withState("di:stage", growth + 1));
    } else if (growth == 2) {
      block.setPermutation(block.permutation.withState("di:stage", 2));
    }
  },
  onPlayerInteract({ block, dimension, player }) {
    const equippable = player?.getComponent("minecraft:equippable");
    const mainhandItem = equippable.getEquipment(EquipmentSlot.Mainhand);
    let growth = block.permutation.getState('di:stage')
    if (mainhandItem?.typeId !== "minecraft:bone_meal")
      return;

    if (player?.getGameMode() === GameMode.creative) {
      block.setPermutation(block.permutation.withState("di:stage", 2));
    } else if (growth < 2) {
      block.setPermutation(block.permutation.withState("di:stage", growth + 1));
      system.run(() => { mainhandItem.amount -= 1; }) // not decreasing
    } else if (growth == 2) {
      block.setPermutation(block.permutation.withState("di:stage", 2));
      system.run(() => { mainhandItem.amount -= 1; }) // not decreasing
    }


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
