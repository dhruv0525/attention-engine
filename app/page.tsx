import FeedMain from "@/components/FeedMain";
import StatsPanel from "@/components/StatsPanel";

export default function Home() {
  return (
    <main className="p-4">
      <StatsPanel />
      <FeedMain />
    </main>
  );
}
