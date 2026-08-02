import { SCORE } from "./scoring";
import { TRAITS } from "../src/constants/traits";

import type { EnemyTeamAnalysis } from "./analyzeEnemyTeam";
import type { ChampionDetail } from "../src/types/championDetail";

export interface EnemyCompositionReason {
  score: number;
  text: string;
}

export interface EnemyCompositionScore {
  score: number;
  reasons: EnemyCompositionReason[];
}

export function analyzeEnemyComposition(
  enemyAnalysis: EnemyTeamAnalysis,
  candidate: ChampionDetail,
): EnemyCompositionScore {
  const reasons: EnemyCompositionReason[] = [];
  const hasPeel = candidate.traits.includes(TRAITS.PEEL);
  const hasMobility = candidate.traits.includes(TRAITS.MOBILITY);
  const hasEngage = candidate.traits.includes(TRAITS.ENGAGE);
  const hasTankKiller = candidate.traits.includes(TRAITS.TANK_KILLER);
  const hasDps = candidate.traits.includes(TRAITS.DPS);
  const isFrontline = candidate.archetypes.includes("FRONTLINE");
  const isCarry = candidate.archetypes.includes("CARRY");
  let score = 0;

  const addModifier = (modifier: number, text: string) => {
    const nextScore = Math.min(
      SCORE.ENEMY_COMP_MAX_BONUS,
      Math.max(
        SCORE.ENEMY_COMP_MAX_PENALTY,
        score + modifier,
      ),
    );
    const appliedModifier = nextScore - score;

    score = nextScore;

    if (appliedModifier !== 0) {
      reasons.push({ score: appliedModifier, text });
    }
  };

  if (enemyAnalysis.compositionTypes.includes("DIVE")) {
    if (hasPeel) {
      addModifier(
        SCORE.ENEMY_COMP_DIVE_PEEL,
        "敵のDive構成に対して味方を守りやすい",
      );
    }

    if (hasMobility) {
      addModifier(
        SCORE.ENEMY_COMP_DIVE_MOBILITY,
        "敵のDive構成から距離を取り直しやすい",
      );
    }

  }

  if (enemyAnalysis.compositionTypes.includes("POKE")) {
    if (hasEngage) {
      addModifier(
        SCORE.ENEMY_COMP_POKE_ENGAGE,
        "敵のPoke構成へ強制的に仕掛けやすい",
      );
    }

    if (hasMobility) {
      addModifier(
        SCORE.ENEMY_COMP_POKE_MOBILITY,
        "敵のPoke構成に対して攻撃を避けながら接近しやすい",
      );
    }

  }

  if (enemyAnalysis.compositionTypes.includes("FRONT_TO_BACK")) {
    if (hasTankKiller) {
      addModifier(
        SCORE.ENEMY_COMP_FRONT_TANK_KILLER,
        "敵の前衛構成へ対タンク性能を発揮しやすい",
      );
    }

    if (hasDps) {
      addModifier(
        SCORE.ENEMY_COMP_FRONT_DPS,
        "敵の前衛構成を継続火力で削りやすい",
      );
    }

    if (isCarry) {
      addModifier(
        SCORE.ENEMY_COMP_FRONT_CARRY,
        "敵の前衛構成との集団戦で主要火力を担いやすい",
      );
    }
  }

  if (enemyAnalysis.compositionTypes.includes("CATCH")) {
    if (hasMobility) {
      addModifier(
        SCORE.ENEMY_COMP_CATCH_MOBILITY,
        "敵のCatch構成に対して捕獲を回避しやすい",
      );
    }

    if (isFrontline) {
      addModifier(
        SCORE.ENEMY_COMP_CATCH_FRONTLINE,
        "敵のCatch構成に対して前衛を担当しやすい",
      );
    }

  }

  return { score, reasons };
}
