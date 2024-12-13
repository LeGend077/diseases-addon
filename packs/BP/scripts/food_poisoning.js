import { EntityType, system, world } from "@minecraft/server";

world.afterEvents.itemCompleteUse.subscribe(e => {
    const {source, itemStack, useDuration} = e

    if (source.typeId !== "minecraft:player") return;

    if (itemStack.typeId == "minecraft:porkchop" | itemStack.typeId == "minecraft:beef" | itemStack.typeId == "minecraft:mutton" | itemStack.typeId == "minecraft:rabbit" | itemStack.typeId == "minecraft:chicken") {
        let chance = Math.random().toFixed(0)
        if (chance == 1) {source.setDynamicProperty('has_foodpoisoning', true)}
        else { return }
    }
})