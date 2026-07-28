import type { Champion } from "../types/champion";
import { recommend } from "../lib/recommend";

type RecommendationSectionProps = {
  allyTeam: (Champion | null)[];
  enemyTeam: (Champion | null)[];
};

export default function RecommendationSection({
  allyTeam,
  enemyTeam,
}: RecommendationSectionProps) {
  const recommendations = recommend(allyTeam, enemyTeam);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <h2 className="mb-4 text-xl font-bold text-yellow-400">
        おすすめチャンピオン
      </h2>

      {recommendations.length === 0 ? (
        <p className="text-slate-400">
          味方または敵のチャンピオンを選択してください。
        </p>
      ) : (
        <ul className="space-y-2">
          {recommendations.map((champion) => (
            <li
              key={champion.name}
              className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-4 py-3"
            >
              <span>{champion.name}</span>

              <span className="font-bold text-yellow-400">
                {champion.score} pt
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}