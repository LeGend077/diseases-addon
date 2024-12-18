import { Player, world } from "@minecraft/server";

const zombiePlagueMobs = [
    "minecraft:zombie",
    "minecraft:husk",
    "minecraft:zombie_villager",
    "minecraft:zombie_villager_v2",
    "minecraft:zombie_pigman"
];

world.afterEvents.entityHurt.subscribe(e => {
    const {hurtEntity, damageSource} = e;
    if (hurtEntity instanceof Player && zombiePlagueMobs.includes(damageSource.damagingEntity?.typeId) && Math.random() < 0.10) {
        hurtEntity.setDynamicProperty('has_zombie_plague', true)
        
        // implement what to do when zombie plague
    }
})