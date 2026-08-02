import { getChampionDetail } from "./analyzeTraits";
import { ROLE_INDEX } from "./role";

import type { Champion, Role } from "../types/champion";

export interface TeamAnalysis {
  apCount: number;
  adCount: number;
  frontlineCount: number;
  ccScore: number;
  needAP: boolean;
  needAD: boolean;
  needTank: boolean;
  needCC: boolean;
}

export type DamageBias = "AD" | "AP" | null;

export interface DamageBalanceAnalysis {
  adCount: number;
  apCount: number;
  evaluatedChampionCount: number;
  bias: DamageBias;
}

export function analyzeTeam(
  team: (Champion | null)[]
): TeamAnalysis {
  let apCount = 0;
  let adCount = 0;
  let frontlineCount = 0;
  let ccScore = 0;

  for (const champion of team) {
    if (!champion) continue;

    const detail = getChampionDetail(champion.id);

    if (!detail) continue;

    switch (detail.damageType) {
      case "AP":
        apCount++;
        break;

      case "AD":
        adCount++;
        break;

      case "Mixed":
        apCount++;
        adCount++;
        break;
    }

    if (detail.archetypes.includes("FRONTLINE")) {
      frontlineCount++;
    }

    ccScore += detail.ratings.cc;
  }

  return {
    apCount,
    adCount,
    frontlineCount,
    ccScore,

    needAP: apCount < 2,
    needAD: adCount < 2,
    needTank: frontlineCount < 2,
    needCC: ccScore < 10,
  };
}

export function analyzeDamageBalance(
  team: (Champion | null)[],
  selectedRole: Role,
): DamageBalanceAnalysis {
  let adCount = 0;
  let apCount = 0;
  let evaluatedChampionCount = 0;
  const selectedRoleIndex = ROLE_INDEX[selectedRole];

  team.forEach((champion, index) => {
    if (!champion || index === selectedRoleIndex) {
      return;
    }

    const detail = getChampionDetail(champion.id);

    if (!detail) {
      return;
    }

    evaluatedChampionCount++;

    switch (detail.damageType) {
      case "AD":
        adCount++;
        break;

      case "AP":
        apCount++;
        break;

      case "Mixed":
        adCount += 0.5;
        apCount += 0.5;
        break;
    }
  });

  const totalDamageWeight = adCount + apCount;
  let bias: DamageBias = null;

  if (evaluatedChampionCount >= 2 && totalDamageWeight > 0) {
    if (apCount / totalDamageWeight >= 0.75) {
      bias = "AP";
    } else if (adCount / totalDamageWeight >= 0.75) {
      bias = "AD";
    }
  }

  return {
    adCount,
    apCount,
    evaluatedChampionCount,
    bias,
  };
}
