import { TRAITS } from "./traits";
import type { ChampionData } from "./types";

export const championDataAD: Record<string, ChampionData> = {
  Ahri: {
    profile: {
      damageType: "AP",
      range: "RANGED",
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
    profile: {
      damageType: "AP",
      range: "MELEE",
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
    profile: {
      damageType: "AP",
      range: "MELEE",
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
    profile: {
      damageType: "AP",
      range: "RANGED",
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
    profile: {
      damageType: "AD",
      range: "RANGED",
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
    profile: {
      damageType: "AP",
      range: "MELEE",
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
    profile: {
      damageType: "AP",
      range: "MELEE",
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
    profile: {
      damageType: "AD",
      range: "RANGED",
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
};