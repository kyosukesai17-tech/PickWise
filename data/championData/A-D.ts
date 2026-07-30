import type { ChampionData } from "./types";

export const championDataAD: Record<string, ChampionData> = {
  Ahri: {
    damageType: "AP",
    range: "RANGED",
    tankiness: 1,
    cc: 3,
    engage: true,
    peel: true,
    poke: true,
    waveClear: 4,
    scaling: 3,
  },

  Alistar: {
    damageType: "AP",
    range: "MELEE",
    tankiness: 5,
    cc: 5,
    engage: true,
    peel: true,
    poke: false,
    waveClear: 1,
    scaling: 2,
  },

  Amumu: {
    damageType: "AP",
    range: "MELEE",
    tankiness: 5,
    cc: 5,
    engage: true,
    peel: true,
    poke: false,
    waveClear: 3,
    scaling: 4,
  },

  Annie: {
    damageType: "AP",
    range: "RANGED",
    tankiness: 1,
    cc: 4,
    engage: true,
    peel: false,
    poke: true,
    waveClear: 3,
    scaling: 3,
  },

  Ashe: {
    damageType: "AD",
    range: "RANGED",
    tankiness: 1,
    cc: 4,
    engage: true,
    peel: true,
    poke: true,
    waveClear: 3,
    scaling: 4,
  },

  Blitzcrank: {
    damageType: "AP",
    range: "MELEE",
    tankiness: 4,
    cc: 5,
    engage: true,
    peel: true,
    poke: false,
    waveClear: 1,
    scaling: 2,
  },

  Braum: {
    damageType: "AP",
    range: "MELEE",
    tankiness: 5,
    cc: 4,
    engage: false,
    peel: true,
    poke: false,
    waveClear: 1,
    scaling: 3,
  },

  Caitlyn: {
    damageType: "AD",
    range: "RANGED",
    tankiness: 1,
    cc: 2,
    engage: false,
    peel: false,
    poke: true,
    waveClear: 4,
    scaling: 4,
  },
};