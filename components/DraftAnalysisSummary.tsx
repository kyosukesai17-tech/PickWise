import ChampionCard from "./ChampionCard";

import { analyzeAllySynergy } from "../lib/analyzeAllySynergy";
import { analyzeEnemyTeam } from "../lib/analyzeEnemyTeam";
import { analyzeRoleOpponent } from "../lib/analyzeRoleOpponent";

import type {
  Champion,
  Role,
} from "../types/champion";

type DraftAnalysisSummaryProps = {
  allyTeam: (Champion | null)[];
  enemyTeam: (Champion | null)[];
  selectedRole: Role;
};

type AnalysisTag = {
  label: string;
  active: boolean;
};

export default function DraftAnalysisSummary({
  allyTeam,
  enemyTeam,
  selectedRole,
}: DraftAnalysisSummaryProps) {
  const allyAnalysis =
    analyzeAllySynergy(allyTeam);

  const enemyAnalysis =
    analyzeEnemyTeam(enemyTeam);

  const opponentAnalysis =
    analyzeRoleOpponent(
      enemyTeam,
      selectedRole,
    );

  const allyTags: AnalysisTag[] = [
    {
      label: "ポーク構成",
      active: allyAnalysis.hasPokeCore,
    },
    {
      label: "エンゲージ構成",
      active: allyAnalysis.hasEngageCore,
    },
    {
      label: "キャリーあり",
      active: allyAnalysis.hasCarry,
    },
    {
      label: "キャッチ構成",
      active: allyAnalysis.hasCatchCore,
    },
  ];

  const enemyTags: AnalysisTag[] = [
    {
      label: "ダイブ脅威",
      active: enemyAnalysis.hasHeavyDive,
    },
    {
      label: "近接中心",
      active: enemyAnalysis.isMeleeHeavy,
    },
    {
      label: "遠距離中心",
      active: enemyAnalysis.isRangedHeavy,
    },
    {
      label: "前衛が多い",
      active:
        enemyAnalysis.hasMultipleFrontlines,
    },
  ];

  const opponentTags: AnalysisTag[] = [
    {
      label: "近接",
      active: opponentAnalysis.isMelee,
    },
    {
      label: "遠距離",
      active: opponentAnalysis.isRanged,
    },
    {
      label: "アサシン",
      active:
        opponentAnalysis.isAssassin,
    },
    {
      label: "エンゲージ",
      active:
        opponentAnalysis.hasEngage,
    },
    {
      label: "ポーク",
      active:
        opponentAnalysis.hasPokeOrSiege,
    },
    {
      label: "キャッチ",
      active:
        opponentAnalysis.hasCatch,
    },
    {
      label: "ウェーブクリア高",
      active:
        opponentAnalysis.hasHighWaveClear,
    },
  ];

  const activeAllyTags =
    allyTags.filter(
      (tag) => tag.active,
    );

  const activeEnemyTags =
    enemyTags.filter(
      (tag) => tag.active,
    );

  const activeOpponentTags =
    opponentTags.filter(
      (tag) => tag.active,
    );

  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div>
        <h2 className="text-xl font-bold">
          ドラフト分析
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          現在入力されている構成を分析しています。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AnalysisCard
          title="味方構成"
          count={allyAnalysis.selectedCount}
          tags={activeAllyTags}
          emptyText="構成の特徴はまだ確定していません。"
          tone="ally"
        />

        <AnalysisCard
          title="敵構成"
          count={enemyAnalysis.selectedCount}
          tags={activeEnemyTags}
          emptyText="目立った脅威はまだ検出されていません。"
          tone="enemy"
        />

        <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-100">
              {selectedRole}対面
            </h3>

            <span className="rounded-full border border-violet-500/40 bg-violet-500/10 px-2 py-1 text-xs text-violet-300">
              対面分析
            </span>
          </div>

          {!opponentAnalysis.hasOpponent ||
          !opponentAnalysis.opponent ? (
            <p className="text-sm text-slate-400">
              敵の{selectedRole}枠を入力すると、対面相性を分析します。
            </p>
          ) : (
            <div className="space-y-4">
              <ChampionCard
                champion={
                  opponentAnalysis.opponent
                }
              />

              {activeOpponentTags.length ===
              0 ? (
                <p className="text-sm text-slate-400">
                  対面データに目立った特徴がありません。
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {activeOpponentTags.map(
                    (tag) => (
                      <span
                        key={tag.label}
                        className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs text-violet-300"
                      >
                        {tag.label}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type AnalysisCardProps = {
  title: string;
  count: number;
  tags: AnalysisTag[];
  emptyText: string;
  tone: "ally" | "enemy";
};

function AnalysisCard({
  title,
  count,
  tags,
  emptyText,
  tone,
}: AnalysisCardProps) {
  const tagClassName =
    tone === "ally"
      ? "border-sky-500/40 bg-sky-500/10 text-sky-300"
      : "border-rose-500/40 bg-rose-500/10 text-rose-300";

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-100">
          {title}
        </h3>

        <span className="text-sm text-slate-400">
          {count} / 5
        </span>
      </div>

      {tags.length === 0 ? (
        <p className="text-sm text-slate-400">
          {emptyText}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className={`rounded-full border px-3 py-1 text-xs ${tagClassName}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}