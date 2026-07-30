import { getChampions } from "./getChampions";
import type { Role } from "../types/champion";

export function searchChampion(
  keyword: string,
  role?: Role
) {
  const lowerKeyword = keyword.toLowerCase().trim();

  return getChampions().filter((champion) => {
    const matchKeyword =
      lowerKeyword === "" ||
      champion.name.toLowerCase().startsWith(lowerKeyword) ||
      champion.id.toLowerCase().startsWith(lowerKeyword);

    const matchRole =
      !role || champion.roles.includes(role);

    return matchKeyword && matchRole;
  });
}