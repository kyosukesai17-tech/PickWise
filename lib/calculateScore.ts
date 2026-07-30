import { analyzeTeam } from "./analyzeTeam";

import {
  championData,
  defaultChampionData,
} from "../data/championData";

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

  const data =
    championData[champion.id] ??
    defaultChampionData;

  const isFrontline =
    data.traits.includes(TRAITS.FRONTLINE);

  const canDealAP =
    data.attributes.damageType === "AP" ||
    data.attributes.damageType === "MIXED";

  const canDealAD =
    data.attributes.damageType === "AD" ||
    data.attributes.damageType === "MIXED";

  let score = SCORE.BASE;

  const reasons: RecommendationReason[] = [];

  if (
    analysis.needTank &&
    isFrontline
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
    data.ratings.cc >= 4
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
    canDealAP
  ) {
    const apScore =
      data.attributes.damageType === "MIXED"
        ? SCORE.NEED_AP_MIXED
        : SCORE.NEED_AP;

    score += apScore;

    reasons.push({
      type: REASON.AP,
      score: apScore,
      text:
        data.attributes.damageType === "MIXED"
          ? "APダメージを一部補える"
          : "APダメージを補える",
    });
  }

  if (
    analysis.needAD &&
    canDealAD
  ) {
    const adScore =
      data.attributes.damageType === "MIXED"
        ? SCORE.NEED_AD_MIXED
        : SCORE.NEED_AD;

    score += adScore;

    reasons.push({
      type: REASON.AD,
      score: adScore,
      text:
        data.attributes.damageType === "MIXED"
          ? "ADダメージを一部補える"
          : "ADダメージを補える",
    });
  }

  if (data.ratings.scaling >= 4) {
    score += SCORE.GOOD_SCALING;

    reasons.push({
      type: REASON.SCALING,
      score: SCORE.GOOD_SCALING,
      text: "終盤が強い",
    });
  }

  if (
    analysis.needTank &&
    !isFrontline
  ) {
    score += SCORE.MISSING_FRONTLINE;

    reasons.push({
      type: REASON.FRONTLINE,
      score: SCORE.MISSING_FRONTLINE,
      text: "フロントライン不足を解決できない",
    });
  }

  if (
    analysis.needCC &&
    data.ratings.cc <= 2
  ) {
    score += SCORE.MISSING_CC;

    reasons.push({
      type: REASON.CC,
      score: SCORE.MISSING_CC,
      text: "CC不足を解決しにくい",
    });
  }

  if (
    analysis.needAP &&
    !canDealAP
  ) {
    score += SCORE.MISSING_AP;

    reasons.push({
      type: REASON.AP,
      score: SCORE.MISSING_AP,
      text: "APダメージ不足を解決できない",
    });
  }

  if (
    analysis.needAD &&
    !canDealAD
  ) {
    score += SCORE.MISSING_AD;

    reasons.push({
      type: REASON.AD,
      score: SCORE.MISSING_AD,
      text: "ADダメージ不足を解決できない",
    });
  }

  return {
    score,
    reasons,
  };
}