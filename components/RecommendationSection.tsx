import ChampionCard from "./ChampionCard";
import { recommend } from "../lib/recommend";
import type { Champion, Role } from "../types/champion";

type RecommendationSectionProps = {
  allyTeam: (Champion | null)[];
  enemyTeam: (Champion | null)[];
  selectedRole: Role;
};

export default function RecommendationSection({
  allyTeam,
  enemyTeam,
  selectedRole,
}: RecommendationSectionProps) {
  const recommendations = recommend(
    allyTeam,
    enemyTeam,
    selectedRole,
  );

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <h2 className="mb-4 text-xl font-bold">
        おすすめ（{selectedRole}）
      </h2>

      {recommendations.length === 0 ? (
        <p className="text-slate-400">
          おすすめを表示できません。
        </p>
      ) : (
        <div className="space-y-2">
          {recommendations.slice(0, 10).map((recommendation, index) => (
            <div
              key={recommendation.champion.id}
              className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 text-center font-bold text-yellow-400">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `${index + 1}`}
                </span>

                <ChampionCard champion={recommendation.champion} />
              </div>

              <span className="font-semibold text-yellow-400">
                {recommendation.score} pt
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}