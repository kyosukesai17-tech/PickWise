import { getChampionDetail } from "./analyzeTraits";
import { ROLE_INDEX } from "./role";
import { SIDE_LANE_SCORE } from "./scoring";
import { REASON } from "../types/recommendation";

import type { DraftMetricRating } from "../src/types/championDetail";
import type { Champion, Role } from "../types/champion";
import type { RecommendationReason } from "../types/recommendation";

const SIDE_LANE_NEED_THRESHOLD = 2.75;
const TEAMFIGHT_COMPOSITION_THRESHOLD = 3.5;
const MIN_SIDE_LANE_SAMPLE_SIZE = 2;
const STRONG_SIDE_LANE_RATING = 5;

export type SideLaneNeedAnalysis = {
  selectedCount: number;
  averageSideLane: number | null;
  averageTeamfight: number | null;
  hasStrongSideLaner: boolean;
  needsSideLane: boolean;
};

type SideLaneCandidateAnalysis = {
  score: number;
  reason?: RecommendationReason;
};

const SIDE_LANE_REASON_TEXT: Record<
  DraftMetricRating,
  string
> = {
  1: "サイドレーン圧力の不足をほとんど補えない",
  2: "サイドレーン圧力の不足を補いにくい",
  3: "",
  4: "不足しているサイドレーン圧力を補いやすい",
  5: "不足しているサイドレーン圧力を大きく補える",
};

export function analyzeSideLaneNeed(
  allyTeam: (Champion | null)[],
  selectedRole: Role,
): SideLaneNeedAnalysis {
  const isEligibleRole =
    selectedRole === "TOP" || selectedRole === "MID";
  const selectedRoleIndex = ROLE_INDEX[selectedRole];
  const ratings = allyTeam.flatMap((champion, index) => {
    if (!champion || index === selectedRoleIndex) {
      return [];
    }

    const draftMetrics = getChampionDetail(
      champion.id,
    )?.draftMetrics;

    if (!draftMetrics) {
      return [];
    }

    return [{
      sideLane: draftMetrics.sideLane,
      teamfight: draftMetrics.teamfight,
    }];
  });
  const selectedCount = ratings.length;
  const averageSideLane =
    selectedCount === 0
      ? null
      : ratings.reduce(
          (sum, rating) => sum + rating.sideLane,
          0,
        ) / selectedCount;
  const averageTeamfight =
    selectedCount === 0
      ? null
      : ratings.reduce(
          (sum, rating) => sum + rating.teamfight,
          0,
        ) / selectedCount;
  const hasStrongSideLaner = ratings.some(
    (rating) => rating.sideLane === STRONG_SIDE_LANE_RATING,
  );

  return {
    selectedCount,
    averageSideLane,
    averageTeamfight,
    hasStrongSideLaner,
    needsSideLane:
      isEligibleRole &&
      selectedCount >= MIN_SIDE_LANE_SAMPLE_SIZE &&
      averageSideLane !== null &&
      averageSideLane < SIDE_LANE_NEED_THRESHOLD &&
      averageTeamfight !== null &&
      averageTeamfight >= TEAMFIGHT_COMPOSITION_THRESHOLD &&
      !hasStrongSideLaner,
  };
}

export function analyzeSideLaneCandidate(
  sideLane: DraftMetricRating | undefined,
  needsSideLane: boolean,
): SideLaneCandidateAnalysis {
  if (!needsSideLane || sideLane === undefined) {
    return { score: 0 };
  }

  const score = SIDE_LANE_SCORE[sideLane];

  if (score === 0) {
    return { score };
  }

  return {
    score,
    reason: {
      type: REASON.SIDE_LANE,
      score,
      text: SIDE_LANE_REASON_TEXT[sideLane],
    },
  };
}
