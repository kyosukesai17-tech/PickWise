import { REASON } from "../types/recommendation";

import type {
  RecommendationReason,
  RecommendationReasonType,
} from "../types/recommendation";

export type RecommendationReasonGroup =
  | "SYNERGY"
  | "TEAM_NEED"
  | "ENEMY_COUNTER"
  | "GENERAL";

export type GroupedRecommendationReasons = Readonly<{
  group: RecommendationReasonGroup;
  label: string;
  reasons: RecommendationReason[];
}>;

const GROUP_ORDER: readonly RecommendationReasonGroup[] = [
  "SYNERGY",
  "TEAM_NEED",
  "ENEMY_COUNTER",
  "GENERAL",
];

const GROUP_LABELS: Record<RecommendationReasonGroup, string> = {
  SYNERGY: "味方との相性",
  TEAM_NEED: "構成の補完",
  ENEMY_COUNTER: "敵への対策",
  GENERAL: "候補の強み",
};

const REASON_GROUPS: Record<
  RecommendationReasonType,
  RecommendationReasonGroup
> = {
  [REASON.FRONTLINE]: "TEAM_NEED",
  [REASON.AP]: "TEAM_NEED",
  [REASON.AD]: "TEAM_NEED",
  [REASON.CC]: "TEAM_NEED",
  [REASON.SCALING]: "TEAM_NEED",
  [REASON.ROLE_SUITABILITY]: "GENERAL",
  [REASON.BLIND_PICK]: "TEAM_NEED",
  [REASON.TEAMFIGHT]: "TEAM_NEED",
  [REASON.ROAM]: "TEAM_NEED",
  [REASON.SIDE_LANE]: "TEAM_NEED",
  [REASON.PICK_POTENTIAL]: "TEAM_NEED",
  [REASON.OBJECTIVE_CONTROL]: "TEAM_NEED",
  [REASON.DAMAGE_BALANCE]: "TEAM_NEED",
  [REASON.CANDIDATE_RISK]: "ENEMY_COUNTER",
  [REASON.ENEMY_COMPOSITION]: "ENEMY_COUNTER",
  [REASON.CHAMPION_SYNERGY]: "SYNERGY",
  [REASON.TRAIT_MATCHUP]: "ENEMY_COUNTER",
  [REASON.TRAIT_SCORE]: "ENEMY_COUNTER",
  [REASON.ENEMY_DIVE]: "ENEMY_COUNTER",
  [REASON.ENEMY_MELEE]: "ENEMY_COUNTER",
  [REASON.ENEMY_RANGED]: "ENEMY_COUNTER",
  [REASON.ENEMY_FRONTLINE]: "ENEMY_COUNTER",
  [REASON.ALLY_POKE]: "SYNERGY",
  [REASON.ALLY_ENGAGE]: "SYNERGY",
  [REASON.ALLY_CARRY]: "SYNERGY",
  [REASON.ALLY_CATCH]: "SYNERGY",
  [REASON.OPPONENT_ASSASSIN]: "ENEMY_COUNTER",
  [REASON.OPPONENT_POKE]: "ENEMY_COUNTER",
  [REASON.OPPONENT_ENGAGE]: "ENEMY_COUNTER",
  [REASON.OPPONENT_MELEE]: "ENEMY_COUNTER",
  [REASON.OPPONENT_RANGED]: "ENEMY_COUNTER",
  [REASON.OPPONENT_WAVECLEAR]: "ENEMY_COUNTER",
};

function getReasonGroup(
  type: RecommendationReasonType,
): RecommendationReasonGroup {
  return REASON_GROUPS[type] ?? "GENERAL";
}

export function groupRecommendationReasons(
  reasons: readonly RecommendationReason[],
): GroupedRecommendationReasons[] {
  const groupedReasons = new Map<
    RecommendationReasonGroup,
    RecommendationReason[]
  >();

  for (const reason of reasons) {
    const group = getReasonGroup(reason.type);
    const currentReasons = groupedReasons.get(group) ?? [];

    currentReasons.push(reason);
    groupedReasons.set(group, currentReasons);
  }

  return GROUP_ORDER.flatMap((group) => {
    const groupReasons = groupedReasons.get(group);

    return groupReasons && groupReasons.length > 0
      ? [{
          group,
          label: GROUP_LABELS[group],
          reasons: groupReasons,
        }]
      : [];
  });
}
