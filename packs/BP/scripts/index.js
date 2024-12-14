import { system, Player } from "@minecraft/server";

import "./thirst.js";

import "./diseases/cold.js";
import "./diseases/food_poisoning.js";
import "./diseases/rabies.js";
import "./diseases/ender_sickness.js";
import "./diseases/sunburn.js";

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

system.afterEvents.scriptEventReceive.subscribe((ev) => {
  const { id, sourceEntity } = ev;
  if (!sourceEntity instanceof Player) return;

  switch (id) {
    case 'debug:GetPlayerEntries':
      sourceEntity.sendMessage('Property Entries:');

      for (const id of sourceEntity.getDynamicPropertyIds()) {
        sourceEntity.sendMessage(`\n- ${id}: ${sourceEntity.getDynamicProperty(id)}`);
      }

      break;
  }
});