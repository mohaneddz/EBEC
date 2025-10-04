"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { columns, Managers } from "@/components/tables/columns/c_managers"
import { getSupabaseAdmin } from "@/utils/supabase/admin";

export default function ManagersTable() {
  const [data, setData] = useState<Managers[]>([]);

  const fetchData = useCallback(async () => {
    const supabase = await getSupabaseAdmin();
    const { data: managersData, error } = await supabase
      .from('managers')
      .select('*');

    if (error) {
      console.error("Error fetching managers:", error);
      return;
    }
    const formattedData = await Promise.all(managersData.map(async (member: any) => {
      return {
        user_id: member.id,
        name: member.full_name,
        picture: member.picture || '',
        department: member.department as departments,
        role: member.role || 'Manager',
      };
    }));


    setData(formattedData);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <DataTable columns={columns} data={data} onReload={fetchData} />;
}