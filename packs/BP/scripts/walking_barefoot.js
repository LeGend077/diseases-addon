import {
  EntityComponentTypes,
  EntityDamageCause,
  EquipmentSlot,
  system,
  TicksPerSecond,
  world,
} from "@minecraft/server";

system.runInterval(() => {
  world.getAllPlayers().forEach((player) => {
    const isWearingSlippers = player
      .getComponent(EntityComponentTypes.Equippable)
      .getEquipment(EquipmentSlot.Feet);

    if (
      player.isSprinting &&
      !player.isFlying &&
      !player.isSwimming &&
      Math.random() < 0.02 &&
      !isWearingSlippers
    ) {
      player.applyDamage(1, {
        cause: EntityDamageCause.contact,
      });

      // 2% chance of damage from walking barefoot..
    }
  });
}, TicksPerSecond);
