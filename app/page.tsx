"use client";

import {
  useCallback,
  useState,
} from "react";

import Header from "../components/Header";
import RoleSelector from "../components/RoleSelector";
import DraftControls from "../components/DraftControls";
import DraftPhaseControl from "../components/DraftPhaseControl";
import LcuConnectionStatus from "../components/LcuConnectionStatus";
import TeamInput from "../components/TeamInput";
import DraftAnalysisSummary from "../components/DraftAnalysisSummary";
import RecommendationSection from "../components/RecommendationSection";

import { useDraftPersistence } from "../hooks/useDraftPersistence";
import { ROLE_INDEX } from "../lib/role";
import {
  getNextDraftTurn,
  getPreviousDraftTurn,
} from "../lib/draftPickOrder";
import { convertChampSelectSession } from "../lib/lcu/convertChampSelectSession";
import type { RoleResolutionSource } from "../lib/lcu/convertChampSelectSession";

import type { DraftSnapshot } from "../lib/draftShare";

import type {
  Champion,
  Role,
} from "../types/champion";
import type {
  DraftPhaseState,
  PlayerTeamSide,
} from "../types/draftPhase";
import type {
  LcuChampSelectSession,
  LcuRecommendedPositions,
} from "../types/lcu";

const createEmptyTeam =
  (): (Champion | null)[] => [
    null,
    null,
    null,
    null,
    null,
  ];

const createUnknownRoleSources = (): RoleResolutionSource[] => [
  "UNKNOWN",
  "UNKNOWN",
  "UNKNOWN",
  "UNKNOWN",
  "UNKNOWN",
];

function areTeamsEqual(
  currentTeam: (Champion | null)[],
  nextTeam: (Champion | null)[],
) {
  return currentTeam.length === nextTeam.length
    && currentTeam.every(
      (champion, index) => champion?.id === nextTeam[index]?.id,
    );
}

function areRoleSourcesEqual(
  currentSources: RoleResolutionSource[],
  nextSources: RoleResolutionSource[],
) {
  return currentSources.length === nextSources.length
    && currentSources.every(
      (source, index) => source === nextSources[index],
    );
}

