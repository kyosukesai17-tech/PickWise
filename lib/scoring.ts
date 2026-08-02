import type {
  DraftMetricRating,
  RoleSuitabilityRating,
} from "../src/types/championDetail";

export const SCORE = {
  BASE: 50,

  NEED_FRONTLINE: 20,

  NEED_AP: 15,
  NEED_AP_MIXED: 10,

  NEED_AD: 15,
  NEED_AD_MIXED: 10,

  NEED_CC: 15,

  GOOD_SCALING: 10,

  GOOD_WAVECLEAR: 10,

  MISSING_FRONTLINE: -12,

  MISSING_AP: -8,

  MISSING_AD: -8,

  MISSING_CC: -8,

  VS_DIVE_PEEL: 15,

  VS_MELEE_POKE: 10,

  VS_RANGED_CATCH: 12,

  VS_FRONTLINE_CARRY: 12,

  ALLY_POKE_SYNERGY: 12,

  ALLY_ENGAGE_SYNERGY: 10,

  ALLY_CARRY_PEEL: 12,

  ALLY_CATCH_SYNERGY: 10,

  OPPONENT_ASSASSIN_DEFENSE: 12,

  OPPONENT_POKE_ENGAGE: 10,

  OPPONENT_ENGAGE_PEEL: 10,

  OPPONENT_MELEE_RANGE: 8,

  OPPONENT_RANGED_CATCH: 8,

  OPPONENT_WAVECLEAR: 6,

  DAMAGE_BALANCE_PRIMARY: 15,

  DAMAGE_BALANCE_MIXED: 8,

  DAMAGE_BALANCE_SAME_TYPE_PENALTY: -15,

  CANDIDATE_RISK_ASSASSIN: -12,

  CANDIDATE_RISK_ENGAGE: -12,

  CANDIDATE_RISK_HIGH_CC: -8,

  CANDIDATE_RISK_EARLY_PRESSURE: -8,

  CANDIDATE_RISK_MAX_PENALTY: -24,

  ENEMY_COMP_DIVE_PEEL: 12,
  ENEMY_COMP_DIVE_MOBILITY: 8,
  ENEMY_COMP_DIVE_SQUISHY: -10,

  ENEMY_COMP_POKE_ENGAGE: 12,
  ENEMY_COMP_POKE_MOBILITY: 8,
  ENEMY_COMP_POKE_IMMOBILE: -10,

  ENEMY_COMP_FRONT_TANK_KILLER: 12,
  ENEMY_COMP_FRONT_DPS: 10,
  ENEMY_COMP_FRONT_CARRY: 8,

  ENEMY_COMP_CATCH_MOBILITY: 10,
  ENEMY_COMP_CATCH_FRONTLINE: 8,
  ENEMY_COMP_CATCH_IMMOBILE: -10,

  ENEMY_COMP_MAX_BONUS: 24,
  ENEMY_COMP_MAX_PENALTY: -20,

  TRAIT_SCORE_MAX_BONUS: 10,
  TRAIT_SCORE_MAX_PENALTY: -10,
} as const;

export const ROLE_SUITABILITY_SCORE = {
  1: -15,
  2: -8,
  3: 0,
  4: 5,
  5: 10,
} as const satisfies Record<RoleSuitabilityRating, number>;

export const BLIND_PICK_SCORE = {
  1: -10,
  2: -5,
  3: 0,
  4: 5,
  5: 10,
} as const satisfies Record<DraftMetricRating, number>;

export const TEAMFIGHT_SCORE = {
  1: -10,
  2: -5,
  3: 0,
  4: 5,
  5: 10,
} as const satisfies Record<DraftMetricRating, number>;

export const ROAM_SCORE = {
  1: -10,
  2: -5,
  3: 0,
  4: 5,
  5: 10,
} as const satisfies Record<DraftMetricRating, number>;

export const SIDE_LANE_SCORE = {
  1: -10,
  2: -5,
  3: 0,
  4: 5,
  5: 10,
} as const satisfies Record<DraftMetricRating, number>;
