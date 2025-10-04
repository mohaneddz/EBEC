"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { columns, Submission } from "@/components/tables/columns/c_submission"
import { getSupabaseAdmin } from "@/utils/supabase/admin";

export default function SubmissionsTable() {
  const [data, setData] = useState<Submission[]>([]);

  const fetchData = useCallback(async () => {
    const supabase = await getSupabaseAdmin();
    const { data: submissionsData, error } = await supabase
      .from('submissions')
      .select('*');

    if (error) {
      console.error("Error fetching submissions:", error);
      return;
    }

    setData(submissionsData as Submission[]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <DataTable columns={columns} data={data} onReload={fetchData} />;
}
