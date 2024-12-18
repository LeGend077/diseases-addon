import { system, Player, TicksPerSecond, world } from "@minecraft/server";

import "./thirst.js";

import "./diseases/zombie_plague.js"
import "./diseases/cold.js";
import "./diseases/food_poisoning.js";
import "./diseases/rabies.js";
import "./diseases/ender_sickness.js";
import "./diseases/sunburn.js";

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/*
  Effect duration is automatically infinite unless cured

  'name' property is the dynamic property you put on the player
*/

const Diseases = {
  Rabies: {
    name: 'has_rabies',
    effects: [
      { name: 'slowness', duration: 1, amp: 1 },
      { name: 'nausea', duration: 5, amp: 0  } // Duration 5 for nausea to take effect
    ]
  }
};

system.runInterval(() => {
  world.getAllPlayers().forEach((source) => {
    for (const diseaseName in Diseases) {
      const disease = Diseases[diseaseName];

      if (source.getDynamicProperty(disease.name)) {
        // Apply effects
        disease.effects.forEach((effect) => {
          source.addEffect(effect.name, effect.duration * TicksPerSecond, {
            showParticles: false,
            amplifier: effect.amp
          })
        });

        // Apply custom funcs
        if (disease.funcs) disease.funcs.forEach((func) => func(source));
      }
    }
  });
});

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
    case 'debug:ClearPlayerEntries':
      sourceEntity.clearDynamicProperties();
      sourceEntity.sendMessage('Cleared entries.');
      break;
  }
});