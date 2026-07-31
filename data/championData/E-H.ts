import { TRAITS } from "./traits";
import type { ChampionData } from "./types";

export const championDataEH: Record<string, ChampionData> = {
  Ekko: {
    attributes: {
      damageType: "AP",
      range: "MELEE",
    },
    ratings: {
      tankiness: 2,
      cc: 2,
      waveClear: 4,
      scaling: 4,
    },
    traits: [
      TRAITS.ASSASSIN,
      TRAITS.CARRY,
    ],
  },

  Ezreal: {
    attributes: {
      damageType: "AD",
      range: "RANGED",
    },
    ratings: {
      tankiness: 1,
      cc: 1,
      waveClear: 2,
      scaling: 4,
    },
    traits: [
      TRAITS.POKE,
      TRAITS.SIEGE,
      TRAITS.CARRY,
    ],
  },

  Fiora: {
    attributes: {
      damageType: "AD",
      range: "MELEE",
    },
    ratings: {
      tankiness: 2,
      cc: 1,
      waveClear: 2,
      scaling: 5,
    },
    traits: [
      TRAITS.CARRY,
      TRAITS.SPLIT_PUSH,
    ],
  },

  Fizz: {
    attributes: {
      damageType: "AP",
      range: "MELEE",
    },
    ratings: {
      tankiness: 2,
      cc: 3,
      waveClear: 3,
      scaling: 3,
    },
    traits: [
      TRAITS.ASSASSIN,
      TRAITS.CATCH,
    ],
  },

  Galio: {
    attributes: {
      damageType: "AP",
      range: "MELEE",
    },
    ratings: {
      tankiness: 4,
      cc: 5,
      waveClear: 4,
      scaling: 3,
    },
    traits: [
      TRAITS.FRONTLINE,
      TRAITS.ENGAGE,
      TRAITS.PEEL,
    ],
  },
};
