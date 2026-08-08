"use client";

import type { Champion, Role } from "../types/champion";
import { useMemo, useState } from "react";
import ChampionCard from "./ChampionCard";
import ChampionDropdown from "./ChampionDropdown";
import { searchChampion } from "../lib/searchChampion";
import type { RoleResolutionSource } from "../lib/lcu/convertChampSelectSession";

type ChampionSearchProps = {
  role: Role;
  value: Champion | null;
  excludedChampions: Champion[];
  roleSource?: RoleResolutionSource;
  showRoleSource?: boolean;
  onSelect: (champion: Champion | null) => void;
};

export default function ChampionSearch({
  role,
  value,
  excludedChampions,
  roleSource = "UNKNOWN",
  showRoleSource = false,
  onSelect,
}: ChampionSearchProps) {
  const [keyword, setKeyword] = useState("");

  const candidates = useMemo(() => {
    return searchChampion(keyword, role).filter(
      (champion) =>
        !excludedChampions.some(
          (selected) => selected.id === champion.id
        )
    );
  }, [keyword, role, excludedChampions]);

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-2">
        <div className="flex items-center gap-3">
          <span className="w-10 text-sm font-semibold text-slate-400">
            {role}
          </span>

          <ChampionCard champion={value} />

          {showRoleSource && roleSource === "INFERRED" && (
            <span className="rounded border border-amber-400/50 bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-200">
              推定
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelect(null)}
          className="rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <span className="w-10 text-sm font-semibold text-slate-400">
          {role}
        </span>

        <input
          type="text"
          value={keyword}
          placeholder="チャンピオン検索..."
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-sky-500"
        />
      </div>

      {keyword && (
        <ChampionDropdown
          champions={candidates}
          onSelect={(champion) => {
            onSelect(champion);
            setKeyword("");
          }}
        />
      )}
    </div>
  );
}
