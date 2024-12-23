import { EquipmentSlot, GameMode, world, system, EntityEquippableComponent, ItemStack } from "@minecraft/server";

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
    /**
     * @type {EntityEquippableComponent} mainSlots
     * @type {ItemStack} mainHandItem
     */
    const mainSlots = player?.getComponent("minecraft:equippable")
    const mainHandItem = mainSlots.getEquipment(EquipmentSlot.Mainhand)
  
    let growth = block.permutation.getState('di:stage')
    if (mainHandItem?.typeId !== "minecraft:bone_meal")
      return;

    if (player?.getGameMode() === GameMode.creative) {
      block.setPermutation(block.permutation.withState("di:stage", 2));
    } else if (growth < 2) {
      block.setPermutation(block.permutation.withState("di:stage", growth + 1));
      
      if (mainHandItem.amount > 1) {
        mainSlots.setEquipment(EquipmentSlot.Mainhand, new ItemStack(mainHandItem.typeId, (mainHandItem.amount - 1)))
      } else {
        mainSlots.setEquipment(EquipmentSlot.Mainhand, undefined)
      }
    } else if (growth == 2) {
      block.setPermutation(block.permutation.withState("di:stage", 2));
      if (mainHandItem.amount > 1) {
        mainSlots.setEquipment(EquipmentSlot.Mainhand, new ItemStack(mainHandItem.typeId, (mainHandItem.amount - 1)))
      } else {
        mainSlots.setEquipment(EquipmentSlot.Mainhand, undefined)
      }
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
