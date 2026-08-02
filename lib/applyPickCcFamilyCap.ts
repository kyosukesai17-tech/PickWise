import {
  PICK_CC_FAMILY_MAX_BONUS,
  PICK_CC_FAMILY_MAX_PENALTY,
} from "./scoring";

import type { RecommendationReason } from "../types/recommendation";

type PickCcFamilyAdjustment = Readonly<{
  score: number;
  reason?: RecommendationReason;
}>;

type AppliedPickCcFamily = Readonly<{
  score: number;
  reasons: RecommendationReason[];
}>;

export function applyPickCcFamilyCap(
  adjustments: readonly PickCcFamilyAdjustment[],
): AppliedPickCcFamily {
  let score = 0;
  const reasons: RecommendationReason[] = [];

  for (const adjustment of adjustments) {
    const nextScore = Math.min(
      PICK_CC_FAMILY_MAX_BONUS,
      Math.max(
        PICK_CC_FAMILY_MAX_PENALTY,
        score + adjustment.score,
      ),
    );
    const appliedScore = nextScore - score;

    score = nextScore;

    if (appliedScore !== 0 && adjustment.reason) {
      reasons.push({
        ...adjustment.reason,
        score: appliedScore,
      });
    }
  }

  return { score, reasons };
}
