"use client";

import { useState } from "react";

import type {
  LcuChampSelectResponse,
  LcuFailureReason,
} from "../types/lcu";

const FAILURE_MESSAGES: Record<LcuFailureReason, string> = {
  LEAGUE_CLIENT_NOT_FOUND: "League of Legendsクライアントを起動してください",
  LOCKFILE_NOT_FOUND: "League Clientの接続情報を確認できませんでした",
  CONNECTION_FAILED: "League Clientへ接続できませんでした",
  AUTHENTICATION_FAILED: "League Clientの認証に失敗しました",
  UNSUPPORTED_PLATFORM: "League Client連携はWindowsで利用できます",
  UNKNOWN_ERROR: "接続確認中に問題が発生しました",
};

export default function LcuConnectionStatus() {
  const [result, setResult] = useState<LcuChampSelectResponse | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);

  async function checkConnection() {
    if (isChecking) {
      return;
    }

    setIsChecking(true);
    setRequestFailed(false);

    try {
      const response = await fetch("/api/lcu/champ-select", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("LCU status request failed");
      }

      setResult(await response.json() as LcuChampSelectResponse);
    } catch {
      setResult(null);
      setRequestFailed(true);
    } finally {
      setIsChecking(false);
    }
  }

  const statusLabel = isChecking
    ? "確認中…"
    : result?.connected
      ? "接続済み"
      : "未接続";
  const statusDescription = isChecking
    ? "League Clientの状態を確認しています"
    : requestFailed
      ? "接続状態を確認できませんでした"
      : result?.connected
        ? result.inChampSelect
          ? "チャンプセレクト情報を取得しました"
          : "チャンプセレクト外です"
        : result?.reason
          ? FAILURE_MESSAGES[result.reason]
          : "接続確認ボタンを押してください";

  return (
    <section
      aria-labelledby="lcu-connection-heading"
      className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            id="lcu-connection-heading"
            className="text-lg font-semibold text-slate-100"
          >
            League Client連携
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-200" aria-live="polite">
            {statusLabel}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {statusDescription}
          </p>
        </div>

        <button
          type="button"
          disabled={isChecking}
          onClick={checkConnection}
          className="rounded-md border border-sky-500/60 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isChecking ? "確認中…" : "接続確認"}
        </button>
      </div>

      {result?.inChampSelect && result.session && (
        <details className="mt-4 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
            取得データを表示
          </summary>
          <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs text-slate-400">
            {JSON.stringify(result.session, null, 2)}
          </pre>
        </details>
      )}
    </section>
  );
}
