export interface ChampionDetail {
  difficulty: number;
  class: string[];
  damageType: "AD" | "AP" | "Mixed";
  rangeType: "Melee" | "Ranged";
  strengths: string[];
  weaknesses: string[];
}
