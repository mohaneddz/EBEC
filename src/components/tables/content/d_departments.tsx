"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { getColumns, DepartmentSwitch, actions } from "@/components/tables/columns/c_departments"
import { getSupabaseAdmin } from '@/utils/supabase/admin';
import { getUser } from '@/server/users';


import Modal from "@/components/global/Modal";

export default function DepartmentsTable() {
  const [data, setData] = useState<DepartmentSwitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMotivation, setSelectedMotivation] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = await getSupabaseAdmin();
    const { data: rawData, error } = await supabase.from('department_switch').select('*');
    if (error) {
      console.error('Error fetching department switch data:', error);
      setLoading(false);
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
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const removeRow = (userId: string) => {
    fetchData();
  };

  const onViewMotivation = (motivation: string) => {
    setSelectedMotivation(motivation);
    setIsModalOpen(true);
  };

  const columns = getColumns(removeRow, onViewMotivation);

  return (
    <div className="w-full">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Motivation Details"
      >
        <p>{selectedMotivation}</p>
      </Modal>
      <DataTable columns={columns} data={data} onReload={fetchData} actions={actions} loading={loading} />
    </div>
  );
}
