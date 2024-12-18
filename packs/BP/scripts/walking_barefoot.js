import { EntityComponentTypes, EntityDamageCause, EquipmentSlot, system, TicksPerSecond, world } from "@minecraft/server";
system.runInterval(() => {
    world.getAllPlayers().forEach(player => {
        if (player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Feet)) {
            return;
        } else if (player.isSprinting && !player.isFlying && !player.isSwimming && Math.random() < 0.02) {
            player.applyDamage(1, {
                "cause": EntityDamageCause.contact
            })

            // 1.5% chance of damage from walking barefoot..
        }
    })
}, TicksPerSecond)