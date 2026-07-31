import championsData from "../src/data/champions.json";
import type { Champion } from "../types/champion";

export function getChampions(): Champion[] {
  return championsData as Champion[];
}
