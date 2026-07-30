"use client";

import type { Champion } from "../types/champion";

type DraftControlsProps = {
  allyTeam: (Champion | null)[];
  enemyTeam: (Champion | null)[];
  allyBans: (Champion | null)[];
  enemyBans: (Champion | null)[];
  onReset: () => void;
};

export default function DraftControls({
  allyTeam,
  enemyTeam,
  allyBans,
  enemyBans,
  onReset,
}: DraftControlsProps) {
  const selectedCount = [
    ...allyTeam,
    ...enemyTeam,
    ...allyBans,
    ...enemyBans,
  ].filter(
    (champion): champion is Champion =>
      champion !== null,
  ).length;

  const hasSelections =
    selectedCount > 0;

  function handleReset() {
    if (!hasSelections) {
      return;
    }

    const shouldReset = window.confirm(
      "現在のピックとBANをすべてリセットしますか？",
    );

    if (shouldReset) {
      onReset();
    }
  }

  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4">
      <div>
        <h2 className="font-semibold text-slate-100">
          ドラフト操作
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          入力済み
          <span className="mx-1 font-semibold text-sky-300">
            {selectedCount}
          </span>
          / 20枠
        </p>
      </div>

      <button
        type="button"
        disabled={!hasSelections}
        onClick={handleReset}
        className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
          hasSelections
            ? "border-rose-500/50 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
            : "cursor-not-allowed border-slate-700 bg-slate-800 text-slate-600"
        }`}
      >
        すべてリセット
      </button>
    </section>
  );
}