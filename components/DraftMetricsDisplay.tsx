import type { DraftMetrics } from "../src/types/championDetail";

type DraftMetricsDisplayProps = {
  metrics: DraftMetrics | undefined;
};

const DRAFT_METRIC_ITEMS: ReadonlyArray<{
  key: keyof DraftMetrics;
  label: string;
}> = [
  { key: "blindPick", label: "ブラインド" },
  { key: "roam", label: "ローム" },
  { key: "teamfight", label: "集団戦" },
  { key: "sideLane", label: "サイドレーン" },
  { key: "pickPotential", label: "ピック性能" },
  { key: "objectiveControl", label: "オブジェクト" },
];

export default function DraftMetricsDisplay({
  metrics,
}: DraftMetricsDisplayProps) {
  return (
    <section className="mt-4 border-t border-slate-700 pt-3">
      <h4 className="mb-3 text-xs font-semibold text-sky-300">
        ドラフト性能
      </h4>

      {!metrics ? (
        <p className="text-xs text-slate-500">
          ドラフト性能データ未登録
        </p>
      ) : (
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DRAFT_METRIC_ITEMS.map(({ key, label }) => {
            const value = metrics[key];

            return (
              <div
                key={key}
                className="min-w-0 rounded-md bg-slate-900/60 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <dt className="truncate text-slate-300">
                    {label}
                  </dt>
                  <dd className="shrink-0 font-semibold text-slate-100">
                    {value} / 5
                  </dd>
                </div>

                <div
                  aria-hidden="true"
                  className="mt-2 grid grid-cols-5 gap-1"
                >
                  {Array.from(
                    { length: 5 },
                    (_, index) => (
                      <span
                        key={index}
                        className={`h-1.5 rounded-full ${
                          index < value
                            ? "bg-sky-400"
                            : "bg-slate-700"
                        }`}
                      />
                    ),
                  )}
                </div>
              </div>
            );
          })}
        </dl>
      )}
    </section>
  );
}
