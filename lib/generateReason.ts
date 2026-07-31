import { getChampionDetail } from "./analyzeTraits";
import { TRAITS } from "../src/constants/traits";

import type { Trait } from "../src/constants/traits";
import type { Champion } from "../types/champion";

type ReasonRule = Readonly<{
  enemyTrait: Trait;
  allyTraits: readonly Trait[];
  reason: string;
}>;

const MAX_REASONS = 3;

const REASON_RULES = [
  {
    enemyTrait: TRAITS.BURST,
    allyTraits: [TRAITS.PEEL],
    reason: "敵のバースト構成に対してピール性能があります",
  },
  {
    enemyTrait: TRAITS.CC,
    allyTraits: [TRAITS.POKE, TRAITS.MOBILITY],
    reason: "敵のCCに対して距離を維持しながら戦えます",
  },
  {
    enemyTrait: TRAITS.POKE,
    allyTraits: [TRAITS.ENGAGE, TRAITS.MOBILITY],
    reason: "敵のポークに対して距離を詰めやすいです",
  },
  {
    enemyTrait: TRAITS.ENGAGE,
    allyTraits: [TRAITS.PEEL, TRAITS.CC],
    reason: "敵のエンゲージを受け止めて味方を守れます",
  },
  {
    enemyTrait: TRAITS.MOBILITY,
    allyTraits: [TRAITS.CC],
    reason: "機動力の高い敵をCCで捕まえやすいです",
  },
  {
    enemyTrait: TRAITS.SIEGE,
    allyTraits: [TRAITS.ENGAGE, TRAITS.MOBILITY],
    reason: "敵のシージ構成に対して強制的に戦闘を始められます",
  },
  {
    enemyTrait: TRAITS.IMMOBILE,
    allyTraits: [TRAITS.BURST, TRAITS.CC, TRAITS.ENGAGE],
    reason: "移動手段の少ない敵を捕まえて倒しやすいです",
  },
  {
    enemyTrait: TRAITS.SQUISHY,
    allyTraits: [TRAITS.BURST, TRAITS.POKE],
    reason: "耐久力の低い敵へ大きなプレッシャーを与えられます",
  },
  {
    enemyTrait: TRAITS.DPS,
    allyTraits: [TRAITS.BURST, TRAITS.CC],
    reason: "敵が継続火力を出す前に行動を制限できます",
  },
  {
    enemyTrait: TRAITS.WEAK_EARLY,
    allyTraits: [TRAITS.BURST, TRAITS.ROAM, TRAITS.ENGAGE],
    reason: "序盤が弱い敵へ早い時間帯から圧力をかけられます",
  },
  {
    enemyTrait: TRAITS.SPLIT_PUSH,
    allyTraits: [TRAITS.ROAM, TRAITS.MOBILITY],
    reason: "敵のスプリットプッシュへ素早く対応できます",
  },
  {
    enemyTrait: TRAITS.SCALING,
    allyTraits: [TRAITS.SCALING],
    reason: "後半のスケール勝負に向いています",
  },
] satisfies readonly ReasonRule[];

export function generateReason(
  enemyTeam: (Champion | null)[],
  champion: Champion,
): string[] {
  const allyDetail = getChampionDetail(champion.id);

  if (!allyDetail) {
    return [];
  }

  const enemyTraits = new Set<Trait>();

  for (const enemyChampion of enemyTeam) {
    if (!enemyChampion) {
      continue;
    }

    const enemyDetail = getChampionDetail(enemyChampion.id);

    enemyDetail?.traits.forEach((trait) => enemyTraits.add(trait));
  }

  const allyTraits = new Set(allyDetail.traits);

  return REASON_RULES
    .filter(
      ({ enemyTrait, allyTraits: counterTraits }) =>
        enemyTraits.has(enemyTrait) &&
        counterTraits.some((trait) => allyTraits.has(trait)),
    )
    .slice(0, MAX_REASONS)
    .map(({ reason }) => reason);
}
