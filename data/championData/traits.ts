import {
  TRAITS as currentTraits,
} from "../../src/constants/traits";
import type { Trait } from "../../src/constants/traits";

type LegacyTraitAliases = {
  readonly FRONTLINE: typeof currentTraits.CC;
  readonly CARRY: typeof currentTraits.DPS;
  readonly ASSASSIN: typeof currentTraits.BURST;
  readonly CATCH: typeof currentTraits.CC;
};

export const TRAITS = Object.defineProperties(
  { ...currentTraits },
  {
    FRONTLINE: { value: currentTraits.CC },
    CARRY: { value: currentTraits.DPS },
    ASSASSIN: { value: currentTraits.BURST },
    CATCH: { value: currentTraits.CC },
  },
) as typeof currentTraits & LegacyTraitAliases;

export type { Trait };
export type ChampionTrait = Trait;
