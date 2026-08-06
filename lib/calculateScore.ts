import {
  analyzeDamageBalance,
  analyzeTeam,
} from "./analyzeTeam";
import { analyzeEnemyTeam } from "./analyzeEnemyTeam";
import { analyzeEnemyComposition } from "./analyzeEnemyComposition";
import { analyzeCandidateRisks } from "./analyzeCandidateRisks";
import { analyzeAllySynergy } from "./analyzeAllySynergy";
import { analyzeRoleOpponent } from "./analyzeRoleOpponent";
import { analyzeChampionSynergy } from "./analyzeChampionSynergy";
import { analyzeBlindPick } from "./analyzeBlindPick";
import {
  analyzeTeamfightCandidate,
  analyzeTeamfightNeed,
} from "./analyzeTeamfightNeed";
import {
  analyzeRoamCandidate,
  analyzeRoamNeed,
} from "./analyzeRoamNeed";
import {
  analyzeSideLaneCandidate,
  analyzeSideLaneNeed,
} from "./analyzeSideLaneNeed";
import {
  analyzePickPotentialCandidate,
  analyzePickPotentialNeed,
} from "./analyzePickPotentialNeed";
import {
  analyzeObjectiveCandidate,
  analyzeObjectiveNeed,
} from "./analyzeObjectiveNeed";
import { applyDraftMetricsCap } from "./applyDraftMetricsCap";
import { applyPickCcFamilyCap } from "./applyPickCcFamilyCap";
import { clampTraitScore } from "./clampTraitScore";
import {
  analyzeTraits,
  getChampionDetail,
} from "./analyzeTraits";

import { TRAITS } from "../src/constants/traits";
import {
  ROLE_SUITABILITY_SCORE,
  SCORE,
} from "./scoring";

import { REASON } from "../types/recommendation";

import type {
  RecommendationReason,
} from "../types/recommendation";

import type {
  Champion,
  Role,
} from "../types/champion";
import type { DraftSide } from "../types/draftPhase";

const TRAIT_SCORE_WEIGHT = 0.2;

