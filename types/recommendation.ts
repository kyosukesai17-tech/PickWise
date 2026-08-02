import type { Champion } from "./champion";

export const REASON = {
  FRONTLINE: "FRONTLINE",
  AP: "AP",
  AD: "AD",
  CC: "CC",
  SCALING: "SCALING",
  ROLE_SUITABILITY: "ROLE_SUITABILITY",
  DAMAGE_BALANCE: "DAMAGE_BALANCE",

  ENEMY_DIVE: "ENEMY_DIVE",
  ENEMY_MELEE: "ENEMY_MELEE",
  ENEMY_RANGED: "ENEMY_RANGED",
  ENEMY_FRONTLINE: "ENEMY_FRONTLINE",

  ALLY_POKE: "ALLY_POKE",
  ALLY_ENGAGE: "ALLY_ENGAGE",
  ALLY_CARRY: "ALLY_CARRY",
  ALLY_CATCH: "ALLY_CATCH",

  OPPONENT_ASSASSIN: "OPPONENT_ASSASSIN",
  OPPONENT_POKE: "OPPONENT_POKE",
  OPPONENT_ENGAGE: "OPPONENT_ENGAGE",
  OPPONENT_MELEE: "OPPONENT_MELEE",
  OPPONENT_RANGED: "OPPONENT_RANGED",
  OPPONENT_WAVECLEAR: "OPPONENT_WAVECLEAR",
} as const;

export type RecommendationReasonType =
  (typeof REASON)[keyof typeof REASON];

export interface RecommendationReason {
  type: RecommendationReasonType;
  score: number;
  text: string;
}

export interface Recommendation {
  champion: Champion;
  score: number;
  reasons: RecommendationReason[];
  isDataRegistered: boolean;
}
