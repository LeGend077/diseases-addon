import { GameMode, Player, world } from "@minecraft/server";

world.afterEvents.itemCompleteUse.subscribe(ev => {
    const { itemStack, source, useDuration } = ev
    if (!(source instanceof Player)) return;

    if (itemStack.typeId === 'di:honey_rub') {
        source.setDynamicProperty('has_sunburn', false);
        if (source.getGameMode() == GameMode.creative) return;
        else {
            source.runCommand('clear @s di:honey_rub 0 1') // TODO
            const props = JSON.parse(source.getDynamicProperty('diseaseProperties'))
            props.thirstLostIncrease = 0
            source.setDynamicProperty('diseaseProperties', JSON.stringify(props))
            // console.warn('done')
        }
    }
})