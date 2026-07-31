"use client";

import { useState } from "react";

import Header from "../components/Header";
import RoleSelector from "../components/RoleSelector";
import DraftControls from "../components/DraftControls";
import TeamInput from "../components/TeamInput";
import DraftAnalysisSummary from "../components/DraftAnalysisSummary";
import RecommendationSection from "../components/RecommendationSection";

import { useDraftPersistence } from "../hooks/useDraftPersistence";
import { ROLE_INDEX } from "../lib/role";

import type { DraftSnapshot } from "../lib/draftShare";

import type {
  Champion,
  Role,
} from "../types/champion";

const createEmptyTeam =
  (): (Champion | null)[] => [
    null,
    null,
    null,
    null,
    null,
  ];

export default function Home() {
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
        />

        <DraftAnalysisSummary
          allyTeam={allyTeam}
          enemyTeam={enemyTeam}
          selectedRole={
            selectedRole
          }
        />

        <RecommendationSection
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