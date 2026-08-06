import {
  getDraftTurn,
  STANDARD_PICK_TURN_COUNT,
  STANDARD_SOLO_QUEUE_PICK_ORDER,
} from "../lib/draftPickOrder";

import type {
  DraftPhaseState,
  PlayerTeamSide,
} from "../types/draftPhase";

type DraftPhaseControlProps = Readonly<{
  state: DraftPhaseState;
  playerTeamSide: PlayerTeamSide;
  onPlayerTeamSideChange: (side: PlayerTeamSide) => void;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
}>;

const TEAM_SIDES: readonly PlayerTeamSide[] = ["BLUE", "RED"];

export default function DraftPhaseControl({
  state,
  playerTeamSide,
  onPlayerTeamSideChange,
  onPrevious,
  onNext,
  onReset,
}: DraftPhaseControlProps) {
  const currentDraftTurn = getDraftTurn(
    state.currentTurn,
    playerTeamSide,
  );
  const currentSideLabel = currentDraftTurn.side === "ALLY"
    ? "味方"
    : "敵";

  return (
    <section
      aria-labelledby="draft-phase-heading"
      className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="draft-phase-heading"
            className="text-lg font-semibold text-slate-100"
          >
            ドラフトフェーズ
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            標準ソロキューのPick順を確認できます
          </p>
        </div>

        <div className="text-right" aria-live="polite">
          <p className="text-sm font-semibold text-slate-100">
            現在: {state.currentTurn} / {STANDARD_PICK_TURN_COUNT}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            手番: <span className="font-semibold text-sky-300">{currentSideLabel}</span>
          </p>
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="text-xs font-semibold text-slate-400">
          自分のチーム
        </legend>
        <div className="mt-2 flex gap-2">
          {TEAM_SIDES.map((side) => {
            const isSelected = playerTeamSide === side;

            return (
              <button
                key={side}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onPlayerTeamSideChange(side)}
                className={`rounded-md border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isSelected
                    ? "border-sky-400 bg-sky-500/20 text-sky-200"
                    : "border-slate-700 bg-slate-950/40 text-slate-300 hover:border-slate-500"
                }`}
              >
                {side}
              </button>
            );
          })}
        </div>
      </fieldset>

      <ol
        aria-label="標準Pick順"
        className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-10"
      >
        {STANDARD_SOLO_QUEUE_PICK_ORDER.map((actingSide, index) => {
          const turn = index + 1;
          const isCurrent = turn === state.currentTurn;
          const sideLabel = actingSide === playerTeamSide ? "味方" : "敵";

          return (
            <li
              key={turn}
              aria-current={isCurrent ? "step" : undefined}
              className={`min-w-0 rounded-md border px-1 py-2 text-center ${
                isCurrent
                  ? "border-sky-400 bg-sky-500/20"
                  : "border-slate-800 bg-slate-950/40"
              }`}
            >
              <span className="block text-xs font-semibold text-slate-200">
                {turn}
              </span>
              <span className="mt-0.5 block text-[10px] text-slate-400">
                {sideLabel}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={state.currentTurn === 1}
          onClick={onPrevious}
          className="rounded-md border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          戻る
        </button>
        <button
          type="button"
          disabled={state.currentTurn === STANDARD_PICK_TURN_COUNT}
          onClick={onNext}
          className="rounded-md border border-sky-500/60 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          次へ
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
        >
          リセット
        </button>
      </div>
    </section>
  );
}
