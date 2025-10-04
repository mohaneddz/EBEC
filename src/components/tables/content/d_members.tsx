"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { getColumns, Members } from "@/components/tables/columns/c_members"
import { getUser } from '@/app/actions';

import { promoteUser } from "@/app/actions";
import {changeUserDepartment} from "@/app/actions";

import ConfirmDeleteModal from "@/components/global/ConfirmDeleteModal";
import PromoteUserModal from "@/components/global/PromoteUserModal";
import ChangeDepartmentModal from "@/components/global/ChangeDepartmentModal";

import { getAllUsers } from '@/app/actions';
import { User } from '@supabase/supabase-js';

export default function MembersTable() {

  const [data, setData] = useState<Members[]>([]);

  const [selectedUser, setSelectedUser] = useState<Members | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isChangeDepartmentModalOpen, setIsChangeDepartmentModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const { users, error } = await getAllUsers();

    if (error) {
      console.error("Error fetching members:", error);
      return;
    }
    const formattedData = await Promise.all(users.map(async (user: User) => {
      const userResponse = await getUser(user.id);
      const userDetails = userResponse.user;
      return {
        user_id: userDetails?.id || '',
        picture: userDetails?.user_metadata?.image || '',
        name: userDetails?.user_metadata?.display_name || userDetails?.email || '',
        email: userDetails?.email || '',
        department: (userDetails?.user_metadata?.department || '') as departments,
        status: (userDetails?.user_metadata?.status as 'Active' | 'Inactive') || 'Inactive',
        score: userDetails?.user_metadata?.score || 0,
        role: userDetails?.user_metadata?.role || 'Member',
        created_at: new Date((user.created_at ?? userDetails?.created_at) as string),
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