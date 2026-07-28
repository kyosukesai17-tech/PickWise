"use client";

import { useState } from "react";
import { searchChampion } from "../lib/searchChampion";
import type { Champion } from "../types/champion";

type ChampionSearchProps = {
  role: string;
  value: Champion | null;
  onSelect: (champion: Champion | null) => void;
};

export default function ChampionSearch({
  role,
  value,
  onSelect,
}: ChampionSearchProps) {
  const [keyword, setKeyword] = useState("");

  const results = searchChampion(keyword);

  return (
    <>
      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-500 bg-slate-900/60 px-4 py-2">
          <span className="w-10 text-xs font-bold text-yellow-400">
            {role}
          </span>

          <span className="flex-1 text-slate-100">
            {value.name}
          </span>

          <button
            onClick={() => {
              onSelect(null);
              setKeyword("");
            }}
            className="text-red-400 hover:text-red-300"
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
                    onSelect(champion);
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