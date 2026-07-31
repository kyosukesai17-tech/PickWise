import synergyData from "../src/data/synergies.json";
import { ROLE_INDEX } from "./role";

import type { Champion, Role } from "../types/champion";

type SynergyEntry = Readonly<{
  score: number;
  reason: string;
}>;

type SynergyData = Readonly<
  Record<string, Readonly<Record<string, SynergyEntry>>>
>;

export type ChampionSynergyAnalysis = Readonly<{
  score: number;
  reasons: string[];
}>;

const synergies = synergyData as SynergyData;

function getSynergy(
  firstChampionId: string,
  secondChampionId: string,
): SynergyEntry | undefined {
  return synergies[firstChampionId]?.[secondChampionId]
    ?? synergies[secondChampionId]?.[firstChampionId];
}

export function analyzeChampionSynergy(
  allyTeam: (Champion | null)[],
  selectedRole: Role,
  champion: Champion,
): ChampionSynergyAnalysis {
  const selectedRoleIndex = ROLE_INDEX[selectedRole];
  const matchedChampionIds = new Set<string>();
  const reasons: string[] = [];
  let score = 0;

  allyTeam.forEach((allyChampion, index) => {
    if (
      index === selectedRoleIndex
      || !allyChampion
      || allyChampion.id === champion.id
      || matchedChampionIds.has(allyChampion.id)
    ) {
      return;
    }

    matchedChampionIds.add(allyChampion.id);

    const synergy = getSynergy(champion.id, allyChampion.id);

    if (!synergy) {
      return;
    }

    score += synergy.score;
    reasons.push(synergy.reason);
  });

  return { score, reasons };
}
