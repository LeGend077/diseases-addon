import { world, system } from "@minecraft/server";

const rawFood = [
    "minecraft:porkchop",
    "minecraft:beef",
    "minecraft:mutton",
    "minecraft:chicken",
    "minecraft:rabbit"
];

world.afterEvents.itemCompleteUse.subscribe(e => {
    const { source, itemStack } = e;
    // 50% chance of food poisoning from raw food
    if (rawFood.includes(itemStack.typeId) && Math.random() < 0.50 && !source.hasTag('poisoned')) {
        
        source.addTag('poisoned');
        system.run(() => {
            source.addEffect('poison', 200, {
                "showParticles": false,
                "amplifier": 1
            })
            source.addEffect('nausea', 200, {
                "showParticles": false,
                "amplifier": 1
            })
            source.addEffect('hunger', 24000, {
                "showParticles": false,
                "amplifier": 2
            })
            
        })
        system.runTimeout(()=> {
            source.removeTag('poisoned')
        }, 200)
    }
});