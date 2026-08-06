"use client";

import { useState } from "react";

import ChampionCard from "./ChampionCard";
import DraftDiagnosis from "./DraftDiagnosis";
import DraftMetricsDisplay from "./DraftMetricsDisplay";
import RecommendationReasonGroups from "./RecommendationReasonGroups";

import { analyzeTeam } from "../lib/analyzeTeam";
import { analyzeAllyComposition } from "../lib/analyzeAllyComposition";
import { analyzeChampionSynergy } from "../lib/analyzeChampionSynergy";
import { analyzeObjectiveNeed } from "../lib/analyzeObjectiveNeed";
import { analyzePickPotentialNeed } from "../lib/analyzePickPotentialNeed";
import { analyzeRoamNeed } from "../lib/analyzeRoamNeed";
import { analyzeSideLaneNeed } from "../lib/analyzeSideLaneNeed";
import { buildBasicDraftDiagnosis } from "../lib/buildBasicDraftDiagnosis";
import { buildDraftMetricsDiagnosis } from "../lib/buildDraftMetricsDiagnosis";
import { analyzeTeamfightNeed } from "../lib/analyzeTeamfightNeed";
import { getChampionDetail } from "../lib/analyzeTraits";
import { getDraftTurn } from "../lib/draftPickOrder";
import { generateReason } from "../lib/generateReason";
import { groupRecommendationReasons } from "../lib/groupRecommendationReasons";
import {
  matchesChampionSearch,
  normalizeChampionSearchValue,
} from "../lib/championSearch";
import {
  formatScoreModifier,
  formatTotalScore,
} from "../lib/formatScore";
import { recommend } from "../lib/recommend";
import { ROLE_INDEX } from "../lib/role";
import { selectRecommendationReasons } from "../lib/selectRecommendationReasons";

import type {
  Champion,
  Role,
} from "../types/champion";
import type {
  DraftPhaseState,
  PlayerTeamSide,
} from "../types/draftPhase";

type RecommendationSectionProps = {
  draftPhaseState: DraftPhaseState;
  playerTeamSide: PlayerTeamSide;
  allyTeam: (Champion | null)[];
  enemyTeam: (Champion | null)[];
  allyBans: (Champion | null)[];
  enemyBans: (Champion | null)[];
  selectedRole: Role;
  onSelectChampion: (
    champion: Champion,
  ) => void;
};

