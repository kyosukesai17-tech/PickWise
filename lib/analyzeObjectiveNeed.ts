import { getChampionDetail } from "./analyzeTraits";
import { ROLE_INDEX } from "./role";
import { OBJECTIVE_CONTROL_SCORE } from "./scoring";
import { REASON } from "../types/recommendation";

import type { DraftMetricRating } from "../src/types/championDetail";
import type { Champion, Role } from "../types/champion";
import type { RecommendationReason } from "../types/recommendation";

const OBJECTIVE_NEED_THRESHOLD = 4;
const MIN_OBJECTIVE_SAMPLE_SIZE = 2;

export type ObjectiveNeedAnalysis = {
  selectedCount: number;
  averageObjective: number | null;
  needsObjective: boolean;
};

type ObjectiveCandidateAnalysis = {
  score: number;
  reason?: RecommendationReason;
};

const OBJECTIVE_REASON_TEXT: Record<
  DraftMetricRating,
  string
> = {
  1: "オブジェクト処理能力をほとんど補えない",
  2: "オブジェクト処理能力の不足を補いにくい",
  3: "",
  4: "不足しているオブジェクト処理能力を補いやすい",
  5: "不足しているオブジェクト処理能力を大きく補える",
};

export function analyzeObjectiveNeed(
  allyTeam: (Champion | null)[],
  selectedRole: Role,
): ObjectiveNeedAnalysis {
  const selectedRoleIndex = ROLE_INDEX[selectedRole];
  const ratings = allyTeam.flatMap((champion, index) => {
    if (!champion || index === selectedRoleIndex) {
      return [];
    }

    const objectiveControl = getChampionDetail(
      champion.id,
    )?.draftMetrics?.objectiveControl;

    return objectiveControl === undefined ? [] : [objectiveControl];
  });
  const selectedCount = ratings.length;
  const averageObjective =
    selectedCount === 0
      ? null
      : ratings.reduce((sum, rating) => sum + rating, 0) /
        selectedCount;

  return {
    selectedCount,
    averageObjective,
    needsObjective:
      selectedCount >= MIN_OBJECTIVE_SAMPLE_SIZE &&
      averageObjective !== null &&
      averageObjective < OBJECTIVE_NEED_THRESHOLD,
  };
}

export function analyzeObjectiveCandidate(
  objectiveControl: DraftMetricRating | undefined,
  selectedRole: Role,
  needsObjective: boolean,
): ObjectiveCandidateAnalysis {
  if (!needsObjective || objectiveControl === undefined) {
    return { score: 0 };
  }

  const score =
    OBJECTIVE_CONTROL_SCORE[selectedRole][objectiveControl];

  if (score === 0) {
    return { score };
  }

  return {
    score,
    reason: {
      type: REASON.OBJECTIVE_CONTROL,
      score,
      text: OBJECTIVE_REASON_TEXT[objectiveControl],
    },
  };
}
