"use client";

import ChampionSearch from "./ChampionSearch";
import type { Champion } from "../types/champion";
import type {
  DraftPhaseState,
  PlayerTeamSide,
} from "../types/draftPhase";

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

  bans: (Champion | null)[];
  setBans: React.Dispatch<React.SetStateAction<(Champion | null)[]>>;

  selectedChampions: Champion[];
};

type TeamInputProps = {
  draftPhaseState: DraftPhaseState;
  playerTeamSide: PlayerTeamSide;

  allyTeam: (Champion | null)[];
  setAllyTeam: React.Dispatch<React.SetStateAction<(Champion | null)[]>>;

  enemyTeam: (Champion | null)[];
  setEnemyTeam: React.Dispatch<React.SetStateAction<(Champion | null)[]>>;

  allyBans: (Champion | null)[];
  setAllyBans: React.Dispatch<React.SetStateAction<(Champion | null)[]>>;

  enemyBans: (Champion | null)[];
  setEnemyBans: React.Dispatch<React.SetStateAction<(Champion | null)[]>>;
};

function TeamPanel({
  title,
  team,
  setTeam,
  bans,
  setBans,
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

        <ul className="space-y-3">
          {bans.map((ban, index) => (
            <li key={index}>
              <ChampionSearch
                role={teamRoles[index].label}
                value={ban}
                excludedChampions={selectedChampions.filter(
                  (champion) => champion.id !== ban?.id
                )}
                onSelect={(champion) => {
                  const next = [...bans];
                  next[index] = champion;
                  setBans(next);
                }}
              />
            </li>
          ))}
        </ul>
      </div>    
    </div>
  );
}

export default function TeamInput({
  draftPhaseState,
  playerTeamSide,
  allyTeam,
  setAllyTeam,
  enemyTeam,
  setEnemyTeam,
  allyBans,
  setAllyBans,
  enemyBans,
  setEnemyBans,
}: TeamInputProps) {
  const selectedPicks = [...allyTeam, ...enemyTeam].filter(
    (champion): champion is Champion => champion !== null
  );

  const selectedBans = [...allyBans, ...enemyBans].filter(
    (champion): champion is Champion => champion !== null
  );

  const selectedChampions = [...selectedPicks, ...selectedBans];

  return (
    <section
      data-draft-mode={draftPhaseState.mode}
      data-draft-turn={draftPhaseState.currentTurn}
      data-player-team-side={playerTeamSide}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <TeamPanel
          title="味方チーム"
          team={allyTeam}
          setTeam={setAllyTeam}
          bans={allyBans}
          setBans={setAllyBans}
          selectedChampions={selectedChampions}
        />

        <TeamPanel
          title="敵チーム"
          team={enemyTeam}
          setTeam={setEnemyTeam}
          bans={enemyBans}
          setBans={setEnemyBans}
          selectedChampions={selectedChampions}
        />
      </div>
    </section>
  );
}
