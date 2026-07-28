"use client";

type ChampionSearchProps = {
  role: string;
};

export default function ChampionSearch({ role }: ChampionSearchProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2">
      <span className="w-10 text-xs font-bold text-yellow-400">
        {role}
      </span>

      <input
        type="text"
        placeholder="チャンピオンを検索..."
        className="flex-1 rounded-md bg-slate-800 px-3 py-2 text-sm text-white outline-none"
      />
    </div>
  );
}