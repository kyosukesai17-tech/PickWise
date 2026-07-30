import { analyzeTeam } from "./analyzeTeam";
import { championData, defaultChampionData } from "../data/championData";
import { TRAITS } from "../data/championData/traits";
import { SCORE } from "./scoring";

import { REASON } from "../types/recommendation";
import type {
  RecommendationReason,
} from "../types/recommendation";

import type { Champion } from "../types/champion";

export function calculateScore(
  allyTeam: (Champion | null)[],
  champion: Champion,
) {
  const analysis = analyzeTeam(allyTeam);

console.log(
  champion.name,
  analysis,
);

  const data =
  championData[champion.id] ??
  defaultChampionData;

console.log(
  champion.id,
  data === defaultChampionData
    ? "DEFAULT"
    : "FOUND"
);

  let score = SCORE.BASE;

  const reasons: RecommendationReason[] = [];

  if (
    analysis.needTank &&
    data.traits.includes(TRAITS.FRONTLINE)
  ) {
    score += SCORE.NEED_FRONTLINE;

    reasons.push({
      type: REASON.FRONTLINE,
      score: SCORE.NEED_FRONTLINE,
      text: "前衛を補える",
    });
  }

  if (
    analysis.needCC &&
    data.profile.cc >= 4
  ) {
    score += SCORE.NEED_CC;

    reasons.push({
      type: REASON.CC,
      score: SCORE.NEED_CC,
      text: "CCが豊富",
    });
  }

  if (
    analysis.needAP &&
    data.profile.damageType === "AP"
  ) {
    score += SCORE.NEED_AP;

    reasons.push({
      type: REASON.AP,
      score: SCORE.NEED_AP,
      text: "APダメージを補える",
    });
  }

  if (
    analysis.needAD &&
    data.profile.damageType === "AD"
  ) {
    score += SCORE.NEED_AD;

    reasons.push({
      type: REASON.AD,
      score: SCORE.NEED_AD,
      text: "ADダメージを補える",
    });
  }

  if (data.profile.scaling >= 4) {
    score += SCORE.GOOD_SCALING;

    reasons.push({
      type: REASON.SCALING,
      score: SCORE.GOOD_SCALING,
      text: "終盤が強い",
    });
  }

  return {
    score,
    reasons,
  };
}

