"use client";

import { useMemo, useState } from "react";
import type { Champion } from "../types/champion";
import ChampionCard from "./ChampionCard";
import ChampionDropdown from "./ChampionDropdown";
import { searchChampion } from "../lib/searchChampion";

type ChampionSearchProps = {
  role: string;
  value: Champion | null;
  excludedChampions: Champion[];
  onSelect: (champion: Champion | null) => void;
};

export default function ChampionSearch({
  role,
  value,
  excludedChampions,
  onSelect,
}: ChampionSearchProps) {
  const [keyword, setKeyword] = useState("");

  const candidates = useMemo(() => {
    console.log("ChampionSearch keyword =", keyword);
    return searchChampion(keyword).filter(
      (champion) =>
        !excludedChampions.some(
          (selected) => selected.id === champion.id
        )
    );
  }, [keyword, excludedChampions]);

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-2">
        <div className="flex items-center gap-3">
          <span className="w-10 text-sm font-semibold text-slate-400">
            {role}
          </span>

          <ChampionCard champion={value} />
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