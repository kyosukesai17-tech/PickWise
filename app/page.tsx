"use client";

import { useState } from "react";

import Header from "../components/Header";
import RoleSelector from "../components/RoleSelector";
import DraftControls from "../components/DraftControls";
import TeamInput from "../components/TeamInput";
import DraftAnalysisSummary from "../components/DraftAnalysisSummary";
import RecommendationSection from "../components/RecommendationSection";

import type {
  Champion,
  Role,
} from "../types/champion";

const createEmptyTeam = (): (Champion | null)[] => [
  null,
  null,
  null,
  null,
  null,
];

export default function Home() {
  const [selectedRole, setSelectedRole] =
    useState<Role>("MID");

  const [allyTeam, setAllyTeam] =
    useState<(Champion | null)[]>(
      createEmptyTeam,
    );

  const [enemyTeam, setEnemyTeam] =
    useState<(Champion | null)[]>(
      createEmptyTeam,
    );

  const [allyBans, setAllyBans] =
    useState<(Champion | null)[]>(
      createEmptyTeam,
    );

  const [enemyBans, setEnemyBans] =
    useState<(Champion | null)[]>(
      createEmptyTeam,
    );

  function resetDraft() {
    setAllyTeam(createEmptyTeam());
    setEnemyTeam(createEmptyTeam());
    setAllyBans(createEmptyTeam());
    setEnemyBans(createEmptyTeam());
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <RoleSelector
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />

        <DraftControls
          allyTeam={allyTeam}
          enemyTeam={enemyTeam}
          allyBans={allyBans}
          enemyBans={enemyBans}
          onReset={resetDraft}
        />

        <TeamInput
          allyTeam={allyTeam}
          setAllyTeam={setAllyTeam}
          enemyTeam={enemyTeam}
          setEnemyTeam={setEnemyTeam}
          allyBans={allyBans}
          setAllyBans={setAllyBans}
          enemyBans={enemyBans}
          setEnemyBans={setEnemyBans}
        />

        <DraftAnalysisSummary
          allyTeam={allyTeam}
          enemyTeam={enemyTeam}
          selectedRole={selectedRole}
        />

        <RecommendationSection
          allyTeam={allyTeam}
          enemyTeam={enemyTeam}
          allyBans={allyBans}
          enemyBans={enemyBans}
          selectedRole={selectedRole}
        />
      </div>
    </main>
  );
}