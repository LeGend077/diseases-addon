import {
  EntityComponentTypes,
  EntityDamageCause,
  EquipmentSlot,
  system,
  TicksPerSecond,
  GameMode,
  world,
} from "@minecraft/server";

system.runInterval(() => {
  world.getAllPlayers().forEach((player) => {
    if (player.getGameMode() !== GameMode.survival) return;

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
      player.sendMessage("§cOuch! I stepped on something.");
    }
  });
}, TicksPerSecond);
