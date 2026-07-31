export const TRAITS = {
  BURST: "BURST",
  DPS: "DPS",
  POKE: "POKE",
  TANK_KILLER: "TANK_KILLER",
  CC: "CC",
  ENGAGE: "ENGAGE",
  PEEL: "PEEL",
  MOBILITY: "MOBILITY",
  ROAM: "ROAM",
  SIEGE: "SIEGE",
  SPLIT_PUSH: "SPLIT_PUSH",
  SCALING: "SCALING",
  IMMOBILE: "IMMOBILE",
  SQUISHY: "SQUISHY",
  WEAK_EARLY: "WEAK_EARLY",
} as const;

export type Trait =
  (typeof TRAITS)[keyof typeof TRAITS];
