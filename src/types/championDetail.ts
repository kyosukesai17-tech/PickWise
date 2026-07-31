import type { Trait } from "../constants/traits";

export type Rating = 1 | 2 | 3 | 4 | 5;

export type ChampionArchetype =
  | "FRONTLINE"
  | "CARRY"
  | "ASSASSIN"
  | "CATCH";

export interface ChampionDetail {
  difficulty: number;
  class: string[];
  damageType: "AD" | "AP" | "Mixed";
  rangeType: "Melee" | "Ranged";
  strengths: string[];
  weaknesses: string[];
  traits: Trait[];
  ratings: {
    tankiness: Rating;
    cc: Rating;
    waveClear: Rating;
    scaling: Rating;
  };
  archetypes: ChampionArchetype[];
}
