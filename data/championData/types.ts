import type {
  Rating,
  DamageType,
  AttackRange,
} from "./ratings";

import type { ChampionTrait } from "./traits";

export interface ChampionProfile {
  damageType: DamageType;

  range: AttackRange;

  tankiness: Rating;

  cc: Rating;

  waveClear: Rating;

  scaling: Rating;
}

export interface ChampionData {
  profile: ChampionProfile;

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