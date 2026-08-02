import { REASON } from "../types/recommendation";

import type {
  RecommendationReason,
  RecommendationReasonType,
} from "../types/recommendation";

const MAX_REASONS = 3;

type ReasonSelectionInput = Readonly<{
  scoreReasons: readonly RecommendationReason[];
  championSynergyReasons: readonly string[];
  championSynergyScore: number;
  traitReasons: readonly string[];
}>;

type ReasonCandidate = Readonly<{
  type: RecommendationReasonType;
  score: number;
  text: string;
}>;

const opponentTypes = new Set<RecommendationReasonType>([
  REASON.OPPONENT_ASSASSIN,
  REASON.OPPONENT_POKE,
  REASON.OPPONENT_ENGAGE,
  REASON.OPPONENT_MELEE,
  REASON.OPPONENT_RANGED,
  REASON.OPPONENT_WAVECLEAR,
]);

const allyTypes = new Set<RecommendationReasonType>([
  REASON.ALLY_POKE,
  REASON.ALLY_ENGAGE,
  REASON.ALLY_CARRY,
  REASON.ALLY_CATCH,
]);

function priority(type: RecommendationReasonType): number {
  if (type === REASON.CHAMPION_SYNERGY) return 1;
  if (type === REASON.ENEMY_COMPOSITION) return 2;
  if (type === REASON.DAMAGE_BALANCE) return 3;
  if (opponentTypes.has(type)) return 4;
  if (allyTypes.has(type)) return 5;
  if (
    type === REASON.TEAMFIGHT ||
    type === REASON.ROAM ||
    type === REASON.SIDE_LANE ||
    type === REASON.BLIND_PICK
  ) {
    return 7;
  }
  if (type === REASON.ROLE_SUITABILITY) return 8;
  return 6;
}

function specificity(type: RecommendationReasonType): number {
  if (type === REASON.CHAMPION_SYNERGY) return 3;
  if (
    type === REASON.ENEMY_COMPOSITION ||
    type === REASON.DAMAGE_BALANCE ||
    opponentTypes.has(type)
  ) {
    return 2;
  }
  if (type === REASON.TRAIT_MATCHUP) return 0;
  return 1;
}

function semanticKey(reason: ReasonCandidate): string {
  if (reason.type === REASON.OPPONENT_ENGAGE) {
    return "DIVE_PROTECTION";
  }

  const normalized = reason.text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s・、。,.!?！？]/g, "");
  const isDive = /dive|ダイブ/.test(normalized);
  const isProtect = /守|peel|ピール/.test(normalized);
  const isPoke = /poke|ポーク/.test(normalized);
  const isEngage = /仕掛|engage|エンゲージ/.test(normalized);

  if (isDive && isProtect) return "DIVE_PROTECTION";
  if (isPoke && isEngage) return "POKE_ENGAGE";

  return normalized;
}

function preferReason(
  current: ReasonCandidate,
  candidate: ReasonCandidate,
): ReasonCandidate {
  const specificityDifference =
    specificity(candidate.type) - specificity(current.type);

  if (specificityDifference !== 0) {
    return specificityDifference > 0 ? candidate : current;
  }

  return Math.abs(candidate.score) > Math.abs(current.score)
    ? candidate
    : current;
}

export function selectRecommendationReasons({
  scoreReasons,
  championSynergyReasons,
  championSynergyScore,
  traitReasons,
}: ReasonSelectionInput): string[] {
  const candidates: ReasonCandidate[] = [
    ...(championSynergyScore > 0
      ? championSynergyReasons.map((text) => ({
          type: REASON.CHAMPION_SYNERGY,
          score: championSynergyScore,
          text,
        }))
      : []),
    ...scoreReasons.filter((reason) => reason.score > 0),
    ...traitReasons.map((text) => ({
      type: REASON.TRAIT_MATCHUP,
      score: 1,
      text,
    })),
  ];
  const uniqueReasons = new Map<string, ReasonCandidate>();

  for (const candidate of candidates) {
    const key = semanticKey(candidate);
    const current = uniqueReasons.get(key);

    uniqueReasons.set(
      key,
      current ? preferReason(current, candidate) : candidate,
    );
  }

  const sorted = [...uniqueReasons.values()].sort((left, right) => {
    const priorityDifference = priority(left.type) - priority(right.type);

    return priorityDifference !== 0
      ? priorityDifference
      : Math.abs(right.score) - Math.abs(left.score);
  });
  const primaryReasons = sorted.filter(
    (reason) => reason.type !== REASON.ROLE_SUITABILITY,
  );
  const roleReasons = sorted.filter(
    (reason) => reason.type === REASON.ROLE_SUITABILITY,
  );

  return [...primaryReasons, ...roleReasons]
    .slice(0, MAX_REASONS)
    .map((reason) => reason.text);
}
