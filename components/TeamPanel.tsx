import ChampionSearch from "./ChampionSearch";
import type { Champion } from "../types/champion";

type TeamPanelProps = {
  title: string;
  team: (Champion | null)[];
  onChange: (index: number, champion: Champion | null) => void;
};

const roles = ["TOP", "JG", "MID", "ADC", "SUP"];

export default function TeamPanel({
  title,
  team,
  onChange,
}: TeamPanelProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <h2 className="mb-4 text-lg font-bold text-white">
        {title}
      </h2>

      <div className="space-y-3">
        {roles.map((role, index) => (
          <ChampionSearch
            key={role}
            role={role}
            value={team[index]}
            onSelect={(champion) => onChange(index, champion)}
          />
        ))}
      </div>
    </div>
  );
}