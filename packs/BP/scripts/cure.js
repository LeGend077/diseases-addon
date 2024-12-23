import { Container, ContainerSlot, EntityEquippableComponent, EntityInventoryComponent, EntityIsHiddenWhenInvisibleComponent, EquipmentSlot, GameMode, ItemStack, Player, world } from "@minecraft/server";

world.afterEvents.itemCompleteUse.subscribe(ev => {
    const { itemStack, source, useDuration } = ev
    if (!(source instanceof Player)) return;

    if (itemStack.typeId === 'di:honey_rub') {
        source.setDynamicProperty('has_sunburn', false);
        if (source.getGameMode() == GameMode.creative) return;
        else {
            /**
             * @type {EntityEquippableComponent} mainSlots
             * @type {ItemStack} mainHandItem
             */
            const mainSlots = source.getComponent("minecraft:equippable")
            const mainHandItem = mainSlots.getEquipment(EquipmentSlot.Mainhand)
            mainSlots.setEquipment(EquipmentSlot.Mainhand, undefined)

            const props = JSON.parse(source.getDynamicProperty('diseaseProperties'))
            props.thirstLostIncrease = 0
            source.setDynamicProperty('diseaseProperties', JSON.stringify(props))
            // console.warn('done')
        }
    }
})