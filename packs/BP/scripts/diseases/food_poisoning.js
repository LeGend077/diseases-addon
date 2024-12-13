import { world, system } from "@minecraft/server";

const rawFood = [
    "minecraft:porkchop",
    "minecraft:beef",
    "minecraft:mutton",
    "minecraft:chicken",
    "minecraft:rabbit",
    "minecraft:salmon",
    "minecraft:cod"
];

world.afterEvents.itemCompleteUse.subscribe((e) => {
    const { source, itemStack } = e;

    if (
        rawFood.includes(itemStack.typeId) && 
        Math.random() < 0.50 // 50% chance of food poisoning from raw food
    ) {
        source.setDynamicProperty('has_food_poison', true);

        source.addEffect('poison', 200, {
            showParticles: false,
            amplifier: 1
        });
        source.addEffect('nausea', 200, {
            showParticles: false,
            amplifier: 1
        });
        source.addEffect('hunger', 24000, {
            showParticles: false,
            amplifier: 2
        });

        system.runTimeout(() => source.setDynamicProperty('has_food_poison', false), 200)
    }
});