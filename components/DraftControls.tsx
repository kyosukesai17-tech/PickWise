"use client";

import { useState } from "react";

import {
  createDraftShareCode,
  parseDraftShareCode,
} from "../lib/draftShare";

import type {
  DraftSnapshot,
} from "../lib/draftShare";

import type {
  Champion,
  Role,
} from "../types/champion";

type DraftControlsProps = {
  selectedRole: Role;
  allyTeam: (Champion | null)[];
  enemyTeam: (Champion | null)[];
  allyBans: (Champion | null)[];
  enemyBans: (Champion | null)[];
  onReset: () => void;
  onImportDraft: (
    draft: DraftSnapshot,
  ) => void;
};

export default function DraftControls({
  selectedRole,
  allyTeam,
  enemyTeam,
  allyBans,
  enemyBans,
  onReset,
  onImportDraft,
}: DraftControlsProps) {
  const [
    hasCopied,
    setHasCopied,
  ] = useState(false);

  const selectedCount = [
    ...allyTeam,
    ...enemyTeam,
    ...allyBans,
    ...enemyBans,
  ].filter(
    (
      champion,
    ): champion is Champion =>
      champion !== null,
  ).length;

  const hasSelections =
    selectedCount > 0;

  function handleReset() {
    if (!hasSelections) {
      return;
    }

    const shouldReset =
      window.confirm(
        "現在のピックとBANをすべてリセットしますか？",
      );

    if (shouldReset) {
      onReset();
    }
  }

  async function handleCopy() {
    if (!hasSelections) {
      return;
    }

    const shareCode =
      createDraftShareCode({
        selectedRole,
        allyTeam,
        enemyTeam,
        allyBans,
        enemyBans,
      });

    try {
      await navigator.clipboard.writeText(
        shareCode,
      );

      setHasCopied(true);

      window.setTimeout(
        () => {
          setHasCopied(false);
        },
        1500,
      );
    } catch {
      window.alert(
        "共有コードをコピーできませんでした。",
      );
    }
  }

  function handleImport() {
    const shareCode =
      window.prompt(
        "PickWiseの共有コードを貼り付けてください。",
      );

    if (!shareCode) {
      return;
    }

    try {
      const importedDraft =
        parseDraftShareCode(
          shareCode,
        );

      if (hasSelections) {
        const shouldReplace =
          window.confirm(
            "現在のドラフトを共有コードの内容で置き換えますか？",
          );

        if (!shouldReplace) {
          return;
        }
      }

      onImportDraft(
        importedDraft,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "共有コードを読み込めませんでした。";

      window.alert(message);
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

        <p className="mt-1 text-xs text-slate-500">
          共有コードを使って別のブラウザでも復元できます。
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!hasSelections}
          onClick={handleCopy}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            hasSelections
              ? "border-sky-500/50 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20"
              : "cursor-not-allowed border-slate-700 bg-slate-800 text-slate-600"
          }`}
        >
          {hasCopied
            ? "コピー済み"
            : "共有コードをコピー"}
        </button>

        <button
          type="button"
          onClick={handleImport}
          className="rounded-lg border border-violet-500/50 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20"
        >
          共有コードを読み込む
        </button>

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
      </div>
    </section>
  );
}