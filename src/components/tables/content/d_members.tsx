"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { actions, getColumns, Members } from "@/components/tables/columns/c_members"

import { promoteUser, getUser, getAllUsers, deleteUser, updateUserScore, updateUserStatus } from "@/server/users";
import { changeUserDepartment } from "@/server/departments";

import ConfirmDeleteModal from "@/components/global/ConfirmDeleteModal";
import PromoteUserModal from "@/components/global/PromoteUserModal";
import ChangeDepartmentModal from "@/components/global/ChangeDepartmentModal";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MembersTable() {

  const [data, setData] = useState<Members[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<Members | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isChangeDepartmentModalOpen, setIsChangeDepartmentModalOpen] = useState(false);
  const [isUpdateScoreModalOpen, setIsUpdateScoreModalOpen] = useState(false);
  const [bonusScore, setBonusScore] = useState<number>(0);

  const [isBulkUpdateScoreModalOpen, setIsBulkUpdateScoreModalOpen] = useState(false);
  const [bulkSelectedRows, setBulkSelectedRows] = useState<Members[]>([]);
  const [bulkBonusScore, setBulkBonusScore] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { users, error } = await getAllUsers();

    if (error) {
      console.error("Error fetching members:", error);
      return;
    }
    const formattedData = await Promise.all(users.map(async (user) => {
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
    setLoading(false);
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

  const onUpdateScore = (user: Members) => {
    setSelectedUser(user);
    setBonusScore(0);
    setIsUpdateScoreModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser?.user_id) return;
    setIsDeleteModalOpen(false);
    deleteUser(selectedUser.user_id);
    setSelectedUser(null);
    await fetchData();
  };

  async function handleSaveChangeRole(role: string) {
    if (!selectedUser?.user_id) return;
    promoteUser(selectedUser.user_id, role);
    setIsPromoteModalOpen(false);
    setSelectedUser(null);
    await fetchData();
  }

  async function handleSaveChangeDepartment(department: string) {
    if (!selectedUser?.user_id) return;
    changeUserDepartment(selectedUser.user_id, department);
    setIsChangeDepartmentModalOpen(false);
    setSelectedUser(null);
    await fetchData();
  }

  async function handleSaveUpdateScore() {
    if (!selectedUser?.user_id) return;
    await updateUserScore(selectedUser.user_id, bonusScore);
    setIsUpdateScoreModalOpen(false);
    setSelectedUser(null);
    await fetchData();
  }

  async function handleBulkSaveUpdateScore() {
    for (const user of bulkSelectedRows) {
      if (user.user_id) {
        await updateUserScore(user.user_id, bulkBonusScore);
      }
    }
    setIsBulkUpdateScoreModalOpen(false);
    setBulkSelectedRows([]);
    await fetchData();
  }

  const onSetActive = (user: Members) => {
    if (!user.user_id) return;
    updateUserStatus(user.user_id, 'Active');
    fetchData();
  };

  const onSetInactive = (user: Members) => {
    if (!user.user_id) return;
    updateUserStatus(user.user_id, 'Inactive');
    fetchData();
  };

  const onSetActiveBulk = (selectedRows: Members[], onReload: () => void) => {
    selectedRows.forEach((user) => {
      if (user.user_id) {
        updateUserStatus(user.user_id, 'Active');
      }
    });
    onReload();
  };

  const onSetInactiveBulk = (selectedRows: Members[], onReload: () => void) => {
    selectedRows.forEach((user) => {
      if (user.user_id) {
        updateUserStatus(user.user_id, 'Inactive');
      }
    });
    onReload();
  };

  const extendedActions = [
    ...actions,
    {
      title: "Update Score",
      action: (selectedRows: Members[], onReload: () => void) => {
        setBulkSelectedRows(selectedRows);
        setBulkBonusScore(0);
        setIsBulkUpdateScoreModalOpen(true);
      },
    },
  ];

  return (
    <>
      <DataTable columns={getColumns(onDelete, onPromote, onChangeDepartment, onUpdateScore, onSetActive, onSetInactive)} data={data} onReload={fetchData} loading={loading} actions={extendedActions} />
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
      <Dialog open={isUpdateScoreModalOpen} onOpenChange={setIsUpdateScoreModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Score</DialogTitle>
            <DialogDescription>
              Enter a bonus score (positive or negative) to add to the user's current score.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bonus-score" className="text-right">
                Bonus Score
              </Label>
              <Input
                id="bonus-score"
                type="number"
                value={bonusScore}
                onChange={(e) => setBonusScore(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsUpdateScoreModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUpdateScore}>Update Score</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isBulkUpdateScoreModalOpen} onOpenChange={setIsBulkUpdateScoreModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Score for Selected Users</DialogTitle>
            <DialogDescription>
              Enter a bonus score (positive or negative) to add to the current score of each selected user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bulk-bonus-score" className="text-right">
                Bonus Score
              </Label>
              <Input
                id="bulk-bonus-score"
                type="number"
                value={bulkBonusScore}
                onChange={(e) => setBulkBonusScore(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsBulkUpdateScoreModalOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkSaveUpdateScore}>Update Scores</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}