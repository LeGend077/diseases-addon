import { EntityInventoryComponent, GameMode, ItemStack, Player, world } from "@minecraft/server";
import { randInt } from "./index.js";

world.afterEvents.itemCompleteUse.subscribe(ev => {
    const { itemStack, source, useDuration } = ev
    let {x, y, z} = source.location
    if (!(source instanceof Player)) return;

    if (itemStack.typeId === 'di:ender_mushroom_stew') {
        source.setDynamicProperty('has_ender_sickness', false)
        let props = JSON.parse(source.getDynamicProperty('diseaseProperties'))
        props.cantUseEnderPearls=false
        source.setDynamicProperty('diseaseProperties', JSON.stringify(props))
        source.addLevels(10)
        source.tryTeleport({x: x + randInt(-5, 5), y: y, z: z + randInt(-5, 5)})
    }
    if (itemStack.typeId === 'di:herbal_mushroom_stew') {
        source.setDynamicProperty('has_food_poison', false)
    }
    if (itemStack.typeId === 'di:honey_rub') {
        source.setDynamicProperty('has_sunburn', false);
        if (source.getGameMode() == GameMode.creative) return;
        else {
            /**
             * @type {EntityInventoryComponent} a
             * @type {ItemStack} mainHandItem
             */
            source.getComponent("minecraft:inventory").container.setItem(source.selectedSlotIndex, undefined)
            const props = JSON.parse(source.getDynamicProperty('diseaseProperties'))
            props.thirstLostIncrease = 0
            source.setDynamicProperty('diseaseProperties', JSON.stringify(props))
        }
    }
})