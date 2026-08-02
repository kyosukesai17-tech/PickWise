import type { Trait } from "../constants/traits";
import type { Role } from "../../types/champion";

export type Rating = 1 | 2 | 3 | 4 | 5;
export type DraftMetricRating = 1 | 2 | 3 | 4 | 5;
export type RoleSuitabilityRating = Rating;
export type ChampionRoleSuitability = Partial<
  Record<Role, RoleSuitabilityRating>
>;

export type ChampionArchetype =
  | "FRONTLINE"
  | "CARRY"
  | "ASSASSIN"
  | "CATCH";

export interface DraftMetrics {
  blindPick: DraftMetricRating;
  roam: DraftMetricRating;
  teamfight: DraftMetricRating;
  sideLane: DraftMetricRating;
  pickPotential: DraftMetricRating;
  objectiveControl: DraftMetricRating;
}

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
  roleSuitability: ChampionRoleSuitability;
  draftMetrics?: DraftMetrics;
}
