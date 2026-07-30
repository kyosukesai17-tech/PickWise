import { analyzeTeam } from "./analyzeTeam";
import { analyzeEnemyTeam } from "./analyzeEnemyTeam";
import { analyzeAllySynergy } from "./analyzeAllySynergy";

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
  enemyTeam: (Champion | null)[],
  champion: Champion,
) {
  const allyAnalysis =
    analyzeTeam(allyTeam);

  const enemyAnalysis =
    analyzeEnemyTeam(enemyTeam);

  const allySynergy =
    analyzeAllySynergy(allyTeam);

  const data =
    championData[champion.id] ??
    defaultChampionData;

  const isFrontline =
    data.traits.includes(
      TRAITS.FRONTLINE,
    );

  const hasEngage =
    data.traits.includes(
      TRAITS.ENGAGE,
    );

  const hasPeel =
    data.traits.includes(
      TRAITS.PEEL,
    );

  const hasPoke =
    data.traits.includes(
      TRAITS.POKE,
    );

  const hasSiege =
    data.traits.includes(
      TRAITS.SIEGE,
    );

  const hasCarry =
    data.traits.includes(
      TRAITS.CARRY,
    );

  const hasAssassin =
    data.traits.includes(
      TRAITS.ASSASSIN,
    );

  const hasCatch =
    data.traits.includes(
      TRAITS.CATCH,
    );

  const hasPokeOrSiege =
    hasPoke ||
    hasSiege;

  const hasAssassinOrCatch =
    hasAssassin ||
    hasCatch;

  const canDealAP =
    data.attributes.damageType === "AP" ||
    data.attributes.damageType === "MIXED";

  const canDealAD =
    data.attributes.damageType === "AD" ||
    data.attributes.damageType === "MIXED";

  let score = SCORE.BASE;

  const reasons: RecommendationReason[] = [];

  if (
    allyAnalysis.needTank &&
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
    allyAnalysis.needCC &&
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
    allyAnalysis.needAP &&
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
    allyAnalysis.needAD &&
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
    allyAnalysis.needTank &&
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
    allyAnalysis.needCC &&
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
    allyAnalysis.needAP &&
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
    allyAnalysis.needAD &&
    !canDealAD
  ) {
    score += SCORE.MISSING_AD;

    reasons.push({
      type: REASON.AD,
      score: SCORE.MISSING_AD,
      text: "ADダメージ不足を解決できない",
    });
  }

  if (
    enemyAnalysis.hasHeavyDive &&
    hasPeel
  ) {
    score += SCORE.VS_DIVE_PEEL;

    reasons.push({
      type: REASON.ENEMY_DIVE,
      score: SCORE.VS_DIVE_PEEL,
      text: "敵のダイブ構成から味方を守りやすい",
    });
  }

  if (
    enemyAnalysis.isMeleeHeavy &&
    hasPokeOrSiege
  ) {
    score += SCORE.VS_MELEE_POKE;

    reasons.push({
      type: REASON.ENEMY_MELEE,
      score: SCORE.VS_MELEE_POKE,
      text: "近接中心の敵を遠距離から削りやすい",
    });
  }

  if (
    enemyAnalysis.isRangedHeavy &&
    hasAssassinOrCatch
  ) {
    score += SCORE.VS_RANGED_CATCH;

    reasons.push({
      type: REASON.ENEMY_RANGED,
      score: SCORE.VS_RANGED_CATCH,
      text: "遠距離中心の敵を捕まえやすい",
    });
  }

  if (
    enemyAnalysis.hasMultipleFrontlines &&
    hasCarry
  ) {
    score += SCORE.VS_FRONTLINE_CARRY;

    reasons.push({
      type: REASON.ENEMY_FRONTLINE,
      score: SCORE.VS_FRONTLINE_CARRY,
      text: "敵の前衛を継続的に削りやすい",
    });
  }

  if (
    allySynergy.hasPokeCore &&
    hasPokeOrSiege
  ) {
    score += SCORE.ALLY_POKE_SYNERGY;

    reasons.push({
      type: REASON.ALLY_POKE,
      score: SCORE.ALLY_POKE_SYNERGY,
      text: "味方のポーク構成と相性が良い",
    });
  }

  if (
    allySynergy.hasEngageCore &&
    (hasEngage || hasCarry)
  ) {
    score += SCORE.ALLY_ENGAGE_SYNERGY;

    reasons.push({
      type: REASON.ALLY_ENGAGE,
      score: SCORE.ALLY_ENGAGE_SYNERGY,
      text: "味方のエンゲージに合わせやすい",
    });
  }

  if (
    allySynergy.hasCarry &&
    hasPeel
  ) {
    score += SCORE.ALLY_CARRY_PEEL;

    reasons.push({
      type: REASON.ALLY_CARRY,
      score: SCORE.ALLY_CARRY_PEEL,
      text: "味方のキャリーを守りやすい",
    });
  }

  if (
    allySynergy.hasCatchCore &&
    hasAssassinOrCatch
  ) {
    score += SCORE.ALLY_CATCH_SYNERGY;

    reasons.push({
      type: REASON.ALLY_CATCH,
      score: SCORE.ALLY_CATCH_SYNERGY,
      text: "味方のキャッチ構成と合わせやすい",
    });
  }

  return {
    score,
    reasons,
  };
}