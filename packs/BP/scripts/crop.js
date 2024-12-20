import { EquipmentSlot, GameMode, world } from "@minecraft/server";

/** @type {import("@minecraft/server").BlockCustomComponent} */
const CustomCropGrowthBlockComponent = {
    onRandomTick({ block }) {
	if (Math.random() < 0.3) {
        block.setPermutation(
            block.permutation.withState("di:stage", 1)
        );
	}
    },
    onPlayerInteract({ block, dimension, player }) {
        if (!player) return;

        const equippable = player.getComponent("minecraft:equippable");
        if (!equippable) return;

        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainhand.hasItem() || mainhand.typeId !== "minecraft:bone_meal")
            return;

        if (player.getGameMode() === GameMode.creative) {
            block.setPermutation(block.permutation.withState("di:stage", 1));
        } else {
            let growth = block.permutation.getState("di:stage");
            block.setPermutation(
                block.permutation.withState("di:stage", 1)
            );

            // Decrement stack
            if (mainhand.amount > 1) mainhand.amount--;
            else mainhand.setItem(undefined);
        }

        // Play effects
        const effectLocation = block.center();
        dimension.playSound("item.bone_meal.use", effectLocation);
        dimension.spawnParticle(
            "minecraft:crop_growth_emitter",
            effectLocation
        );
    },
};

world.beforeEvents.worldInitialize.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent(
        "di:ginger_crop_growth",
        CustomCropGrowthBlockComponent
    );
});
