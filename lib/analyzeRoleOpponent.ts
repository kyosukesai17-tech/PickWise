import {
  championData,
  defaultChampionData,
} from "../data/championData";

import { TRAITS } from "../data/championData/traits";
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

  const data =
    championData[opponent.id] ??
    defaultChampionData;

  return {
    opponent,
    hasOpponent: true,

    isMelee:
      data.attributes.range === "MELEE",

    isRanged:
      data.attributes.range === "RANGED",

    isAssassin:
      data.traits.includes(
        TRAITS.ASSASSIN,
      ),

    hasEngage:
      data.traits.includes(
        TRAITS.ENGAGE,
      ),

    hasPokeOrSiege:
      data.traits.includes(
        TRAITS.POKE,
      ) ||
      data.traits.includes(
        TRAITS.SIEGE,
      ),

    hasCatch:
      data.traits.includes(
        TRAITS.CATCH,
      ),

    hasHighWaveClear:
      data.ratings.waveClear >= 4,
  };
}