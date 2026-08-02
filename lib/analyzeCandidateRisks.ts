import { SCORE } from "./scoring";
import { TRAITS } from "../src/constants/traits";
import { REASON } from "../types/recommendation";

import type { EnemyTeamAnalysis } from "./analyzeEnemyTeam";
import type { ChampionDetail } from "../src/types/championDetail";
import type { RecommendationReason } from "../types/recommendation";

type PenaltyCandidate = Readonly<{
  score: number;
  priority: number;
  text: string;
}>;

export interface CandidateRiskAnalysis {
  score: number;
  reasons: RecommendationReason[];
}

function selectPenalty(
  candidates: readonly PenaltyCandidate[],
): PenaltyCandidate | undefined {
  return [...candidates].sort((left, right) =>
    left.score !== right.score
      ? left.score - right.score
      : left.priority - right.priority,
  )[0];
}

export function analyzeCandidateRisks(
  candidate: ChampionDetail,
  enemyAnalysis: EnemyTeamAnalysis,
): CandidateRiskAnalysis {
  const isFrontline = candidate.archetypes.includes("FRONTLINE");
  const hasMobility = candidate.traits.includes(TRAITS.MOBILITY);
  const isSquishy =
    candidate.traits.includes(TRAITS.SQUISHY) &&
    !isFrontline;
  const isImmobile =
    candidate.traits.includes(TRAITS.IMMOBILE) &&
    !hasMobility;
  const isWeakEarly = candidate.traits.includes(TRAITS.WEAK_EARLY);
  const selectedPenalties: PenaltyCandidate[] = [];

  if (isSquishy) {
    const squishyPenalties: PenaltyCandidate[] = [];

    if (enemyAnalysis.enemyAssassinCount >= 2) {
      squishyPenalties.push({
        score: SCORE.CANDIDATE_RISK_ASSASSIN,
        priority: 1,
        text: "敵のアサシンが多く、低耐久を狙われやすい",
      });
    }

    if (enemyAnalysis.compositionTypes.includes("DIVE")) {
      squishyPenalties.push({
        score: SCORE.ENEMY_COMP_DIVE_SQUISHY,
        priority: 2,
        text: "敵のDive構成に低耐久を狙われやすい",
      });
    }

    if (enemyAnalysis.enemyCcScore >= 12) {
      squishyPenalties.push({
        score: SCORE.CANDIDATE_RISK_HIGH_CC,
        priority: 3,
        text: "敵のCCが多く、捕まると倒されやすい",
      });
    }

    const squishyPenalty = selectPenalty(squishyPenalties);

    if (squishyPenalty) {
      selectedPenalties.push(squishyPenalty);
    }
  }

  if (isImmobile) {
    const immobilePenalties: PenaltyCandidate[] = [];

    if (enemyAnalysis.compositionTypes.includes("CATCH")) {
      immobilePenalties.push({
        score: SCORE.ENEMY_COMP_CATCH_IMMOBILE,
        priority: 1,
        text: "敵のCatch構成に対して移動手段が少ない",
      });
    }

    if (
      enemyAnalysis.enemyEngageCount +
        enemyAnalysis.enemyCatchCount >=
      2
    ) {
      immobilePenalties.push({
        score: SCORE.CANDIDATE_RISK_ENGAGE,
        priority: 2,
        text: "敵の捕獲・エンゲージが多く、移動手段の少なさを突かれやすい",
      });
    }

    if (enemyAnalysis.compositionTypes.includes("POKE")) {
      immobilePenalties.push({
        score: SCORE.ENEMY_COMP_POKE_IMMOBILE,
        priority: 3,
        text: "敵のPoke構成に対して移動手段が少ない",
      });
    }

    const immobilePenalty = selectPenalty(immobilePenalties);

    if (immobilePenalty) {
      selectedPenalties.push(immobilePenalty);
    }
  }

  if (
    isWeakEarly &&
    enemyAnalysis.enemyAssassinCount +
      enemyAnalysis.enemyEngageCount >=
      3
  ) {
    selectedPenalties.push({
      score: SCORE.CANDIDATE_RISK_EARLY_PRESSURE,
      priority: 1,
      text: "敵の序盤圧力が高く、成長前に崩されやすい",
    });
  }

  const reasons: RecommendationReason[] = [];
  let score = 0;

  for (const penalty of selectedPenalties) {
    const nextScore = Math.max(
      SCORE.CANDIDATE_RISK_MAX_PENALTY,
      score + penalty.score,
    );
    const appliedPenalty = nextScore - score;

    score = nextScore;

    if (appliedPenalty < 0) {
      reasons.push({
        type: REASON.CANDIDATE_RISK,
        score: appliedPenalty,
        text: penalty.text,
      });
    }
  }

  return { score, reasons };
}
