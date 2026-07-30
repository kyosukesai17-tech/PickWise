import { getChampions } from "./getChampions";
import type { Role } from "../types/champion";

export function searchChampion(
  keyword: string,
  role?: Role
) {
  const lower = keyword.toLowerCase();

  return getChampions().filter((champion) => {
    const matchRole =
      !role || champion.roles.includes(role);

    const matchKeyword =
      keyword.trim() === "" ||
      champion.name.startsWith(keyword) ||
      champion.id.toLowerCase().startsWith(lower);

    return matchRole && matchKeyword;
  });
}