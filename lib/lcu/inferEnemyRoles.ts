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

export type EnemyRoleCandidate = Readonly<{
  champion: Champion;
  hasSmite: boolean;
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
  candidates: readonly EnemyRoleCandidate[],
): ChampionRoleAssignment[] {
  const smiteCandidates = candidates.filter((candidate) => candidate.hasSmite);

  if (smiteCandidates.length !== 1) {
    return inferChampionRoles(
      candidates.map((candidate) => candidate.champion),
      ROLE_ORDER,
    );
  }

  const jungler = smiteCandidates[0];
  const remainingChampions = candidates
    .filter((candidate) => candidate !== jungler)
    .map((candidate) => candidate.champion);
  const remainingAssignments = inferChampionRoles(
    remainingChampions,
    ROLE_ORDER.filter((role) => role !== "JG"),
  );
  const remainingRoles = new Map(
    remainingAssignments.map(({ champion, role }) => [champion, role]),
  );

  return candidates.map((candidate) => ({
    champion: candidate.champion,
    role:
      candidate === jungler
        ? "JG"
        : remainingRoles.get(candidate.champion)!,
  }));
}
