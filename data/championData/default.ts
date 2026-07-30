import type { ChampionData } from "./types";

export const defaultChampionData: ChampionData = {
  attributes: {
    damageType: "AD",
    range: "MELEE",
  },

  ratings: {
    tankiness: 3,
    cc: 1,
    waveClear: 3,
    scaling: 3,
  },

  traits: [],
};