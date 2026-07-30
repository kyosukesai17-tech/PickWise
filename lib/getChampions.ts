import riotData from "../data/champions.json";
import { championRoles } from "../data/championRoles";
import type { Champion } from "../types/champion";

type RiotChampion = {
  id: string;
  key: string;
  name: string;
  image: {
    full: string;
  };
};

const data = riotData as {
  data: Record<string, RiotChampion>;
};

export function getChampions(): Champion[] {
  return Object.values(data.data).map((champion) => ({
    id: champion.id,
    key: champion.key,
    name: champion.name,
    image: champion.image.full,
    roles: championRoles[champion.id] ?? [],
  }));
}