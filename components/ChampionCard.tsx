import Image from "next/image";
import { RIOT_IMAGE_URL } from "../lib/riot";
import type { Champion } from "../types/champion";

type ChampionCardProps = {
  champion: Champion;
  size?: number;
};

export default function ChampionCard({
  champion,
  size = 40,
}: ChampionCardProps) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={`${RIOT_IMAGE_URL}${champion.image}`}
        alt={champion.name}
        width={size}
        height={size}
        className="rounded-md"
      />

      <span className="text-slate-100">
        {champion.name}
      </span>
    </div>
  );
}