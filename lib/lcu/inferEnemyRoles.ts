import { getChampionDetail } from "../analyzeTraits";

import type { Champion, Role } from "../../types/champion";

export const ROLE_ORDER = [
  "TOP",
  "JG",
  "MID",
  "ADC",
  "SUP",
] as const satisfies readonly Role[];

export type ChampionRoleAssignment = Readonly<{
  champion: Champion;
  role: Role;
}>;

function getSuitability(champion: Champion, role: Role): number {
  return getChampionDetail(champion.id)?.roleSuitability[role] ?? 0;
}

export function inferChampionRoles(
  champions: readonly Champion[],
  availableRoles: readonly Role[] = ROLE_ORDER,
): ChampionRoleAssignment[] {
  if (champions.length === 0 || availableRoles.length === 0) {
    return [];
  }

  const selectedChampions = champions.slice(0, availableRoles.length);
  let bestScore = Number.NEGATIVE_INFINITY;
  let bestRoles: Role[] = [];

  function search(
    championIndex: number,
    remainingRoles: readonly Role[],
    assignedRoles: Role[],
    score: number,
  ) {
    if (championIndex === selectedChampions.length) {
      if (score > bestScore) {
        bestScore = score;
        bestRoles = [...assignedRoles];
      }

      return;
    }

    remainingRoles.forEach((role, roleIndex) => {
      search(
        championIndex + 1,
        remainingRoles.filter((_, index) => index !== roleIndex),
        [...assignedRoles, role],
        score + getSuitability(selectedChampions[championIndex], role),
      );
    });
  }

  search(0, availableRoles, [], 0);

  return selectedChampions.map((champion, index) => ({
    champion,
    role: bestRoles[index],
  }));
}

export function inferEnemyRoles(
  champions: readonly Champion[],
): ChampionRoleAssignment[] {
  return inferChampionRoles(champions, ROLE_ORDER);
}
