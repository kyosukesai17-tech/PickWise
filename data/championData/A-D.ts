import { TRAITS } from "./traits";
import type { ChampionData } from "./types";

export const championDataAD: Record<string, ChampionData> = {
  Ahri: {
    attributes: {
      damageType: "AP",
      range: "RANGED",
    },
    ratings: {
      tankiness: 1,
      cc: 3,
      waveClear: 4,
      scaling: 3,
    },
    traits: [
      TRAITS.POKE,
      TRAITS.CATCH,
    ],
  },

  Alistar: {
    attributes: {
      damageType: "AP",
      range: "MELEE",
    },
    ratings: {
      tankiness: 5,
      cc: 5,
      waveClear: 1,
      scaling: 2,
    },
    traits: [
      TRAITS.FRONTLINE,
      TRAITS.ENGAGE,
      TRAITS.PEEL,
    ],
  },

  Amumu: {
    attributes: {
      damageType: "AP",
      range: "MELEE",
    },
    ratings: {
      tankiness: 5,
      cc: 5,
      waveClear: 3,
      scaling: 4,
    },
    traits: [
      TRAITS.FRONTLINE,
      TRAITS.ENGAGE,
    ],
  },

  Annie: {
    attributes: {
      damageType: "AP",
      range: "RANGED",
    },
    ratings: {
      tankiness: 1,
      cc: 4,
      waveClear: 3,
      scaling: 3,
    },
    traits: [
      TRAITS.CATCH,
    ],
  },

  Ashe: {
    attributes: {
      damageType: "AD",
      range: "RANGED",
    },
    ratings: {
      tankiness: 1,
      cc: 4,
      waveClear: 3,
      scaling: 4,
    },
    traits: [
      TRAITS.POKE,
      TRAITS.CARRY,
    ],
  },

  Blitzcrank: {
    attributes: {
      damageType: "AP",
      range: "MELEE",
    },
    ratings: {
      tankiness: 4,
      cc: 5,
      waveClear: 1,
      scaling: 2,
    },
    traits: [
      TRAITS.ENGAGE,
      TRAITS.CATCH,
    ],
  },

  Braum: {
    attributes: {
      damageType: "AP",
      range: "MELEE",
    },
    ratings: {
      tankiness: 5,
      cc: 4,
      waveClear: 1,
      scaling: 3,
    },
    traits: [
      TRAITS.FRONTLINE,
      TRAITS.PEEL,
    ],
  },

  Caitlyn: {
    attributes: {
      damageType: "AD",
      range: "RANGED",
    },
    ratings: {
      tankiness: 1,
      cc: 2,
      waveClear: 4,
      scaling: 4,
    },
    traits: [
      TRAITS.POKE,
      TRAITS.SIEGE,
      TRAITS.CARRY,
    ],
  },

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