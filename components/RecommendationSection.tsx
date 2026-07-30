import ChampionCard from "./ChampionCard";
import { recommend } from "../lib/recommend";
import type { Champion } from "../types/champion";

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
      <h2 className="mb-4 text-xl font-bold text-slate-100">
        おすすめチャンピオン
      </h2>

      {recommendations.length === 0 ? (
        <p className="text-slate-400">
          おすすめを表示できません。
        </p>
      ) : (
        <ul className="space-y-2">
          {recommendations.slice(0, 10).map((recommendation) => (
            <li
              key={recommendation.champion.id}
              className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-3"
            >
              <ChampionCard champion={recommendation.champion} />

              <div className="text-right">
                <p className="font-semibold text-yellow-400">
                  {recommendation.score} pt
                </p>

                {recommendation.reasons.length > 0 && (
                  <p className="mt-1 text-xs text-slate-400">
                    {recommendation.reasons.join(" / ")}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}