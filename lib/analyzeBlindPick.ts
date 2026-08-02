import { BLIND_PICK_SCORE } from "./scoring";
import { REASON } from "../types/recommendation";

import type { DraftMetricRating } from "../src/types/championDetail";
import type { RecommendationReason } from "../types/recommendation";

type BlindPickAnalysis = {
  score: number;
  reason?: RecommendationReason;
};

const BLIND_PICK_REASON_TEXT: Record<
  DraftMetricRating,
  string
> = {
  1: "先出しでは非常にリスクが高い",
  2: "先出しではカウンターを受けやすい",
  3: "",
  4: "先出し適性が高い",
  5: "先出ししやすい",
};

export function analyzeBlindPick(
  blindPick: DraftMetricRating | undefined,
  hasRoleOpponent: boolean,
): BlindPickAnalysis {
  if (hasRoleOpponent || blindPick === undefined) {
    return { score: 0 };
  }

  const score = BLIND_PICK_SCORE[blindPick];

  if (score === 0) {
    return { score };
  }

  return {
    score,
    reason: {
      type: REASON.BLIND_PICK,
      score,
      text: BLIND_PICK_REASON_TEXT[blindPick],
    },
  };
}
