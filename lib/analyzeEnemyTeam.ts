import { getChampionDetail } from "./analyzeTraits";
import { TRAITS } from "../src/constants/traits";

import type { Champion } from "../types/champion";

export type EnemyCompositionType =
  | "DIVE"
  | "POKE"
  | "FRONT_TO_BACK"
  | "CATCH";

export interface EnemyTeamAnalysis {
  selectedCount: number;

  diveThreatCount: number;
  meleeCount: number;
  rangedCount: number;
  frontlineCount: number;
  enemyAssassinCount: number;
  enemyEngageCount: number;
  enemyCatchCount: number;
  enemyPokeCount: number;
  enemyCcScore: number;
  enemyCarryCount: number;
  compositionTypes: EnemyCompositionType[];

  hasHeavyDive: boolean;
  isMeleeHeavy: boolean;
  isRangedHeavy: boolean;
  hasMultipleFrontlines: boolean;
}

export function analyzeEnemyTeam(
  team: (Champion | null)[],
): EnemyTeamAnalysis {
  let selectedCount = 0;

  let diveThreatCount = 0;
  let meleeCount = 0;
  let rangedCount = 0;
  let frontlineCount = 0;
  let enemyAssassinCount = 0;
  let enemyEngageCount = 0;
  let enemyCatchCount = 0;
  let enemyPokeCount = 0;
  let enemyCcScore = 0;
  let enemyCarryCount = 0;

  for (const champion of team) {
    if (!champion) continue;

    const detail = getChampionDetail(champion.id);

    if (!detail) continue;

    selectedCount++;

    const isDiveThreat =
      detail.archetypes.includes("ASSASSIN") ||
      detail.traits.includes(TRAITS.ENGAGE);

    if (isDiveThreat) {
      diveThreatCount++;
    }

    if (detail.rangeType === "Melee") {
      meleeCount++;
    }

    if (detail.rangeType === "Ranged") {
      rangedCount++;
    }

    if (
      detail.archetypes.includes("FRONTLINE")
    ) {
      frontlineCount++;
    }

    if (detail.archetypes.includes("ASSASSIN")) {
      enemyAssassinCount++;
    }

    if (detail.traits.includes(TRAITS.ENGAGE)) {
      enemyEngageCount++;
    }

    if (detail.archetypes.includes("CATCH")) {
      enemyCatchCount++;
    }

    if (detail.traits.includes(TRAITS.POKE)) {
      enemyPokeCount++;
    }

    enemyCcScore += detail.ratings.cc;

    if (detail.archetypes.includes("CARRY")) {
      enemyCarryCount++;
    }
  }

  const compositionTypes: EnemyCompositionType[] = [];

  if (enemyAssassinCount + enemyEngageCount >= 3) {
    compositionTypes.push("DIVE");
  }

  if (enemyPokeCount >= 3) {
    compositionTypes.push("POKE");
  }

  if (frontlineCount >= 2 && enemyCarryCount >= 2) {
    compositionTypes.push("FRONT_TO_BACK");
  }

  if (enemyCatchCount >= 2 && enemyCcScore >= 12) {
    compositionTypes.push("CATCH");
  }

  return {
    selectedCount,

    diveThreatCount,
    meleeCount,
    rangedCount,
    frontlineCount,
    enemyAssassinCount,
    enemyEngageCount,
    enemyCatchCount,
    enemyPokeCount,
    enemyCcScore,
    enemyCarryCount,
    compositionTypes,

    hasHeavyDive:
      diveThreatCount >= 2,

    isMeleeHeavy:
      meleeCount >= 3,

    isRangedHeavy:
      rangedCount >= 3,

    hasMultipleFrontlines:
      frontlineCount >= 2,
  };
}
