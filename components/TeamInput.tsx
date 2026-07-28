"use client";

import ChampionSearch from "./ChampionSearch";
import type { Champion } from "../types/champion";

const teamRoles = [
  { label: "TOP" },
  { label: "JG" },
  { label: "MID" },
  { label: "ADC" },
  { label: "SUP" },
] as const;

type TeamPanelProps = {
  title: string;
  team: (Champion | null)[];
  setTeam: React.Dispatch<React.SetStateAction<(Champion | null)[]>>;
};

type TeamInputProps = {
  allyTeam: (Champion | null)[];
  setAllyTeam: React.Dispatch<React.SetStateAction<(Champion | null)[]>>;
  enemyTeam: (Champion | null)[];
  setEnemyTeam: React.Dispatch<React.SetStateAction<(Champion | null)[]>>;
};

function TeamPanel({
  title,
  team,
  setTeam,
}: TeamPanelProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6">
      <h3 className="mb-4 text-center text-lg font-semibold text-slate-200">
        {title}
      </h3>

      <ul className="space-y-3">
        {teamRoles.map(({ label }, index) => (
          <li key={label}>
            <ChampionSearch
              role={label}
              value={team[index]}
              onSelect={(champion) => {
                const next = [...team];
                next[index] = champion;
                setTeam(next);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TeamInput({
  allyTeam,
  setAllyTeam,
  enemyTeam,
  setEnemyTeam,
}: TeamInputProps) {
  return (
    <section>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <TeamPanel
          title="味方チーム"
          team={allyTeam}
          setTeam={setAllyTeam}
        />

        <TeamPanel
          title="敵チーム"
          team={enemyTeam}
          setTeam={setEnemyTeam}
        />
      </div>
    </section>
  );
}