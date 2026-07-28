"use client";

import { useState } from "react";
import { searchChampion } from "../lib/searchChampion";
import type { Champion } from "../types/champion";

type ChampionSearchProps = {
  role: string;
};

export default function ChampionSearch({
  role,
}: ChampionSearchProps) {
  const [keyword, setKeyword] = useState("");
  const [selectedChampion, setSelectedChampion] =
    useState<Champion | null>(null);

  const results = searchChampion(keyword);

  return (
    <>
      {selectedChampion ? (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-500 bg-slate-900/60 px-4 py-2">
          <span className="w-10 text-xs font-bold text-yellow-400">
            {role}
          </span>

          <span className="flex-1 text-slate-100">
            {selectedChampion.name}
          </span>

          <button
            onClick={() => {
              setSelectedChampion(null);
              setKeyword("");
            }}
            className="text-red-400 transition hover:text-red-300"
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2">
            <span className="w-10 text-xs font-bold text-yellow-400">
              {role}
            </span>

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="チャンピオンを検索..."
              className="flex-1 rounded-md bg-slate-800 px-3 py-2 text-sm text-white outline-none"
            />
          </div>

          {keyword && results.length > 0 && (
            <ul className="mt-2 rounded-md border border-slate-700 bg-slate-900">
              {results.map((champion) => (
                <li
                  key={champion.id}
                  onClick={() => {
                    setSelectedChampion(champion);
                    setKeyword("");
                  }}
                  className="cursor-pointer px-3 py-2 hover:bg-slate-800"
                >
                  {champion.name}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}