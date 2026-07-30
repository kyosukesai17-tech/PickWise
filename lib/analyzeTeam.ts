import {
  championData,
  defaultChampionData,
} from "../data/championData";

import { TRAITS } from "../data/championData/traits";

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

    const data =
      championData[champion.id] ??
      defaultChampionData;

    switch (data.profile.damageType) {
      case "AP":
        apCount++;
        break;

      case "AD":
        adCount++;
        break;

      case "MIXED":
        apCount++;
        adCount++;
        break;
    }

    if (
      data.traits.includes(
        TRAITS.FRONTLINE
      )
    ) {
      frontlineCount++;
    }

    ccScore += data.profile.cc;
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