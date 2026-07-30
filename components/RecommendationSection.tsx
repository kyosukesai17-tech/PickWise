import ChampionCard from "./ChampionCard";

import { analyzeTeam } from "../lib/analyzeTeam";
import { recommend } from "../lib/recommend";

import type {
  Champion,
  Role,
} from "../types/champion";

type RecommendationSectionProps = {
  allyTeam: (Champion | null)[];
  enemyTeam: (Champion | null)[];
  allyBans: (Champion | null)[];
  enemyBans: (Champion | null)[];
  selectedRole: Role;
};

type TeamNeed = {
  label: string;
  needed: boolean;
};

export default function RecommendationSection({
  allyTeam,
  enemyTeam,
  allyBans,
  enemyBans,
  selectedRole,
}: RecommendationSectionProps) {
  const analysis = analyzeTeam(allyTeam);

  const recommendations = recommend(
    allyTeam,
    enemyTeam,
    allyBans,
    enemyBans,
    selectedRole,
  );

  const teamNeeds: TeamNeed[] = [
    {
      label: "APダメージ",
      needed: analysis.needAP,
    },
    {
      label: "ADダメージ",
      needed: analysis.needAD,
    },
    {
      label: "フロントライン",
      needed: analysis.needTank,
    },
    {
      label: "CC",
      needed: analysis.needCC,
    },
  ];

  const activeNeeds = teamNeeds.filter(
    (need) => need.needed,
  );

  return (
    <section className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div>
        <h2 className="text-xl font-bold">
          おすすめ（{selectedRole}）
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          味方構成と敵構成を基準に評価しています。
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-200">
          味方構成の不足
        </h3>

        {activeNeeds.length === 0 ? (
          <p className="text-sm text-emerald-400">
            現在の基準では大きな不足はありません。
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeNeeds.map((need) => (
              <span
                key={need.label}
                className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-sm text-amber-300"
              >
                {need.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {recommendations.length === 0 ? (
        <p className="text-slate-400">
          選択条件に一致する候補がありません。
        </p>
      ) : (
        <div className="space-y-3">
          {recommendations
            .slice(0, 10)
            .map((recommendation, index) => (
              <article
                key={recommendation.champion.id}
                className="rounded-lg border border-slate-700 bg-slate-800 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="w-8 shrink-0 text-center font-bold text-yellow-400">
                      {index === 0
                        ? "🥇"
                        : index === 1
                          ? "🥈"
                          : index === 2
                            ? "🥉"
                            : `${index + 1}`}
                    </span>

                    <ChampionCard
                      champion={recommendation.champion}
                    />
                  </div>

                  <span className="shrink-0 font-semibold text-yellow-400">
                    {recommendation.score} pt
                  </span>
                </div>

                <div className="mt-4 border-t border-slate-700 pt-3">
                  {recommendation.reasons.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      基本スコアのみで評価されています。
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {recommendation.reasons.map(
                        (reason, reasonIndex) => {
                          const isPositive =
                            reason.score >= 0;

                          return (
                            <li
                              key={`${reason.type}-${reasonIndex}`}
                              className="flex items-start justify-between gap-3 text-sm"
                            >
                              <span
                                className={
                                  isPositive
                                    ? "text-emerald-300"
                                    : "text-rose-300"
                                }
                              >
                                {isPositive ? "＋" : "−"}{" "}
                                {reason.text}
                              </span>

                              <span
                                className={`shrink-0 font-medium ${
                                  isPositive
                                    ? "text-emerald-400"
                                    : "text-rose-400"
                                }`}
                              >
                                {isPositive ? "+" : "-"}
                                {Math.abs(reason.score)}
                              </span>
                            </li>
                          );
                        },
                      )}
                    </ul>
                  )}
                </div>
              </article>
            ))}
        </div>
      )}
    </section>
  );
}