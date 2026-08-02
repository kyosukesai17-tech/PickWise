import { getChampionDetail } from "./analyzeTraits";
import { ROLE_INDEX } from "./role";
import { PICK_POTENTIAL_SCORE } from "./scoring";
import { REASON } from "../types/recommendation";

import type { DraftMetricRating } from "../src/types/championDetail";
import type { Champion, Role } from "../types/champion";
import type { RecommendationReason } from "../types/recommendation";

const PICK_POTENTIAL_NEED_THRESHOLD = 3;
const MIN_PICK_POTENTIAL_SAMPLE_SIZE = 2;
const STRONG_PICK_POTENTIAL_RATING = 5;

export type PickPotentialNeedAnalysis = {
  selectedCount: number;
  averagePickPotential: number | null;
  hasStrongPicker: boolean;
  needsPickPotential: boolean;
};

type PickPotentialCandidateAnalysis = {
  score: number;
  reason?: RecommendationReason;
};

const PICK_POTENTIAL_REASON_TEXT: Record<
  DraftMetricRating,
  string
> = {
  1: "捕獲・ピック性能の不足をほとんど補えない",
  2: "捕獲・ピック性能の不足を補いにくい",
  3: "",
  4: "不足している捕獲・ピック性能を補いやすい",
  5: "不足している捕獲・ピック性能を大きく補える",
};

export function analyzePickPotentialNeed(
  allyTeam: (Champion | null)[],
  selectedRole: Role,
): PickPotentialNeedAnalysis {
  const selectedRoleIndex = ROLE_INDEX[selectedRole];
  const ratings = allyTeam.flatMap((champion, index) => {
    if (!champion || index === selectedRoleIndex) {
      return [];
    }

    const pickPotential = getChampionDetail(
      champion.id,
    )?.draftMetrics?.pickPotential;

    return pickPotential === undefined ? [] : [pickPotential];
  });
  const selectedCount = ratings.length;
  const averagePickPotential =
    selectedCount === 0
      ? null
      : ratings.reduce((sum, rating) => sum + rating, 0) /
        selectedCount;
  const hasStrongPicker = ratings.some(
    (rating) => rating === STRONG_PICK_POTENTIAL_RATING,
  );

  return {
    selectedCount,
    averagePickPotential,
    hasStrongPicker,
    needsPickPotential:
      selectedCount >= MIN_PICK_POTENTIAL_SAMPLE_SIZE &&
      averagePickPotential !== null &&
      averagePickPotential < PICK_POTENTIAL_NEED_THRESHOLD &&
      !hasStrongPicker,
  };
}

export function analyzePickPotentialCandidate(
  pickPotential: DraftMetricRating | undefined,
  needsPickPotential: boolean,
): PickPotentialCandidateAnalysis {
  if (!needsPickPotential || pickPotential === undefined) {
    return { score: 0 };
  }

  const score = PICK_POTENTIAL_SCORE[pickPotential];

  if (score === 0) {
    return { score };
  }

  return {
    score,
    reason: {
      type: REASON.PICK_POTENTIAL,
      score,
      text: PICK_POTENTIAL_REASON_TEXT[pickPotential],
    },
  };
}
