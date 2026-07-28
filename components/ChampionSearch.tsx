"use client";

import { useState } from "react";
import type { Champion } from "../types/champion";
import { searchChampion } from "../lib/searchChampion";
import ChampionCard from "./ChampionCard";
import ChampionDropdown from "./ChampionDropdown";

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

  const results =
    keyword.trim() === ""
      ? []
      : searchChampion(keyword)
          .filter(
            (champion) =>
              !excludedChampions.some(
                (excluded) => excluded.id === champion.id
              )
          )
          .slice(0, 10);

  return (
    <div className="relative">
      {value ? (
        <div className="flex items-center justify-between rounded-lg border border-yellow-500 bg-slate-900 px-3 py-2">
          <div className="flex items-center gap-3">
            <span className="w-10 text-xs font-bold text-yellow-400">
              {role}
            </span>

            <ChampionCard champion={value} size={36} />
          </div>

          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-slate-400 transition hover:text-red-400"
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
            <span className="w-10 text-xs font-bold text-slate-400">
              {role}
            </span>

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="チャンピオン名を入力"
              className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <ChampionDropdown
            champions={results}
            onSelect={(champion) => {
              onSelect(champion);
              setKeyword("");
            }}
          />
        </>
      )}
    </div>
  );
}