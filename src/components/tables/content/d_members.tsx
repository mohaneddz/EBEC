"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { getColumns, Members } from "@/components/tables/columns/c_members"
import { getSupabaseAdmin } from "@/utils/supabase/admin";
import { getUser } from '@/app/actions';

import { promoteUser } from "@/app/actions";
import {changeUserDepartment} from "@/app/actions";

import ConfirmDeleteModal from "@/components/global/ConfirmDeleteModal";
import PromoteUserModal from "@/components/global/PromoteUserModal";
import ChangeDepartmentModal from "@/components/global/ChangeDepartmentModal";

import { getAllUsers } from '@/app/actions';

export default function MembersTable() {

  const [data, setData] = useState<Members[]>([]);

  const [selectedUser, setSelectedUser] = useState<Members | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isChangeDepartmentModalOpen, setIsChangeDepartmentModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const supabase = await getSupabaseAdmin();

    const { users, error } = await getAllUsers();

    if (error) {
      console.error("Error fetching members:", error);
      return;
    }
    const formattedData = await Promise.all(users.map(async (member: any) => {
      const userResponse = await getUser(member.id);
      const user = userResponse.user;
      return {
        user_id: user?.id || '',
        picture: user?.user_metadata?.image || '',
        name: user?.user_metadata?.display_name || '',
        email: user?.email || '',
        department: (user?.user_metadata?.department || '') as departments,
        status: member.user_metadata.status as 'Active' | 'Inactive',
        score: member.user_metadata?.score || 0,
        role: member.user_metadata?.role || 'Member',
        created_at: new Date(member.created_at),
      };
    }));

    setData(formattedData);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onDelete = (user: Members) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const onPromote = (user: Members) => {
    setSelectedUser(user);
    setIsPromoteModalOpen(true);
  };

  const onChangeDepartment = (user: Members) => {
    setSelectedUser(user);
    setIsChangeDepartmentModalOpen(true);
  };

  const handleDelete = () => {
    // console.log("Deleting user:", selectedUser?.user_id);
    // Add delete logic here
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handlePromote = (role: string) => {
    // console.log("Promoting user:", selectedUser?.user_id, "to", role);
    // Add promote logic here
    setIsPromoteModalOpen(false);
    setSelectedUser(null);
  };

  const handleChangeDepartment = (department: string) => {
    // console.log("Changing department for user:", selectedUser?.user_id, "to", department);
    setIsChangeDepartmentModalOpen(false);
    setSelectedUser(null);
  };

  async function handleSaveChangeRole(role: string) {
    promoteUser(selectedUser?.user_id || '', role);
    setIsPromoteModalOpen(false);
    setSelectedUser(null);
    await fetchData();
  }

  async function handleSaveChangeDepartment(department: string) {
    changeUserDepartment(selectedUser?.user_id || '', department);
    setIsChangeDepartmentModalOpen(false);
    setSelectedUser(null);
    await fetchData();
  }

  return (
    <>
      <DataTable columns={getColumns(onDelete, onPromote, onChangeDepartment)} data={data} onReload={fetchData} />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
      <PromoteUserModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        onSelect={handlePromote}
        onSubmit={handleSaveChangeRole}
      />
      <ChangeDepartmentModal
        isOpen={isChangeDepartmentModalOpen}
        onClose={() => setIsChangeDepartmentModalOpen(false)}
        onSubmit={handleSaveChangeDepartment}
      />
    </>
  );
}