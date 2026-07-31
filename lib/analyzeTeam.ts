import { getChampionDetail } from "./analyzeTraits";

import type { TeamAnalysis } from "../data/championData/types";
import type { Champion } from "../types/champion";

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
