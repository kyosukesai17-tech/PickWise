import { getChampionDetail } from "../analyzeTraits";
import { ROLE_ORDER } from "../lcu/inferEnemyRoles";
import { getPrototypeMetaRoleEntry } from "./metaRoleData";

import type { Champion, Role } from "../../types/champion";
import type { MetaRoleWeights } from "../../types/metaRole";

export const META_ROLE_WEIGHT_PRESETS = {
  META_65: { suitability: 0.35, meta: 0.65 },
  BALANCED: { suitability: 0.5, meta: 0.5 },
  SUITABILITY_65: { suitability: 0.65, meta: 0.35 },
} as const satisfies Record<string, MetaRoleWeights>;

export type PrototypeRoleAssignment = Readonly<{
  champion: Champion;
  role: Role;
  score: number;
}>;

function getNormalizedSuitability(champion: Champion, role: Role): number {
  const rating = getChampionDetail(champion.id)?.roleSuitability[role] ?? 0;

  return rating / 5;
}

export function getPrototypeRoleScore(
  champion: Champion,
  role: Role,
  weights: MetaRoleWeights,
): number {
  const suitability = getNormalizedSuitability(champion, role);
  const metaEntry = getPrototypeMetaRoleEntry(champion.id);

  if (!metaEntry) {
    return suitability;
  }

  const rolePickShare = metaEntry.rolePickShare[role] ?? 0;

  return suitability * weights.suitability + rolePickShare * weights.meta;
}

export function inferRolesWithPrototypeMeta(
  champions: readonly Champion[],
  weights: MetaRoleWeights,
  availableRoles: readonly Role[] = ROLE_ORDER,
): PrototypeRoleAssignment[] {
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
        score + getPrototypeRoleScore(
          selectedChampions[championIndex],
          role,
          weights,
        ),
      );
    });
  }

  search(0, availableRoles, [], 0);

  return selectedChampions.map((champion, index) => ({
    champion,
    role: bestRoles[index],
    score: getPrototypeRoleScore(champion, bestRoles[index], weights),
  }));
}
