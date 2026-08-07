"use client";

import { useLcuSync } from "../hooks/useLcuSync";

import type {
  LcuChampSelectSession,
  LcuFailureReason,
} from "../types/lcu";

type LcuConnectionStatusProps = Readonly<{
  onSessionLoaded: (session: LcuChampSelectSession) => void;
}>;

const FAILURE_MESSAGES: Record<LcuFailureReason, string> = {
  LEAGUE_CLIENT_NOT_FOUND: "League of Legendsクライアントを起動してください",
  LOCKFILE_NOT_FOUND: "League Clientの接続情報を確認できませんでした",
  CONNECTION_FAILED: "League Clientへ接続できませんでした",
  AUTHENTICATION_FAILED: "League Clientの認証に失敗しました",
  UNSUPPORTED_PLATFORM: "League Client連携はWindowsで利用できます",
  UNKNOWN_ERROR: "接続確認中に問題が発生しました",
};

export default function LcuConnectionStatus({
  onSessionLoaded,
}: LcuConnectionStatusProps) {
  const {
    autoSync,
    setAutoSync,
    result,
    isChecking,
    requestFailed,
    lastUpdatedAt,
    checkConnection,
  } = useLcuSync({ onSessionLoaded });

  const lastUpdatedLabel = lastUpdatedAt?.toLocaleTimeString("ja-JP", {
    hour12: false,
  });

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
      <div className="flex flex-wrap items-start justify-between gap-4">
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

        <div className="flex flex-col items-end gap-3">
          <button
            type="button"
            disabled={isChecking}
            onClick={checkConnection}
            className="rounded-md border border-sky-500/60 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isChecking ? "確認中…" : "接続確認"}
          </button>

          <div className="flex items-center gap-2" aria-label="Auto Sync">
            <span className="text-sm font-medium text-slate-300">
              Auto Sync
            </span>
            <button
              type="button"
              aria-pressed={autoSync}
              onClick={() => setAutoSync(!autoSync)}
              className={`rounded-md border px-3 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                autoSync
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
                  : "border-slate-700 bg-slate-950/60 text-slate-400"
              }`}
            >
              {autoSync ? "ON" : "OFF"}
            </button>
          </div>

          {lastUpdatedLabel && (
            <p className="text-xs text-slate-500">
              最後の更新 {lastUpdatedLabel}
            </p>
          )}
        </div>
      </div>

      {requestFailed && (
        <p className="mt-3 text-sm text-amber-300" role="status">
          最後の取得に失敗しました
        </p>
      )}

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
