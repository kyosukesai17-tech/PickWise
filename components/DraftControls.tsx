"use client";

import { useState } from "react";

import {
  createDraftShareCode,
  parseDraftShareCode,
} from "../lib/draftShare";

import type { DraftSnapshot } from "../lib/draftShare";

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

  const [
    copyError,
    setCopyError,
  ] = useState("");

  const [
    isImportOpen,
    setIsImportOpen,
  ] = useState(false);

  const [
    shareCodeInput,
    setShareCodeInput,
  ] = useState("");

  const [
    importError,
    setImportError,
  ] = useState("");

  const [
    isResetOpen,
    setIsResetOpen,
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

    setCopyError("");

    try {
      await navigator.clipboard.writeText(
        shareCode,
      );

      setHasCopied(true);

      window.setTimeout(() => {
        setHasCopied(false);
      }, 1500);
    } catch {
      setCopyError(
        "共有コードをコピーできませんでした。",
      );
    }
  }

  function openImportModal() {
    setImportError("");
    setShareCodeInput("");
    setIsImportOpen(true);
  }

  function closeImportModal() {
    setImportError("");
    setShareCodeInput("");
    setIsImportOpen(false);
  }

  function handleImport() {
    if (
      shareCodeInput.trim() === ""
    ) {
      setImportError(
        "共有コードを入力してください。",
      );

      return;
    }

    try {
      const importedDraft =
        parseDraftShareCode(
          shareCodeInput,
        );

      onImportDraft(
        importedDraft,
      );

      closeImportModal();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "共有コードを読み込めませんでした。";

      setImportError(message);
    }
  }

  function openResetModal() {
    if (!hasSelections) {
      return;
    }

    setIsResetOpen(true);
  }

  function closeResetModal() {
    setIsResetOpen(false);
  }

  function handleReset() {
    onReset();
    closeResetModal();
  }

  return (
    <>
      <section className="rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
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
              onClick={openImportModal}
              className="rounded-lg border border-violet-500/50 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20"
            >
              共有コードを読み込む
            </button>

            <button
              type="button"
              disabled={!hasSelections}
              onClick={openResetModal}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                hasSelections
                  ? "border-rose-500/50 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                  : "cursor-not-allowed border-slate-700 bg-slate-800 text-slate-600"
              }`}
            >
              すべてリセット
            </button>
          </div>
        </div>

        {copyError && (
          <p className="mt-3 text-sm text-rose-300">
            {copyError}
          </p>
        )}
      </section>

      {isImportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
          onMouseDown={closeImportModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-dialog-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="import-dialog-title"
                  className="text-lg font-bold text-slate-100"
                >
                  共有コードを読み込む
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  PickWiseの共有コードを貼り付けてください。
                </p>
              </div>

              <button
                type="button"
                aria-label="閉じる"
                onClick={closeImportModal}
                className="rounded-md px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                ×
              </button>
            </div>

            {hasSelections && (
              <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
                読み込むと現在のドラフト内容は置き換えられます。
              </p>
            )}

            <textarea
              autoFocus
              value={shareCodeInput}
              onChange={(event) => {
                setShareCodeInput(
                  event.target.value,
                );

                if (importError) {
                  setImportError("");
                }
              }}
              placeholder="PW1:..."
              rows={7}
              className="mt-4 w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-500"
            />

            {importError && (
              <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                {importError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeImportModal}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
              >
                キャンセル
              </button>

              <button
                type="button"
                onClick={handleImport}
                className="rounded-lg border border-violet-500/50 bg-violet-500/20 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/30"
              >
                読み込む
              </button>
            </div>
          </div>
        </div>
      )}

      {isResetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
          onMouseDown={closeResetModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-dialog-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <h2
              id="reset-dialog-title"
              className="text-lg font-bold text-slate-100"
            >
              ドラフトをリセット
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              現在入力されているピックとBANをすべて削除します。
            </p>

            <p className="mt-2 text-sm font-semibold text-rose-300">
              この操作は元に戻せません。
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeResetModal}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
              >
                キャンセル
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-rose-500/50 bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/30"
              >
                リセットする
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}