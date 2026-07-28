const teamRoles = [
  { label: "TOP", key: "top" },
  { label: "JG", key: "jg" },
  { label: "MID", key: "mid" },
  { label: "ADC", key: "adc" },
  { label: "SUP", key: "sup" },
] as const;

type TeamPanelProps = {
  title: string;
};

function TeamPanel({ title }: TeamPanelProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6">
      <h3 className="mb-4 text-center text-lg font-semibold text-slate-200">
        {title}
      </h3>

      <ul className="space-y-3">
        {teamRoles.map(({ label, key }) => (
          <li
            key={key}
            className="flex items-center gap-3 rounded-lg border border-slate-700/80 bg-slate-950/60 px-4 py-2"
          >
            <span className="w-10 shrink-0 text-xs font-bold tracking-wide text-yellow-400">
              {label}
            </span>
            <input
              type="text"
              placeholder="チャンピオンを検索..."
              aria-label={`${title} ${label} チャンピオン`}
              className="min-w-0 flex-1 rounded-md border border-transparent bg-slate-900/80 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 transition hover:border-slate-600 focus:border-yellow-400 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TeamInput() {
  return (
    <section>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <TeamPanel title="味方チーム" />
        <TeamPanel title="敵チーム" />
      </div>
    </section>
  );
}
