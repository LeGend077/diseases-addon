import "./thirst.js";
import "./diseases/cold.js";
import "./diseases/food_poisoning.js";
import "./diseases/rabies.js";
import "./diseases/ender_sickness.js";
import "./diseases/sunburn.js";

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}