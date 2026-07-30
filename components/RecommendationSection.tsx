"use client";

import { useState } from "react";

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
  const [includeTemporaryData, setIncludeTemporaryData] =
    useState(true);

  const analysis =
    analyzeTeam(allyTeam);

  const recommendations =
    recommend(
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

  const activeNeeds =
    teamNeeds.filter(
      (need) => need.needed,
    );

  const registeredCount =
    recommendations.filter(
      (recommendation) =>
        recommendation.isDataRegistered,
    ).length;

  const temporaryCount =
    recommendations.length -
    registeredCount;

  const filteredRecommendations =
    includeTemporaryData
      ? recommendations
      : recommendations.filter(
          (recommendation) =>
            recommendation.isDataRegistered,
        );

  const visibleRecommendations =
    filteredRecommendations.slice(0, 10);

  return (
    <section className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div>
        <h2 className="text-xl font-bold">
          おすすめ（{selectedRole}）
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          味方構成・敵構成・対面相性を基準に評価しています。
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

      <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              仮データを含める
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              未登録チャンピオンは初期データで評価されます。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-semibold ${
                includeTemporaryData
                  ? "text-sky-300"
                  : "text-slate-500"
              }`}
            >
              {includeTemporaryData
                ? "ON"
                : "OFF"}
            </span>

            <button
              type="button"
              role="switch"
              aria-label="仮データを含める"
              aria-checked={includeTemporaryData}
              onClick={() =>
                setIncludeTemporaryData(
                  (current) => !current,
                )
              }
              className={`relative h-7 w-12 rounded-full transition ${
                includeTemporaryData
                  ? "bg-sky-600"
                  : "bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                  includeTemporaryData
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-sky-300">
            登録済み {registeredCount}
          </span>

          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-amber-300">
            仮データ {temporaryCount}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-slate-400">
          表示対象
          <span className="ml-2 font-semibold text-sky-300">
            {filteredRecommendations.length}
          </span>
          <span className="mx-1 text-slate-600">
            /
          </span>
          <span>
            {recommendations.length}
          </span>
        </p>

        <p className="text-xs text-slate-500">
          最大10件を表示
        </p>
      </div>

      {filteredRecommendations.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-5">
          <p className="text-sm text-slate-300">
            登録済みの候補がありません。
          </p>

          <p className="mt-1 text-sm text-slate-500">
            仮データの表示をONにすると、未登録候補も表示できます。
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleRecommendations.map(
            (
              recommendation,
              index,
            ) => (
              <article
                key={
                  recommendation
                    .champion.id
                }
                className="rounded-lg border border-slate-700 bg-slate-800 p-4"
              >
                <div className="flex items-start justify-between gap-4">
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

                    <div className="space-y-2">
                      <ChampionCard
                        champion={
                          recommendation
                            .champion
                        }
                      />

                      <span
                        className={`inline-block rounded-full border px-2 py-1 text-xs ${
                          recommendation
                            .isDataRegistered
                            ? "border-sky-500/40 bg-sky-500/10 text-sky-300"
                            : "border-amber-500/40 bg-amber-500/10 text-amber-300"
                        }`}
                      >
                        {recommendation
                          .isDataRegistered
                          ? "登録済み"
                          : "仮データ"}
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 font-semibold text-yellow-400">
                    {recommendation.score} pt
                  </span>
                </div>

                <div className="mt-4 border-t border-slate-700 pt-3">
                  {!recommendation
                    .isDataRegistered && (
                    <p className="mb-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
                      このチャンピオンは未登録のため、初期データで評価されています。
                    </p>
                  )}

                  {recommendation.reasons
                    .length === 0 ? (
                    <p className="text-sm text-slate-400">
                      基本スコアのみで評価されています。
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {recommendation.reasons.map(
                        (
                          reason,
                          reasonIndex,
                        ) => {
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
                                {isPositive
                                  ? "＋"
                                  : "−"}{" "}
                                {reason.text}
                              </span>

                              <span
                                className={`shrink-0 font-medium ${
                                  isPositive
                                    ? "text-emerald-400"
                                    : "text-rose-400"
                                }`}
                              >
                                {isPositive
                                  ? "+"
                                  : "-"}
                                {Math.abs(
                                  reason.score,
                                )}
                              </span>
                            </li>
                          );
                        },
                      )}
                    </ul>
                  )}
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}