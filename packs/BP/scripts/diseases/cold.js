import { BlockVolume, system, TicksPerSecond, world } from "@minecraft/server";

const coldProps = {
    getColdIn: 600, // 10 minutes to get cold
    timer: 0
}

system.runInterval(() => {
    world.getAllPlayers().forEach(player => {
        let posCheck1 = player.dimension.containsBlock(new BlockVolume(player.location, {x: player.location.x + 16, y: player.location.y + 16, z: player.location.z + 16}), {
            "includeTypes": ["minecraft:snow", "minecraft:snow_layer"]
        })
        let posCheck2 = player.dimension.containsBlock(new BlockVolume(player.location, {x: player.location.x - 16, y: player.location.y - 8, z: player.location.z - 16}), {
            "includeTypes": ["minecraft:snow", "minecraft:snow_layer"]
        })
        
        if (player.getDynamicProperty('has_cold') == undefined) {
            player.setDynamicProperty('has_cold', false)
        }
        
        if (posCheck1 || posCheck2){
            coldProps.timer++
        }

        if (coldProps.timer === coldProps.getColdIn) {
            coldProps.timer = 0
            player.setDynamicProperty('has_cold', true)


            // implement what to do when has cold
        }
    })
}, TicksPerSecond)