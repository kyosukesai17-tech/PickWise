import { TRAITS } from "./traits";
import type { ChampionData } from "./types";

export const championDataIL: Record<string, ChampionData> = {
  Lux: {
  attributes: {
    damageType: "AP",
    range: "RANGED",
  },

  ratings: {
    tankiness: 1,
    cc: 3,
    waveClear: 4,
    scaling: 5,
  },

  traits: [
    TRAITS.FRONTLINE,
    TRAITS.ENGAGE,
    TRAITS.PEEL
  ],
},
};
