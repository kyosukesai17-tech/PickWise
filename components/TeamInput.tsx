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
  selectedChampions: Champion[];
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
  selectedChampions,
}: TeamPanelProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6">
      <h3 className="mb-5 text-center text-lg font-semibold text-slate-200">
        {title}
      </h3>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Pick
        </p>

        <ul className="space-y-3">
          {teamRoles.map(({ label }, index) => (
            <li key={label}>
              <ChampionSearch
                role={label}
                value={team[index]}
                excludedChampions={selectedChampions.filter(
                  (champion) => champion.id !== team[index]?.id
                )}
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

      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Ban
        </p>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square rounded-md border border-dashed border-slate-700 bg-slate-800/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TeamInput({
  allyTeam,
  setAllyTeam,
  enemyTeam,
  setEnemyTeam,
}: TeamInputProps) {
  const selectedChampions = [...allyTeam, ...enemyTeam].filter(
    (champion): champion is Champion => champion !== null
  );

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <TeamPanel
          title="味方チーム"
          team={allyTeam}
          setTeam={setAllyTeam}
          selectedChampions={selectedChampions}
        />

        <TeamPanel
          title="敵チーム"
          team={enemyTeam}
          setTeam={setEnemyTeam}
          selectedChampions={selectedChampions}
        />
      </div>
    </section>
  );
}