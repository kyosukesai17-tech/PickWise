import { getChampionDetail } from "./analyzeTraits";
import { ROLE_INDEX } from "./role";
import { ROAM_SCORE } from "./scoring";
import { REASON } from "../types/recommendation";

import type { DraftMetricRating } from "../src/types/championDetail";
import type { Champion, Role } from "../types/champion";
import type { RecommendationReason } from "../types/recommendation";

const ROAM_NEED_THRESHOLD = 3;
const MIN_ROAM_SAMPLE_SIZE = 2;

export type RoamNeedAnalysis = {
  selectedCount: number;
  averageRoam: number | null;
  needsRoam: boolean;
};

type RoamCandidateAnalysis = {
  score: number;
  reason?: RecommendationReason;
};

const ROAM_REASON_TEXT: Record<
  DraftMetricRating,
  string
> = {
  1: "ローム・合流性能の不足をほとんど補えない",
  2: "ローム・合流性能の不足を補いにくい",
  3: "",
  4: "ローム・合流性能の不足を補いやすい",
  5: "ローム・合流性能の不足を大きく補える",
};

export function analyzeRoamNeed(
  allyTeam: (Champion | null)[],
  selectedRole: Role,
): RoamNeedAnalysis {
  const selectedRoleIndex = ROLE_INDEX[selectedRole];
  const ratings = allyTeam.flatMap((champion, index) => {
    if (!champion || index === selectedRoleIndex) {
      return [];
    }

    const roam = getChampionDetail(
      champion.id,
    )?.draftMetrics?.roam;

    return roam === undefined ? [] : [roam];
  });
  const selectedCount = ratings.length;
  const averageRoam =
    selectedCount === 0
      ? null
      : ratings.reduce((sum, rating) => sum + rating, 0) /
        selectedCount;

  return {
    selectedCount,
    averageRoam,
    needsRoam:
      selectedCount >= MIN_ROAM_SAMPLE_SIZE &&
      averageRoam !== null &&
      averageRoam < ROAM_NEED_THRESHOLD,
  };
}

export function analyzeRoamCandidate(
  roam: DraftMetricRating | undefined,
  needsRoam: boolean,
): RoamCandidateAnalysis {
  if (!needsRoam || roam === undefined) {
    return { score: 0 };
  }

  const score = ROAM_SCORE[roam];

  if (score === 0) {
    return { score };
  }

  return {
    score,
    reason: {
      type: REASON.ROAM,
      score,
      text: ROAM_REASON_TEXT[roam],
    },
  };
}
