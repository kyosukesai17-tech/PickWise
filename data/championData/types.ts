import type {
  Rating,
  DamageType,
  AttackRange,
} from "./ratings";

import type { ChampionTrait } from "./traits";

export interface ChampionAttributes {
  damageType: DamageType;
  range: AttackRange;
}

export interface ChampionRatings {
  tankiness: Rating;
  cc: Rating;
  waveClear: Rating;
  scaling: Rating;
}

export interface ChampionData {
  attributes: ChampionAttributes;
  ratings: ChampionRatings;
  traits: ChampionTrait[];
}

export interface TeamAnalysis {
  apCount: number;
  adCount: number;
  frontlineCount: number;
  ccScore: number;

  needAP: boolean;
  needAD: boolean;
  needTank: boolean;
  needCC: boolean;
}