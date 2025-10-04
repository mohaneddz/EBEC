"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { columns, Signup } from "@/components/tables/columns/c_signups"
import { getSupabaseAdmin } from "@/utils/supabase/admin";

export default function SignupsTable() {
  const [data, setData] = useState<Signup[]>([]);

  const fetchData = useCallback(async () => {
    const supabase = await getSupabaseAdmin();
    const { data: signupsData, error } = await supabase
      .from('signups')
      .select('*');

    if (error) {
      console.error("Error fetching signups:", error);
      return;
    }

    setData(signupsData as Signup[]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <DataTable columns={columns} data={data} onReload={fetchData} />;
}