import { getChampions } from "./getChampions";
import type { Role } from "../types/champion";

export function searchChampion(keyword: string, role?: Role) {
  const lower = keyword.toLowerCase();

  const champions = getChampions();

console.log("champions:", champions.length);
console.log(champions[0]);

const result = champions.filter((champion) => {
    const matchKeyword =
      keyword.trim() === "" ||
      champion.name.startsWith(keyword) ||
      champion.id.toLowerCase().startsWith(lower);

    return matchKeyword;
  });

  console.log("role:", role);
  console.log("keyword:", keyword);
  console.log("result:", result.length);

  return result;
}

