import type {
  AllyCompositionAnalysis,
  AllyCompositionType,
} from "../lib/analyzeAllyComposition";

type AllyCompositionDiagnosisProps = Readonly<{
  analysis: AllyCompositionAnalysis;
}>;

const COMPOSITION_PRESENTATION = {
  DIVE: {
    label: "ダイブ構成",
    description: "敵後衛へ一気に入り込む戦い方に向いています",
  },
  POKE: {
    label: "ポーク構成",
    description: "長射程攻撃で削ってから戦う構成です",
  },
  FRONT_TO_BACK: {
    label: "フロント・トゥ・バック構成",
    description:
      "前衛が受け、後衛が継続火力を出す戦い方に向いています",
  },
  CATCH: {
    label: "キャッチ構成",
    description: "単体を捕まえて人数差を作る戦い方に向いています",
  },
  SIDE_LANE: {
    label: "サイドレーン構成",
    description:
      "サイドレーンの圧力から相手を動かす戦い方に向いています",
  },
} as const satisfies Record<
  AllyCompositionType,
  { label: string; description: string }
>;

export default function AllyCompositionDiagnosis({
  analysis,
}: AllyCompositionDiagnosisProps) {
  if (analysis.selectedCount < 2) {
    return null;
  }

  return (
    <section aria-labelledby="ally-composition-heading" className="mt-4">
      <h4
        id="ally-composition-heading"
        className="text-xs font-semibold uppercase tracking-wide text-sky-300"
      >
        構成タイプ
      </h4>

      {analysis.types.length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">
          明確な構成タイプはまだありません
        </p>
      ) : (
        <ul className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {analysis.types.map((type) => {
            const presentation = COMPOSITION_PRESENTATION[type];

            return (
              <li
                key={type}
                className="min-w-0 rounded-lg border border-sky-500/25 bg-sky-500/10 p-3"
              >
                <p className="break-words text-sm font-semibold text-sky-200">
                  {presentation.label}
                </p>
                <p className="mt-1 break-words text-xs leading-5 text-slate-300">
                  {presentation.description}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
