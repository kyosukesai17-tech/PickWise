import { getChampionDetail } from "./analyzeTraits";
import { TRAITS } from "../src/constants/traits";
import { ROLE_INDEX } from "./role";

import type {
  Champion,
  Role,
} from "../types/champion";

export interface RoleOpponentAnalysis {
  opponent: Champion | null;
  hasOpponent: boolean;

  isMelee: boolean;
  isRanged: boolean;

  isAssassin: boolean;
  hasEngage: boolean;
  hasPokeOrSiege: boolean;
  hasCatch: boolean;
  hasHighWaveClear: boolean;
}

export function analyzeRoleOpponent(
  enemyTeam: (Champion | null)[],
  selectedRole: Role,
): RoleOpponentAnalysis {
  const opponent =
    enemyTeam[ROLE_INDEX[selectedRole]] ?? null;

  if (!opponent) {
    return {
      opponent: null,
      hasOpponent: false,

      isMelee: false,
      isRanged: false,

      isAssassin: false,
      hasEngage: false,
      hasPokeOrSiege: false,
      hasCatch: false,
      hasHighWaveClear: false,
    };
  }

  const detail = getChampionDetail(opponent.id);

  if (!detail) {
    return {
      opponent,
      hasOpponent: true,

      isMelee: false,
      isRanged: false,

      isAssassin: false,
      hasEngage: false,
      hasPokeOrSiege: false,
      hasCatch: false,
      hasHighWaveClear: false,
    };
  }

  return {
    opponent,
    hasOpponent: true,

    isMelee:
      detail.rangeType === "Melee",

    isRanged:
      detail.rangeType === "Ranged",

    isAssassin:
      detail.archetypes.includes("ASSASSIN"),

    hasEngage:
      detail.traits.includes(
        TRAITS.ENGAGE,
      ),

    hasPokeOrSiege:
      detail.traits.includes(
        TRAITS.POKE,
      ) ||
      detail.traits.includes(
        TRAITS.SIEGE,
      ),

    hasCatch:
      detail.archetypes.includes("CATCH"),

    hasHighWaveClear:
      detail.ratings.waveClear >= 4,
  };
}
