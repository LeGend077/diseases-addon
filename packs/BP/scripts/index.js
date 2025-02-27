import { system, Player, TicksPerSecond, world } from "@minecraft/server";

import "./thirst.js";
import "./walking_barefoot.js";
import "./crop.js";
import "./cure.js";

import "./diseases/zombie_plague.js";
import { burnFromSunlight } from "./diseases/zombie_plague.js";

import "./diseases/cold.js";
import "./diseases/food_poisoning.js";

import "./diseases/rabies.js";
import { wait24HourToDie } from "./diseases/rabies.js";

import "./diseases/ender_sickness.js";
import { cantUseEnderPearls } from "./diseases/ender_sickness.js";

import "./diseases/sunburn.js";
import { increaseThirstLost } from "./diseases/sunburn.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const padWithTabs = (str, desiredLength) =>
  str + "\t".repeat(desiredLength - str.replace(/§./g, "").length);

function createNotif(source, title, desc, icon, type = "warn") {
  if (
    title.replace(/§./g, "").length > 40 ||
    desc.replace(/§./g, "").length > 40
  ) {
    throw new Error("Your title/description is longer than 40 characters.");
  }

  let typeNum = 0;
  switch (type) {
    // No use to this lol!
    case "warn":
      typeNum += 1;
      break;
    case "disease":
      typeNum += 2;
      system.run(() => source.playSound("mob.ravager.hurt"));
      break;
    case "success":
      typeNum += 3;
      system.run(() => source.playSound("random.toast"));
      break;
  }

  const newTitle = padWithTabs(title, 40),
    newDesc = padWithTabs(desc, 40);
  source.sendMessage(`dis_indi:${newTitle}${newDesc}${typeNum}${icon}`);
}

/*
  Effect duration is automatically infinite unless cured

  'name' property is the dynamic property you put on the player
*/

const Diseases = {
  Rabies: {
    name: "has_rabies",
    effects: [{ name: "slowness", duration: 1, amp: 1 }],
    funcs: [wait24HourToDie],
  },
  Ender_Sickness: {
    name: "has_ender_sickness",
    funcs: [cantUseEnderPearls],
    effects: [{ name: "blindness", duration: 3, amp: 0 }],
  },
  Food_Poison: {
    name: "has_food_poison",
    effects: [{ name: "hunger", duration: 5, amp: 1 }],
  },
  Sunburn: {
    name: "has_sunburn",
    funcs: [increaseThirstLost],
  },
  Cold: {
    name: "has_cold",
    effects: [
      { name: "hunger", duration: 5, amp: 1 },
      { name: "mining_fatigue", duration: 5, amp: 1 },
      { name: "weakness", duration: 5, amp: 1 },
    ],
  },
  Zombie_Plague: {
    name: "has_zombie_plague",
    effects: [
      { name: "hunger", duration: 5, amp: 1 },
      { name: "slowness", duration: 5, amp: 1 },
    ],
    funcs: [burnFromSunlight],
  },
};

system.runInterval(() => {
  world.getAllPlayers().forEach((source) => {
    const diseaseProperties = source.getDynamicProperty("diseaseProperties");
    if (!diseaseProperties)
      source.setDynamicProperty("diseaseProperties", JSON.stringify({}));

    for (const diseaseName in Diseases) {
      const disease = Diseases[diseaseName];

      if (source.getDynamicProperty(disease.name)) {
        // Apply effects
        if (disease.effects) {
          disease.effects.forEach((effect) => {
            source.addEffect(effect.name, effect.duration * TicksPerSecond, {
              showParticles: false,
              amplifier: effect.amp,
            });
          });
        }

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
    case "debug:GetPlayerEntries":
      sourceEntity.sendMessage("Property Entries:");

      for (const id of sourceEntity.getDynamicPropertyIds()) {
        sourceEntity.sendMessage(
          `\n- ${id}: ${sourceEntity.getDynamicProperty(id)}`
        );
      }

      break;
    case "debug:ClearPlayerEntries":
      sourceEntity.clearDynamicProperties();
      sourceEntity.sendMessage("Cleared entries.");
      break;
  }
});

export { clamp, createNotif, randInt };