export default function RecommendationSection({
  draftPhaseState,
  playerTeamSide,
  allyTeam,
  enemyTeam,
  allyBans,
  enemyBans,
  selectedRole,
  onSelectChampion,
}: RecommendationSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [
    expandedChampionIds,
    setExpandedChampionIds,
  ] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleScoreDetails = (
    championId: string,
  ) => {
    setExpandedChampionIds(
      (currentIds) => {
        const nextIds = new Set(
          currentIds,
        );

        if (nextIds.has(championId)) {
          nextIds.delete(championId);
        } else {
          nextIds.add(championId);
        }

        return nextIds;
      },
    );
  };

  const recommendations =
    recommend(
      allyTeam,
      enemyTeam,
      allyBans,
      enemyBans,
      selectedRole,
      getDraftTurn(
        draftPhaseState.currentTurn,
        playerTeamSide,
      ).side,
    );

  const allyAnalysis = analyzeTeam(allyTeam);
  const allyCompositionAnalysis = analyzeAllyComposition(
    allyTeam,
    selectedRole,
  );
  const hasSelectedAlly = allyTeam.some(
    (champion) => champion !== null,
  );
  const draftMetricsDiagnosis = buildDraftMetricsDiagnosis({
    teamfight: analyzeTeamfightNeed(allyTeam, selectedRole),
    roam: analyzeRoamNeed(allyTeam, selectedRole),
    sideLane: analyzeSideLaneNeed(allyTeam, selectedRole),
    pickPotential: analyzePickPotentialNeed(allyTeam, selectedRole),
    objective: analyzeObjectiveNeed(allyTeam, selectedRole),
    selectedRole,
  });
  const diagnosisItems = hasSelectedAlly
    ? [
        ...buildBasicDraftDiagnosis(allyAnalysis),
        ...draftMetricsDiagnosis,
      ]
    : [];

  const selectedAllyChampion =
    allyTeam[
      ROLE_INDEX[selectedRole]
    ] ?? null;

  const normalizedSearchQuery =
    normalizeChampionSearchValue(searchQuery);
  const isSearching = normalizedSearchQuery.length > 0;
  const rankedRecommendations = recommendations.map(
    (recommendation, index) => ({
      ...recommendation,
      rank: index + 1,
    }),
  );
  const matchingRecommendations = isSearching
    ? rankedRecommendations.filter((recommendation) =>
        matchesChampionSearch(
          recommendation.champion,
          normalizedSearchQuery,
        ),
      )
    : rankedRecommendations;

  const visibleRecommendations =
    (isSearching
      ? matchingRecommendations
      : matchingRecommendations.slice(0, 10))
      .map((recommendation) => {
        const traitReasons = generateReason(
          enemyTeam,
          recommendation.champion,
        );
        const championSynergy = analyzeChampionSynergy(
          allyTeam,
          selectedRole,
          recommendation.champion,
        );

        const selectedReasons = selectRecommendationReasons({
          scoreReasons: recommendation.reasons,
          championSynergyReasons: championSynergy.reasons,
          championSynergyScore: championSynergy.score,
          traitReasons,
        });

        return {
          ...recommendation,
          draftMetrics: getChampionDetail(
            recommendation.champion.id,
          )?.draftMetrics,
          matchupReasonGroups: groupRecommendationReasons(selectedReasons),
          selectedReasonCount: selectedReasons.length,
        };
      });

  return (
    <section
      data-draft-mode={draftPhaseState.mode}
      data-draft-turn={draftPhaseState.currentTurn}
      data-player-team-side={playerTeamSide}
      className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/50 p-6"
    >
      <div>
        <h2 className="text-xl font-bold">
          おすすめ（{selectedRole}）
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          味方構成・敵構成・対面相性を基準に評価しています。
        </p>
      </div>

      <DraftDiagnosis
        items={diagnosisItems}
        compositionAnalysis={allyCompositionAnalysis}
      />

      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
        <label
          htmlFor="recommendation-champion-search"
          className="text-sm font-semibold text-slate-200"
        >
          チャンピオン検索
        </label>

        <input
          id="recommendation-champion-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="チャンピオン名で検索"
          aria-describedby="recommendation-search-help"
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
        />

        <p
          id="recommendation-search-help"
          className="mt-2 text-xs text-slate-500"
        >
          上位10体にいない候補も検索して確認できます。
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-slate-400">
          {isSearching ? (
            <>
              検索結果
              <span className="mx-1 font-semibold text-sky-300">
                {matchingRecommendations.length}件
              </span>
              / 推薦候補{recommendations.length}体
            </>
          ) : (
            <>
              表示対象
              <span className="mx-1 font-semibold text-sky-300">
                {recommendations.length}
              </span>
              / {recommendations.length}
            </>
          )}
        </p>

        {!isSearching && (
          <p className="text-xs text-slate-500">
            最大10件を表示
          </p>
        )}
      </div>

      {selectedAllyChampion && (
        <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-3">
          <p className="text-sm text-sky-200">
            候補を選択すると、現在の味方
            <span className="mx-1 font-semibold">
              {selectedRole}
            </span>
            枠の
            <span className="mx-1 font-semibold">
              {selectedAllyChampion.name}
            </span>
            と置き換わります。
          </p>
        </div>
      )}

      {visibleRecommendations.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-5">
          <p className="text-sm text-slate-300">
            {isSearching
              ? "一致する推薦候補がありません"
              : "推薦候補がありません"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleRecommendations.map(
            (
              recommendation,
            ) => (
              <article
                key={
                  recommendation
                    .champion.id
                }
                className="rounded-lg border border-slate-700 bg-slate-800 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="w-8 shrink-0 text-center font-bold text-yellow-400">
                      {recommendation.rank === 1
                        ? "🥇"
                        : recommendation.rank === 2
                          ? "🥈"
                          : recommendation.rank === 3
                            ? "🥉"
                            : `${recommendation.rank}位`}
                    </span>

                    <div className="space-y-2">
                      <ChampionCard
                        champion={
                          recommendation
                            .champion
                        }
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-3">
                    <span className="font-semibold text-yellow-400">
                      {formatTotalScore(
                        recommendation.score,
                      )}{" "}
                      pt
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        onSelectChampion(
                          recommendation
                            .champion,
                        )
                      }
                      className="rounded-lg border border-sky-500/50 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
                    >
                      {selectedAllyChampion
                        ? `${selectedRole}を変更`
                        : `${selectedRole}に設定`}
                    </button>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-700 pt-3">
                  <RecommendationReasonGroups
                    championId={recommendation.champion.id}
                    groups={recommendation.matchupReasonGroups}
                  />

                  <div
                    className={
                      recommendation.selectedReasonCount > 0
                        ? "mt-3"
                        : undefined
                    }
                  >
                      <button
                        type="button"
                        aria-expanded={expandedChampionIds.has(
                          recommendation.champion.id,
                        )}
                        aria-controls={`score-details-${recommendation.champion.id}`}
                        onClick={() =>
                          toggleScoreDetails(
                            recommendation.champion.id,
                          )
                        }
                        className="rounded-md border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-500/60 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                      >
                        {expandedChampionIds.has(
                          recommendation.champion.id,
                        )
                          ? "スコア詳細を閉じる ▲"
                          : "スコア詳細を表示 ▼"}
                      </button>

                      {expandedChampionIds.has(
                        recommendation.champion.id,
                      ) && (
                        <div
                          id={`score-details-${recommendation.champion.id}`}
                          className="mt-3 border-t border-slate-700 pt-3"
                        >
                          <p className="mb-2 text-xs font-semibold text-slate-300">
                            スコア内訳
                          </p>

                          {recommendation.reasons.length > 0 ? (
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
                                      {formatScoreModifier(
                                        reason.score,
                                      )}
                                    </span>
                                  </li>
                                );
                              },
                              )}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-500">
                              基本スコアのみで評価されています。
                            </p>
                          )}

                          <DraftMetricsDisplay
                            metrics={recommendation.draftMetrics}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}
