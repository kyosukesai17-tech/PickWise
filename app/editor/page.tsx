import ChampionDataEditor from "@/components/ChampionDataEditor";

export default function EditorPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        ChampionData Editor
      </h1>

      <ChampionDataEditor />
    </main>
  );
}