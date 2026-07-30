import { getChampions } from "./getChampions";
import type { Champion } from "../types/champion";

export function recommendChampions(
  allyTeam: (Champion | null)[],
  enemyTeam: (Champion | null)[]
): Champion[] {
  const selectedIds = [...allyTeam, ...enemyTeam]
    .filter((c): c is Champion => c !== null)
    .map((c) => c.id);

  return getChampions()
    .filter((c) => !selectedIds.includes(c.id))
    .slice(0, 10);
}