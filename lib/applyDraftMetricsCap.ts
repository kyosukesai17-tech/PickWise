import {
  DRAFT_METRICS_MAX_BONUS,
  DRAFT_METRICS_MAX_PENALTY,
} from "./scoring";

import type { RecommendationReason } from "../types/recommendation";

type DraftMetricAdjustment = Readonly<{
  score: number;
  reason?: RecommendationReason;
}>;

type AppliedDraftMetrics = Readonly<{
  score: number;
  reasons: RecommendationReason[];
}>;

export function applyDraftMetricsCap(
  adjustments: readonly DraftMetricAdjustment[],
): AppliedDraftMetrics {
  let score = 0;
  const reasons: RecommendationReason[] = [];

  for (const adjustment of adjustments) {
    const nextScore = Math.min(
      DRAFT_METRICS_MAX_BONUS,
      Math.max(
        DRAFT_METRICS_MAX_PENALTY,
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
