"use client";

import ChampionSearch from "./ChampionSearch";
import type { Champion } from "../types/champion";
import type {
  DraftPhaseState,
  PlayerTeamSide,
} from "../types/draftPhase";
import type { RoleResolutionSource } from "../lib/lcu/convertChampSelectSession";

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
  roleSources: RoleResolutionSource[];
  setRoleSources: React.Dispatch<React.SetStateAction<RoleResolutionSource[]>>;
  showRoleSources?: boolean;
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

  allyRoleSources: RoleResolutionSource[];
  setAllyRoleSources: React.Dispatch<React.SetStateAction<RoleResolutionSource[]>>;

  enemyRoleSources: RoleResolutionSource[];
  setEnemyRoleSources: React.Dispatch<React.SetStateAction<RoleResolutionSource[]>>;
};

function TeamPanel({
  title,
  team,
  setTeam,
  bans,
  setBans,
  selectedChampions,
  roleSources,
  setRoleSources,
  showRoleSources = false,
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
                roleSource={roleSources[index]}
                showRoleSource={showRoleSources}
                excludedChampions={selectedChampions.filter(
                  (champion) => champion.id !== team[index]?.id
                )}
                onSelect={(champion) => {
                  const next = [...team];
                  next[index] = champion;
                  setTeam(next);

                  setRoleSources((currentSources) => {
                    const nextSources = [...currentSources];
                    nextSources[index] = "UNKNOWN";
                    return nextSources;
                  });
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
  allyRoleSources,
  setAllyRoleSources,
  enemyRoleSources,
  setEnemyRoleSources,
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
          roleSources={allyRoleSources}
          setRoleSources={setAllyRoleSources}
        />

        <TeamPanel
          title="敵チーム"
          team={enemyTeam}
          setTeam={setEnemyTeam}
          bans={enemyBans}
          setBans={setEnemyBans}
          selectedChampions={selectedChampions}
          roleSources={enemyRoleSources}
          setRoleSources={setEnemyRoleSources}
          showRoleSources
        />
      </div>
    </section>
  );
}
