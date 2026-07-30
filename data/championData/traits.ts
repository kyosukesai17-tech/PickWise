export const TRAITS = {
  FRONTLINE: "FRONTLINE",
  ENGAGE: "ENGAGE",
  PEEL: "PEEL",
  POKE: "POKE",
  CARRY: "CARRY",
  ASSASSIN: "ASSASSIN",
  CATCH: "CATCH",
  SIEGE: "SIEGE",
  SPLIT_PUSH: "SPLIT_PUSH",
} as const;

export type ChampionTrait =
  (typeof TRAITS)[keyof typeof TRAITS];