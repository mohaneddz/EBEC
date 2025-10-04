"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { columns, LeaderboardUser } from "@/components/tables/columns/c_leaderboard"
import { getSupabaseAdmin } from "@/utils/supabase/admin";

export default function LeaderboardTable() {
  const [data, setData] = useState<LeaderboardUser[]>([]);

  const fetchData = useCallback(async () => {
    const supabase = await getSupabaseAdmin();
    const { data: leaderboardData, error } = await supabase
      .from('leaderboard')
      .select('*');

    if (error) {
      console.error("Error fetching leaderboard data:", error);
      return;
    }

    setData(leaderboardData as LeaderboardUser[]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <DataTable columns={columns} data={data} onReload={fetchData} />;
}