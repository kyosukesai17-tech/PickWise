import { SCORE } from "./scoring";

export function clampTraitScore(weightedTraitScore: number): number {
  return Math.min(
    SCORE.TRAIT_SCORE_MAX_BONUS,
    Math.max(
      SCORE.TRAIT_SCORE_MAX_PENALTY,
      weightedTraitScore,
    ),
  );
}
