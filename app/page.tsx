import Header from "../components/Header";
import RecommendationSection from "../components/RecommendationSection";
import RoleSelector from "../components/RoleSelector";
import TeamInput from "../components/TeamInput";
import { searchChampion } from "../lib/searchChampion";

export default function Home() {
  const result = searchChampion("ア");

console.log(result);
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Header />
        <RoleSelector />
        <TeamInput />
        <RecommendationSection />
      </div>
    </main>
  );
}