export function calculateScore(
  allyTeam: (Champion | null)[],
  enemyTeam: (Champion | null)[],
  selectedRole: Role,
  champion: Champion,
  currentDraftSide: DraftSide,
) {
  const allyAnalysis =
    analyzeTeam(allyTeam);

  const teamfightNeed =
    analyzeTeamfightNeed(
      allyTeam,
      selectedRole,
    );

  const roamNeed =
    analyzeRoamNeed(
      allyTeam,
      selectedRole,
    );

  const sideLaneNeed =
    analyzeSideLaneNeed(
      allyTeam,
      selectedRole,
    );

  const pickPotentialNeed =
    analyzePickPotentialNeed(
      allyTeam,
      selectedRole,
    );

  const objectiveNeed =
    analyzeObjectiveNeed(
      allyTeam,
      selectedRole,
    );

  const damageBalance =
    analyzeDamageBalance(
      allyTeam,
      selectedRole,
    );

  const shouldApplyNeedApScores =
    damageBalance.bias !== "AD";
  const shouldApplyNeedAdScores =
    damageBalance.bias !== "AP";

  const enemyAnalysis =
    analyzeEnemyTeam(enemyTeam);

  const hasDiveComposition =
    enemyAnalysis.compositionTypes.includes("DIVE");
  const hasPokeComposition =
    enemyAnalysis.compositionTypes.includes("POKE");
  const hasFrontToBackComposition =
    enemyAnalysis.compositionTypes.includes("FRONT_TO_BACK");

  const allySynergy =
    analyzeAllySynergy(allyTeam);

  const roleOpponent =
    analyzeRoleOpponent(
      enemyTeam,
      selectedRole,
    );

  const detail = getChampionDetail(champion.id);

  const isFrontline =
    detail?.archetypes.includes("FRONTLINE") ?? false;

  const hasEngage =
    detail?.traits.includes(
      TRAITS.ENGAGE,
    ) ?? false;

  const hasPeel =
    detail?.traits.includes(
      TRAITS.PEEL,
    ) ?? false;

  const hasPoke =
    detail?.traits.includes(
      TRAITS.POKE,
    ) ?? false;

  const hasSiege =
    detail?.traits.includes(
      TRAITS.SIEGE,
    ) ?? false;

  const hasCarry =
    detail?.archetypes.includes("CARRY") ?? false;

  const hasAssassin =
    detail?.archetypes.includes("ASSASSIN") ?? false;

  const hasCatch =
    detail?.archetypes.includes("CATCH") ?? false;

  const hasPokeOrSiege =
    hasPoke || hasSiege;

  const hasAssassinOrCatch =
    hasAssassin || hasCatch;

  const isRanged =
    detail?.rangeType === "Ranged";

  const isDurable =
    detail !== undefined &&
    detail.ratings.tankiness >= 4;

  const hasHighWaveClear =
    detail !== undefined &&
    detail.ratings.waveClear >= 4;

  const canDealAP =
    detail?.damageType === "AP" ||
    detail?.damageType === "Mixed";

  const canDealAD =
    detail?.damageType === "AD" ||
    detail?.damageType === "Mixed";

  const appliesVsMeleePoke =
    enemyAnalysis.isMeleeHeavy &&
    hasPokeOrSiege;
  const appliesVsRangedCatch =
    enemyAnalysis.isRangedHeavy &&
    hasAssassinOrCatch;

  const ccFamilyAdjustment =
    detail && allyAnalysis.needCC && detail.ratings.cc >= 4
      ? {
          score: SCORE.NEED_CC,
          reason: {
            type: REASON.CC,
            score: SCORE.NEED_CC,
            text: "CCが豊富",
          },
        }
      : detail && allyAnalysis.needCC && detail.ratings.cc <= 2
        ? {
            score: SCORE.MISSING_CC,
            reason: {
              type: REASON.CC,
              score: SCORE.MISSING_CC,
              text: "CC不足を解決しにくい",
            },
          }
        : { score: 0 };

  const blindPickAnalysis = analyzeBlindPick(
    detail?.draftMetrics?.blindPick,
    currentDraftSide === "ALLY" && !roleOpponent.hasOpponent,
  );
  const teamfightAnalysis = analyzeTeamfightCandidate(
    detail?.draftMetrics?.teamfight,
    teamfightNeed.needsTeamfight,
  );
  const roamAnalysis = analyzeRoamCandidate(
    detail?.draftMetrics?.roam,
    roamNeed.needsRoam,
  );
  const sideLaneAnalysis = analyzeSideLaneCandidate(
    detail?.draftMetrics?.sideLane,
    sideLaneNeed.needsSideLane,
  );
  const pickPotentialAnalysis = analyzePickPotentialCandidate(
    detail?.draftMetrics?.pickPotential,
    pickPotentialNeed.needsPickPotential,
  );
  const objectiveAnalysis = analyzeObjectiveCandidate(
    detail?.draftMetrics?.objectiveControl,
    selectedRole,
    objectiveNeed.needsObjective,
  );
  const draftMetrics = applyDraftMetricsCap([
    blindPickAnalysis,
    teamfightAnalysis,
    roamAnalysis,
    sideLaneAnalysis,
    pickPotentialAnalysis,
    objectiveAnalysis,
  ]);
  // PickPotential uses its DraftMetrics-capped value before sharing a cap
  // with the earlier CC shortage adjustment.
  const appliedPickPotential = draftMetrics.reasons.find(
    (reason) => reason.type === REASON.PICK_POTENTIAL,
  );
  const pickCcFamily = applyPickCcFamilyCap([
    ccFamilyAdjustment,
    {
      score: appliedPickPotential?.score ?? 0,
      reason: appliedPickPotential,
    },
  ]);
  const appliedCcReason = pickCcFamily.reasons.find(
    (reason) => reason.type === REASON.CC,
  );
  const appliedPickPotentialReason = pickCcFamily.reasons.find(
    (reason) => reason.type === REASON.PICK_POTENTIAL,
  );

  let score = SCORE.BASE;

  const reasons: RecommendationReason[] = [];

  if (
    detail &&
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

  if (appliedCcReason && appliedCcReason.score > 0) {
    score += appliedCcReason.score;
    reasons.push(appliedCcReason);
  }

  if (
    shouldApplyNeedApScores &&
    allyAnalysis.needAP &&
    canDealAP
  ) {
    const apScore =
      detail?.damageType === "Mixed"
        ? SCORE.NEED_AP_MIXED
        : SCORE.NEED_AP;

    score += apScore;

    reasons.push({
      type: REASON.AP,
      score: apScore,
      text:
        detail?.damageType === "Mixed"
          ? "APダメージを一部補える"
          : "APダメージを補える",
    });
  }

  if (
    shouldApplyNeedAdScores &&
    allyAnalysis.needAD &&
    canDealAD
  ) {
    const adScore =
      detail?.damageType === "Mixed"
        ? SCORE.NEED_AD_MIXED
        : SCORE.NEED_AD;

    score += adScore;

    reasons.push({
      type: REASON.AD,
      score: adScore,
      text:
        detail?.damageType === "Mixed"
          ? "ADダメージを一部補える"
          : "ADダメージを補える",
    });
  }

  if (detail && detail.ratings.scaling >= 4) {
    score += SCORE.GOOD_SCALING;

    reasons.push({
      type: REASON.SCALING,
      score: SCORE.GOOD_SCALING,
      text: "終盤が強い",
    });
  }

  if (
    detail &&
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

  if (appliedCcReason && appliedCcReason.score < 0) {
    score += appliedCcReason.score;
    reasons.push(appliedCcReason);
  }

  if (
    detail &&
    shouldApplyNeedApScores &&
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
    detail &&
    shouldApplyNeedAdScores &&
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
    !hasDiveComposition &&
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
    appliesVsMeleePoke
  ) {
    score += SCORE.VS_MELEE_POKE;

    reasons.push({
      type: REASON.ENEMY_MELEE,
      score: SCORE.VS_MELEE_POKE,
      text: "近接中心の敵を遠距離から削りやすい",
    });
  }

  if (
    appliesVsRangedCatch
  ) {
    score += SCORE.VS_RANGED_CATCH;

    reasons.push({
      type: REASON.ENEMY_RANGED,
      score: SCORE.VS_RANGED_CATCH,
      text: "遠距離中心の敵を捕まえやすい",
    });
  }

  if (
    !hasFrontToBackComposition &&
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

  if (
    roleOpponent.isAssassin &&
    (hasPeel || isDurable)
  ) {
    score +=
      SCORE.OPPONENT_ASSASSIN_DEFENSE;

    reasons.push({
      type: REASON.OPPONENT_ASSASSIN,
      score:
        SCORE.OPPONENT_ASSASSIN_DEFENSE,
      text: "対面のアサシンに対応しやすい",
    });
  }

  if (
    !hasPokeComposition &&
    roleOpponent.hasPokeOrSiege &&
    (hasEngage || hasCatch)
  ) {
    score +=
      SCORE.OPPONENT_POKE_ENGAGE;

    reasons.push({
      type: REASON.OPPONENT_POKE,
      score:
        SCORE.OPPONENT_POKE_ENGAGE,
      text: "ポーク対面に仕掛けやすい",
    });
  }

  if (
    roleOpponent.hasEngage &&
    hasPeel
  ) {
    score +=
      SCORE.OPPONENT_ENGAGE_PEEL;

    reasons.push({
      type: REASON.OPPONENT_ENGAGE,
      score:
        SCORE.OPPONENT_ENGAGE_PEEL,
      text: "対面の仕掛けを受け止めやすい",
    });
  }

  if (
    !appliesVsMeleePoke &&
    roleOpponent.isMelee &&
    isRanged &&
    hasPokeOrSiege
  ) {
    score +=
      SCORE.OPPONENT_MELEE_RANGE;

    reasons.push({
      type: REASON.OPPONENT_MELEE,
      score:
        SCORE.OPPONENT_MELEE_RANGE,
      text: "近接対面に射程差を作りやすい",
    });
  }

  if (
    !appliesVsRangedCatch &&
    roleOpponent.isRanged &&
    hasAssassinOrCatch
  ) {
    score +=
      SCORE.OPPONENT_RANGED_CATCH;

    reasons.push({
      type: REASON.OPPONENT_RANGED,
      score:
        SCORE.OPPONENT_RANGED_CATCH,
      text: "遠距離対面に圧力をかけやすい",
    });
  }

  if (
    roleOpponent.hasHighWaveClear &&
    hasHighWaveClear
  ) {
    score +=
      SCORE.OPPONENT_WAVECLEAR;

    reasons.push({
      type: REASON.OPPONENT_WAVECLEAR,
      score:
        SCORE.OPPONENT_WAVECLEAR,
      text: "対面のウェーブクリアに対応しやすい",
    });
  }

  if (detail) {
    const traitScore = enemyTeam.reduce((total, enemyChampion) => {
      if (!enemyChampion) {
        return total;
      }

      const enemyDetail = getChampionDetail(enemyChampion.id);

      return enemyDetail
        ? total + analyzeTraits(enemyDetail, detail)
        : total;
    }, 0);

    const weightedTraitScore =
      traitScore * TRAIT_SCORE_WEIGHT;
    const appliedTraitScore =
      clampTraitScore(weightedTraitScore);

    score += appliedTraitScore;

    if (appliedTraitScore !== 0) {
      reasons.push({
        type: REASON.TRAIT_SCORE,
        score: appliedTraitScore,
        text: "Trait相性",
      });
    }
  }

  const championSynergy = analyzeChampionSynergy(
    allyTeam,
    selectedRole,
    champion,
  );

  score += championSynergy.score;

  const roleSuitability =
    detail?.roleSuitability[selectedRole];

  if (roleSuitability !== undefined) {
    const roleSuitabilityScore =
      ROLE_SUITABILITY_SCORE[roleSuitability];

    score += roleSuitabilityScore;

    if (roleSuitabilityScore !== 0) {
      reasons.push({
        type: REASON.ROLE_SUITABILITY,
        score: roleSuitabilityScore,
        text: `${selectedRole}適性が${roleSuitabilityScore > 0 ? "高い" : "低い"}`,
      });
    }
  }

  const finalDraftReasons = draftMetrics.reasons.flatMap((reason) => {
    if (reason.type !== REASON.PICK_POTENTIAL) {
      return [reason];
    }

    return appliedPickPotentialReason ? [appliedPickPotentialReason] : [];
  });

  score += finalDraftReasons.reduce(
    (total, reason) => total + reason.score,
    0,
  );
  reasons.push(...finalDraftReasons);

  if (detail && damageBalance.bias) {
    const candidateDamageType = detail.damageType;
    const isOppositeDamageType =
      candidateDamageType !== "Mixed" &&
      candidateDamageType !== damageBalance.bias;
    const damageBalanceScore =
      candidateDamageType === "Mixed"
        ? SCORE.DAMAGE_BALANCE_MIXED
        : isOppositeDamageType
          ? SCORE.DAMAGE_BALANCE_PRIMARY
          : SCORE.DAMAGE_BALANCE_SAME_TYPE_PENALTY;
    const damageBalanceText =
      candidateDamageType === "Mixed"
        ? `味方の${damageBalance.bias}偏重をMixedダメージで緩和できる`
        : isOppositeDamageType
          ? `味方の${damageBalance.bias}偏重を${candidateDamageType}ダメージで補える`
          : `味方の${damageBalance.bias}偏重をさらに強める`;

    score += damageBalanceScore;
    reasons.push({
      type: REASON.DAMAGE_BALANCE,
      score: damageBalanceScore,
      text: damageBalanceText,
    });
  }

  if (detail) {
    const enemyComposition = analyzeEnemyComposition(
      enemyAnalysis,
      detail,
    );

    score += enemyComposition.score;
    reasons.push(
      ...enemyComposition.reasons.map((reason) => ({
        type: REASON.ENEMY_COMPOSITION,
        score: reason.score,
        text: reason.text,
      })),
    );

    const candidateRisks = analyzeCandidateRisks(
      detail,
      enemyAnalysis,
    );

    score += candidateRisks.score;
    reasons.push(...candidateRisks.reasons);
  }

  return {
    score,
    reasons,
  };
}
