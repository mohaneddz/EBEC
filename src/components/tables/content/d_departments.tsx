"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { getColumns, DepartmentSwitch } from "@/components/tables/columns/c_departments"
import { getSupabaseAdmin } from '@/utils/supabase/admin';
import { getUser } from '@/server/users';

export default function DepartmentsTable() {
  const [data, setData] = useState<DepartmentSwitch[]>([]);

  const fetchData = useCallback(async () => {
    const supabase = await getSupabaseAdmin();
    const { data: rawData, error } = await supabase.from('department_switch').select('*');
    if (error) {
      console.error('Error fetching department switch data:', error);
      return;
    }
    const formattedData = await Promise.all(rawData.map(async (item) => {
      const userResponse = await getUser(item.user_id);
      const user = userResponse.user;
      return {
        user_id: item.user_id,
        picture: user?.user_metadata?.image || '/imgs/DEFAULT.webp',
        email: user?.email || '',
        name: user?.user_metadata?.display_name || '',
        old_department: user?.user_metadata?.department || 'N/A',
        new_department: item.department,
        motivation: item.motivation,
        created_at: new Date(item.created_at),
      };
    }));
    setData(formattedData);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const removeRow = (userId: string) => {
    setData(prev => prev.filter(item => item.user_id !== userId));
  };

  const columns = getColumns(removeRow);

  return (
    <div className="w-full">
      <DataTable columns={columns} data={data} onReload={fetchData} />
    </div>
  );
}
