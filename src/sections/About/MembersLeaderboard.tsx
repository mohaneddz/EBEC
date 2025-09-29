import { LeaderboardTable } from "@/components/tables/leaderboard";
import { columns } from "@/components/tables/c_leaderboard"
import { dummyData } from "@/data/managers"

export default async function MembersLeaderboard() {

  const data = dummyData;

  return (
    <section className="mx-auto full">
      <LeaderboardTable columns={columns} data={data} />
    </section>
  );
}