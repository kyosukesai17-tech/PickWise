"use client";

import { useState } from "react";
import Header from "../components/Header";
import RoleSelector from "../components/RoleSelector";
import TeamInput from "../components/TeamInput";
import RecommendationSection from "../components/RecommendationSection";
import type { Champion } from "../types/champion";

export default function Home() {
  const [allyTeam, setAllyTeam] = useState<(Champion | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const [enemyTeam, setEnemyTeam] = useState<(Champion | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <RoleSelector />

        <TeamInput
          allyTeam={allyTeam}
          setAllyTeam={setAllyTeam}
          enemyTeam={enemyTeam}
          setEnemyTeam={setEnemyTeam}
        />

        <RecommendationSection
          allyTeam={allyTeam}
          enemyTeam={enemyTeam}
        />
      </div>
    </main>
  );
}