import ChampionCard from "./ChampionCard";
import type { Champion } from "../types/champion";

type ChampionDropdownProps = {
  champions: Champion[];
  onSelect: (champion: Champion) => void;
};

export default function ChampionDropdown({
  champions,
  onSelect,
}: ChampionDropdownProps) {
  if (champions.length === 0) {
    return null;
  }

  return (
    <ul className="absolute z-20 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
      {champions.slice(0, 10).map((champion) => (
        <li
          key={champion.id}
          onClick={() => onSelect(champion)}
          className="cursor-pointer px-3 py-2 hover:bg-slate-800"
        >
          <ChampionCard
            champion={champion}
            size={36}
          />
        </li>
      ))}
    </ul>
  );
}