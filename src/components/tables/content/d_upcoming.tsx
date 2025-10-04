"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { columns, Upcoming } from "@/components/tables/columns/c_upcoming"
import { getSupabaseAdmin } from "@/utils/supabase/admin";

export default function UpcomingEventsTable() {
  const [data, setData] = useState<Upcoming[]>([]);

  const fetchData = useCallback(async () => {
    const supabase = await getSupabaseAdmin();
    const { data: upcomingEventsData, error } = await supabase
      .from('upcoming_events')
      .select('*');

    if (error) {
      console.error("Error fetching upcoming events:", error);
      return;
    }

    setData(upcomingEventsData as Upcoming[]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <DataTable columns={columns} data={data} onReload={fetchData} />;
}