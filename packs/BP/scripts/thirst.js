import { world, system } from "@minecraft/server";

function thirst(factor, effect, amp) {
    world.getAllPlayers().forEach(s => {
        if (world.scoreboard.getObjective('thirst').getScore(s) < factor) {
            s.addEffect(effect, 20 * 30, {
                "showParticles": false,
                "amplifier": amp
            })
        }
    })
}

system.runInterval(() => {
    world.getAllPlayers().forEach(s => {
        s.dimension.runCommand(`titleraw ${s.name} title {"rawtext": [{"text": "di:"}, {"score":{"name": "${s.name}","objective": "thirst"}}]}`)
    })
}, 1)

system.runInterval(() => {
    world.getAllPlayers().forEach(
        (source) => {
            world.scoreboard.getObjective('thirst').addScore(source, -1)
        }
    )
    thirst(50, 'slowness', 1)
    thirst(30, 'mining_fatigue', 2)
    thirst(25, 'nausea', 1)
    world.getAllPlayers().forEach(s => {
        if (world.scoreboard.getObjective('thirst').getScore(s) === 0) {
            world.scoreboard.getObjective('thirst').setScore(s, 100)
            s.kill()
        }
    })
    world.getAllPlayers().forEach(s => {
        if (world.scoreboard.getObjective('thirst').getScore(s) > 100) {
            world.scoreboard.getObjective('thirst').setScore(s, 100)
        }
    })
}, 600)

world.afterEvents.itemCompleteUse.subscribe(event => {
    if (event.itemStack.typeId === "minecraft:potion") {
        if (world.scoreboard.getObjective('thirst').getScore(event.source) <= 80) {
            world.scoreboard.getObjective('thirst').addScore(event.source, 20)
        } else if (world.scoreboard.getObjective('thirst').getScore(event.source) > 80) {
            world.scoreboard.getObjective('thirst').setScore(event.source, 100)
        }
    }
})