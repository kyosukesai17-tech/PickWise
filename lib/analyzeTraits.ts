import championDetailsData from "../src/data/championDetails.json";
import { TRAITS } from "../src/constants/traits";

import type { Trait } from "../src/constants/traits";
import type { ChampionDetail } from "../src/types/championDetail";

type TraitPoints = Readonly<Partial<Record<Trait, number>>>;
type TraitMatchups = Readonly<Partial<Record<Trait, TraitPoints>>>;

const MATCHUP_POINTS = {
  [TRAITS.BURST]: {
    [TRAITS.PEEL]: 3,
    [TRAITS.CC]: 2,
  },
  [TRAITS.DPS]: {
    [TRAITS.BURST]: 2,
    [TRAITS.CC]: 2,
  },
  [TRAITS.POKE]: {
    [TRAITS.ENGAGE]: 3,
    [TRAITS.MOBILITY]: 2,
  },
  [TRAITS.TANK_KILLER]: {
    [TRAITS.CC]: 2,
    [TRAITS.POKE]: 1,
  },
  [TRAITS.CC]: {
    [TRAITS.PEEL]: 2,
    [TRAITS.POKE]: 1,
  },
  [TRAITS.ENGAGE]: {
    [TRAITS.PEEL]: 3,
    [TRAITS.CC]: 2,
  },
  [TRAITS.PEEL]: {
    [TRAITS.POKE]: 2,
    [TRAITS.DPS]: 1,
  },
  [TRAITS.MOBILITY]: {
    [TRAITS.CC]: 3,
  },
  [TRAITS.ROAM]: {
    [TRAITS.CC]: 2,
  },
  [TRAITS.SIEGE]: {
    [TRAITS.ENGAGE]: 3,
    [TRAITS.MOBILITY]: 2,
  },
  [TRAITS.SPLIT_PUSH]: {
    [TRAITS.ROAM]: 2,
    [TRAITS.MOBILITY]: 2,
    [TRAITS.ENGAGE]: 1,
  },
  [TRAITS.SCALING]: {
    [TRAITS.BURST]: 2,
    [TRAITS.ROAM]: 2,
  },
  [TRAITS.IMMOBILE]: {
    [TRAITS.BURST]: 3,
    [TRAITS.CC]: 2,
    [TRAITS.POKE]: 2,
    [TRAITS.ENGAGE]: 2,
  },
  [TRAITS.SQUISHY]: {
    [TRAITS.BURST]: 3,
    [TRAITS.POKE]: 2,
  },
  [TRAITS.WEAK_EARLY]: {
    [TRAITS.ROAM]: 3,
    [TRAITS.BURST]: 2,
    [TRAITS.ENGAGE]: 1,
  },
} satisfies TraitMatchups;

const championDetails = championDetailsData as Readonly<
  Record<string, ChampionDetail>
>;

export function analyzeTraits(
  enemyDetail: ChampionDetail,
  allyDetail: ChampionDetail,
): number {
  return enemyDetail.traits.reduce((score, enemyTrait) => {
    const points = MATCHUP_POINTS[enemyTrait] as TraitPoints | undefined;

    if (!points) {
      return score;
    }

    return score + allyDetail.traits.reduce(
      (traitScore, allyTrait) => traitScore + (points[allyTrait] ?? 0),
      0,
    );
  }, 0);
}

export function getChampionDetail(
  championId: string,
): ChampionDetail | undefined {
  return championDetails[championId];
}

export function analyzeChampionTraitMatchup(
  enemyChampionId: string,
  allyChampionId: string,
): number | undefined {
  const enemyDetail = getChampionDetail(enemyChampionId);
  const allyDetail = getChampionDetail(allyChampionId);

  if (!enemyDetail || !allyDetail) {
    return undefined;
  }

  return analyzeTraits(enemyDetail, allyDetail);
}
