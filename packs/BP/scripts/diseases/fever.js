import { Player, system, world } from "@minecraft/server";

const feverInducingEntities = [
    "minecraft:zombie",
    "minecraft:spider"
];

/**
 * 
 * @param {Player} player 
 */
export function fever(player) {
    // implement what to do if has fever
}

world.afterEvents.entityHurt.subscribe(e => {
    const {hurtEntity, damageSource} = e;

    if (hurtEntity instanceof Player && feverInducingEntities.includes(damageSource.damagingEntity?.typeId) && Math.random() < 0.10) {
        hurtEntity.setDynamicProperty('has_fever', true)
        fever(hurtEntity);
    }
})