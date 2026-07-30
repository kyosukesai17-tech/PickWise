import type { Champion } from "../types/champion";

type RecommendationSectionProps = {
  allyTeam: (Champion | null)[];
  enemyTeam: (Champion | null)[];
};

export default function RecommendationSection({
  allyTeam,
  enemyTeam,
}: RecommendationSectionProps) {
  const selectedCount =
    allyTeam.filter(Boolean).length +
    enemyTeam.filter(Boolean).length;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <h2 className="mb-3 text-xl font-bold text-slate-100">
        おすすめチャンピオン
      </h2>

      {selectedCount === 0 ? (
        <p className="text-slate-400">
          味方または敵のチャンピオンを選択してください。
        </p>
      ) : (
        <p className="text-slate-400">
          おすすめエンジンは次のCommitで実装します。
        </p>
      )}
    </section>
  );
}