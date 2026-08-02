import { getChampionDetail } from "./analyzeTraits";
import { ROLE_INDEX } from "./role";
import { TEAMFIGHT_SCORE } from "./scoring";
import { REASON } from "../types/recommendation";

import type { DraftMetricRating } from "../src/types/championDetail";
import type { Champion, Role } from "../types/champion";
import type { RecommendationReason } from "../types/recommendation";

const TEAMFIGHT_NEED_THRESHOLD = 3.5;
const MIN_TEAMFIGHT_SAMPLE_SIZE = 2;

export type TeamfightNeedAnalysis = {
  selectedCount: number;
  averageTeamfight: number | null;
  needsTeamfight: boolean;
};

type TeamfightCandidateAnalysis = {
  score: number;
  reason?: RecommendationReason;
};

const TEAMFIGHT_REASON_TEXT: Record<
  DraftMetricRating,
  string
> = {
  1: "集団戦性能の不足をほとんど補えない",
  2: "集団戦性能の不足を補いにくい",
  3: "",
  4: "集団戦性能の不足を補いやすい",
  5: "集団戦性能の不足を大きく補える",
};

export function analyzeTeamfightNeed(
  allyTeam: (Champion | null)[],
  selectedRole: Role,
): TeamfightNeedAnalysis {
  const selectedRoleIndex = ROLE_INDEX[selectedRole];
  const ratings = allyTeam.flatMap((champion, index) => {
    if (!champion || index === selectedRoleIndex) {
      return [];
    }

    const teamfight = getChampionDetail(
      champion.id,
    )?.draftMetrics?.teamfight;

    return teamfight === undefined ? [] : [teamfight];
  });
  const selectedCount = ratings.length;
  const averageTeamfight =
    selectedCount === 0
      ? null
      : ratings.reduce((sum, rating) => sum + rating, 0) /
        selectedCount;

  return {
    selectedCount,
    averageTeamfight,
    needsTeamfight:
      selectedCount >= MIN_TEAMFIGHT_SAMPLE_SIZE &&
      averageTeamfight !== null &&
      averageTeamfight < TEAMFIGHT_NEED_THRESHOLD,
  };
}

export function analyzeTeamfightCandidate(
  teamfight: DraftMetricRating | undefined,
  needsTeamfight: boolean,
): TeamfightCandidateAnalysis {
  if (!needsTeamfight || teamfight === undefined) {
    return { score: 0 };
  }

  const score = TEAMFIGHT_SCORE[teamfight];

  if (score === 0) {
    return { score };
  }

  return {
    score,
    reason: {
      type: REASON.TEAMFIGHT,
      score,
      text: TEAMFIGHT_REASON_TEXT[teamfight],
    },
  };
}
