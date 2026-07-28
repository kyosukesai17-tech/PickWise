import riotData from "../data/champions.json";
import type { Champion } from "../types/champion";

type RiotChampion = {
  id: string;
  key: string;
  name: string;
  image: {
    full: string;
  };
};

type RiotChampionData = {
  data: Record<string, RiotChampion>;
};

const data = riotData as RiotChampionData;

export function getChampions(): Champion[] {
  return Object.values(data.data).map((champion) => ({
    id: champion.id,
    key: champion.key,
    name: champion.name,
    image: champion.image.full,

    // 後でロールデータを追加する
    roles: [],
  }));
}