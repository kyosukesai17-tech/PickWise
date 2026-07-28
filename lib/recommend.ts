import type { Champion } from "../types/champion";
import { addScore } from "./score";
import { allyRules, enemyRules } from "./rules";

export function recommend(
  allyTeam: (Champion | null)[],
  enemyTeam: (Champion | null)[]
) {
  const scores: Record<string, number> = {};

  for (const champion of allyTeam) {
    if (!champion) continue;

    const rule =
      allyRules[champion.id as keyof typeof allyRules];

    if (!rule) continue;

    for (const [name, value] of Object.entries(rule)) {
      addScore(scores, name, value);
    }
  }

  for (const champion of enemyTeam) {
    if (!champion) continue;

    const rule =
      enemyRules[champion.id as keyof typeof enemyRules];

    if (!rule) continue;

    for (const [name, value] of Object.entries(rule)) {
      addScore(scores, name, value);
    }
  }

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([name, score]) => ({
      name,
      score,
    }));
}