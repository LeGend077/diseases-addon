import { BlockVolume, system, TicksPerSecond, world } from "@minecraft/server";
import { fever } from "./fever";

const coldProps = {
    getColdIn: 600, // 10 minutes to get cold
    timer: 0
};

system.runInterval(() => {
    world.getAllPlayers().forEach(player => {
        const { x, y, z } = player.location;
        
        const posCheck1 = player.dimension.containsBlock(new BlockVolume(player.location, {x: x + 4, y: y + 4, z: z + 4}), {
            includeTypes: ["minecraft:snow", "minecraft:snow_layer"]
        });
        const posCheck2 = player.dimension.containsBlock(new BlockVolume(player.location, {x: x - 4, y: y - 4, z: z - 4}), {
            includeTypes: ["minecraft:snow", "minecraft:snow_layer"]
        });
        
        if (posCheck1 || posCheck2) coldProps.timer++;

        if (coldProps.timer === coldProps.getColdIn) {
            coldProps.timer = 0;

            player.setDynamicProperty('has_cold', true);
            // implement what to do when has cold
            if (Math.random() < 0.40) {fever(player)};
        }
    });
}, TicksPerSecond);