export default function Home() {
  const [
    draftPhaseState,
    setDraftPhaseState,
  ] = useState<DraftPhaseState>({
    mode: "STANDARD_SOLO_QUEUE",
    currentTurn: 1,
  });

  const [
    playerTeamSide,
    setPlayerTeamSide,
  ] = useState<PlayerTeamSide>("BLUE");

  const [
    selectedRole,
    setSelectedRole,
  ] = useState<Role>("MID");

  const [
    allyTeam,
    setAllyTeam,
  ] = useState<
    (Champion | null)[]
  >(createEmptyTeam);

  const [
    enemyTeam,
    setEnemyTeam,
  ] = useState<
    (Champion | null)[]
  >(createEmptyTeam);

  const [
    allyRoleSources,
    setAllyRoleSources,
  ] = useState<RoleResolutionSource[]>(createUnknownRoleSources);

  const [
    enemyRoleSources,
    setEnemyRoleSources,
  ] = useState<RoleResolutionSource[]>(createUnknownRoleSources);

  const [
    allyBans,
    setAllyBans,
  ] = useState<
    (Champion | null)[]
  >(createEmptyTeam);

  const [
    enemyBans,
    setEnemyBans,
  ] = useState<
    (Champion | null)[]
  >(createEmptyTeam);

  const {
    isDraftLoaded,
  } = useDraftPersistence({
    selectedRole,
    allyTeam,
    enemyTeam,
    allyBans,
    enemyBans,
    setSelectedRole,
    setAllyTeam,
    setEnemyTeam,
    setAllyBans,
    setEnemyBans,
  });

  function resetDraft() {
    setAllyTeam(
      createEmptyTeam(),
    );

    setEnemyTeam(
      createEmptyTeam(),
    );

    setAllyRoleSources(createUnknownRoleSources());
    setEnemyRoleSources(createUnknownRoleSources());

    setAllyBans(
      createEmptyTeam(),
    );

    setEnemyBans(
      createEmptyTeam(),
    );
  }

  function importDraft(
    draft: DraftSnapshot,
  ) {
    setSelectedRole(
      draft.selectedRole,
    );

    setAllyTeam(
      draft.allyTeam,
    );

    setEnemyTeam(
      draft.enemyTeam,
    );

    setAllyRoleSources(createUnknownRoleSources());
    setEnemyRoleSources(createUnknownRoleSources());

    setAllyBans(
      draft.allyBans,
    );

    setEnemyBans(
      draft.enemyBans,
    );
  }

  function selectRecommendedChampion(
    champion: Champion,
  ) {
    setAllyTeam(
      (currentTeam) => {
        const nextTeam =
          [...currentTeam];

        nextTeam[
          ROLE_INDEX[selectedRole]
        ] = champion;

        return nextTeam;
      },
    );
  }

  const importLcuSession = useCallback((
    session: LcuChampSelectSession,
    recommendedPositions?: LcuRecommendedPositions,
  ) => {
    const convertedDraft = convertChampSelectSession(
      session,
      recommendedPositions,
    );

    setAllyTeam((currentTeam) => areTeamsEqual(
      currentTeam,
      convertedDraft.allyTeam,
    ) ? currentTeam : convertedDraft.allyTeam);

    setEnemyTeam((currentTeam) => areTeamsEqual(
      currentTeam,
      convertedDraft.enemyTeam,
    ) ? currentTeam : convertedDraft.enemyTeam);

    setAllyRoleSources((currentSources) => areRoleSourcesEqual(
      currentSources,
      convertedDraft.allyRoleSources,
    ) ? currentSources : convertedDraft.allyRoleSources);

    setEnemyRoleSources((currentSources) => areRoleSourcesEqual(
      currentSources,
      convertedDraft.enemyRoleSources,
    ) ? currentSources : convertedDraft.enemyRoleSources);
  }, []);

  if (!isDraftLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-sky-500" />

          <p className="mt-4 text-sm text-slate-400">
            ドラフトを読み込んでいます...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <RoleSelector
          selectedRole={
            selectedRole
          }
          setSelectedRole={
            setSelectedRole
          }
        />

        <DraftPhaseControl
          state={draftPhaseState}
          playerTeamSide={playerTeamSide}
          selectedRole={selectedRole}
          onPlayerTeamSideChange={setPlayerTeamSide}
          onSelectedRoleChange={setSelectedRole}
          onPrevious={() =>
            setDraftPhaseState((currentState) => ({
              ...currentState,
              currentTurn: getPreviousDraftTurn(currentState.currentTurn),
            }))
          }
          onNext={() =>
            setDraftPhaseState((currentState) => ({
              ...currentState,
              currentTurn: getNextDraftTurn(currentState.currentTurn),
            }))
          }
          onReset={() =>
            setDraftPhaseState((currentState) => ({
              ...currentState,
              currentTurn: 1,
            }))
          }
        />

        <LcuConnectionStatus
          onSessionLoaded={importLcuSession}
        />

        <DraftControls
          selectedRole={
            selectedRole
          }
          allyTeam={allyTeam}
          enemyTeam={enemyTeam}
          allyBans={allyBans}
          enemyBans={enemyBans}
          onReset={resetDraft}
          onImportDraft={
            importDraft
          }
        />

        <TeamInput
          draftPhaseState={draftPhaseState}
          playerTeamSide={playerTeamSide}
          allyTeam={allyTeam}
          setAllyTeam={
            setAllyTeam
          }
          enemyTeam={enemyTeam}
          setEnemyTeam={
            setEnemyTeam
          }
          allyBans={allyBans}
          setAllyBans={
            setAllyBans
          }
          enemyBans={enemyBans}
          setEnemyBans={
            setEnemyBans
          }
          allyRoleSources={allyRoleSources}
          setAllyRoleSources={setAllyRoleSources}
          enemyRoleSources={enemyRoleSources}
          setEnemyRoleSources={setEnemyRoleSources}
        />

        <DraftAnalysisSummary
          allyTeam={allyTeam}
          enemyTeam={enemyTeam}
          selectedRole={
            selectedRole
          }
        />

        <RecommendationSection
          draftPhaseState={draftPhaseState}
          playerTeamSide={playerTeamSide}
          allyTeam={allyTeam}
          enemyTeam={enemyTeam}
          allyBans={allyBans}
          enemyBans={enemyBans}
          selectedRole={
            selectedRole
          }
          onSelectChampion={
            selectRecommendedChampion
          }
        />
      </div>
    </main>
  );
}
