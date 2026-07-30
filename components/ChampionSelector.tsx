"use client";

import { useMemo, useState } from "react";

import type { Champion } from "../types/champion";

import ChampionCard from "./ChampionCard";
import ChampionDropdown from "./ChampionDropdown";
import { searchChampion } from "../lib/searchChampion";

type ChampionSelectorProps = {
  value: Champion | null;
  onSelect: (champion: Champion | null) => void;
};

export default function ChampionSelector({
  value,
  onSelect,
}: ChampionSelectorProps) {
  const [keyword, setKeyword] = useState("");

  const candidates = useMemo(() => {
    return searchChampion(keyword);
  }, [keyword]);

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-2">
        <ChampionCard champion={value} />

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
      <input
        type="text"
        value={keyword}
        placeholder="チャンピオン検索..."
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-sky-500"
      />

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