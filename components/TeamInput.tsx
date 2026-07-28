import ChampionSearch from "./ChampionSearch";

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
            <li key={key}>
              <ChampionSearch role={label} />
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
