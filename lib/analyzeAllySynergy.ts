import { getChampionDetail } from "./analyzeTraits";
import { TRAITS } from "../src/constants/traits";

import type { Champion } from "../types/champion";

export interface AllySynergyAnalysis {
  selectedCount: number;

  frontlineCount: number;
  engageCount: number;
  peelCount: number;
  pokeCount: number;
  carryCount: number;
  assassinCount: number;
  catchCount: number;
  siegeCount: number;

  hasPokeCore: boolean;
  hasEngageCore: boolean;
  hasCarry: boolean;
  hasCatchCore: boolean;
}

export function analyzeAllySynergy(
  team: (Champion | null)[],
): AllySynergyAnalysis {
  let selectedCount = 0;

  let frontlineCount = 0;
  let engageCount = 0;
  let peelCount = 0;
  let pokeCount = 0;
  let carryCount = 0;
  let assassinCount = 0;
  let catchCount = 0;
  let siegeCount = 0;

  for (const champion of team) {
    if (!champion) continue;

    const detail = getChampionDetail(champion.id);

    if (!detail) continue;

    selectedCount++;

    if (detail.archetypes.includes("FRONTLINE")) {
      frontlineCount++;
    }

    if (detail.traits.includes(TRAITS.ENGAGE)) {
      engageCount++;
    }

    if (detail.traits.includes(TRAITS.PEEL)) {
      peelCount++;
    }

    if (detail.traits.includes(TRAITS.POKE)) {
      pokeCount++;
    }

    if (detail.archetypes.includes("CARRY")) {
      carryCount++;
    }

    if (detail.archetypes.includes("ASSASSIN")) {
      assassinCount++;
    }

    if (detail.archetypes.includes("CATCH")) {
      catchCount++;
    }

    if (detail.traits.includes(TRAITS.SIEGE)) {
      siegeCount++;
    }
  }

  return {
    selectedCount,

    frontlineCount,
    engageCount,
    peelCount,
    pokeCount,
    carryCount,
    assassinCount,
    catchCount,
    siegeCount,

    hasPokeCore:
      pokeCount + siegeCount >= 2,

    hasEngageCore:
      engageCount >= 2,

    hasCarry:
      carryCount >= 1,

    hasCatchCore:
      catchCount + assassinCount >= 2,
  };
}
