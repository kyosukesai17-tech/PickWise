export type DamageType = "AD" | "AP" | "MIXED";

export type AttackRange = "MELEE" | "RANGED";

export interface ChampionData {
  damageType: DamageType;

  range: AttackRange;

  tankiness: 1 | 2 | 3 | 4 | 5;

  cc: 1 | 2 | 3 | 4 | 5;

  engage: boolean;

  peel: boolean;

  poke: boolean;

  waveClear: 1 | 2 | 3 | 4 | 5;

  scaling: 1 | 2 | 3 | 4 | 5;
}