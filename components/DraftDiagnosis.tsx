export type DiagnosisStatus = "WARNING" | "CAUTION" | "GOOD";

export type DraftDiagnosisItem = Readonly<{
  id: string;
  label: string;
  description?: string;
  status: DiagnosisStatus;
}>;

type DraftDiagnosisProps = Readonly<{
  items: readonly DraftDiagnosisItem[];
}>;

const STATUS_PRESENTATION = {
  WARNING: {
    label: "不足",
    badgeClassName:
      "border-rose-500/40 bg-rose-500/10 text-rose-300",
    itemClassName: "border-rose-500/20",
  },
  CAUTION: {
    label: "注意",
    badgeClassName:
      "border-amber-500/40 bg-amber-500/10 text-amber-300",
    itemClassName: "border-amber-500/20",
  },
  GOOD: {
    label: "良好",
    badgeClassName:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    itemClassName: "border-emerald-500/20",
  },
} as const satisfies Record<
  DiagnosisStatus,
  {
    label: string;
    badgeClassName: string;
    itemClassName: string;
  }
>;

export default function DraftDiagnosis({
  items,
}: DraftDiagnosisProps) {
  return (
    <section
      aria-labelledby="draft-diagnosis-heading"
      className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"
    >
      <h3
        id="draft-diagnosis-heading"
        className="text-sm font-semibold text-slate-200"
      >
        現在のドラフト診断
      </h3>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">
          現在、表示できる診断はありません
        </p>
      ) : (
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const presentation = STATUS_PRESENTATION[item.status];

            return (
              <li
                key={item.id}
                className={`min-w-0 rounded-lg border bg-slate-900/70 p-3 ${presentation.itemClassName}`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${presentation.badgeClassName}`}
                  >
                    {presentation.label}
                  </span>

                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium text-slate-100">
                      {item.label}
                    </p>

                    {item.description ? (
                      <p className="mt-1 break-words text-xs leading-5 text-slate-400">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
