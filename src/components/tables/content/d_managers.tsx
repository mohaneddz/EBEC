"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { actions, getColumns, Managers } from "@/components/tables/columns/c_managers"
import { getSupabaseAdmin } from "@/utils/supabase/admin";
import { updateManager } from "@/server/managers"; 

import Modal from "@/components/global/Modal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 

interface ManagerRow {
  id: string;
  full_name: string;
  picture?: string;
  department: departments;
  role?: string;
}


export default function ManagersTable() {
  const [data, setData] = useState<Managers[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Managers | null>(null);
  const [editPicture, setEditPicture] = useState('');
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'Co-Manager' | 'Manager' | 'President' | 'Vice President' | 'SA'>('Manager');
  const [editDepartment, setEditDepartment] = useState<departments>('IT');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = await getSupabaseAdmin();
    const { data: managersData, error } = await supabase
      .from('managers')
      .select('*');

    if (error) {
      console.error("Error fetching managers:", error);
      return;
    }

    const formattedData = await Promise.all(managersData.map(async (member: ManagerRow) => {
      return {
        id: member.id,
        name: member.full_name,
        picture: member.picture || '',
        department: member.department as departments,
        role: (member.role || 'Manager') as "Manager" | "Co-Manager" | "President" | "Vice President" | "SA",
      };
    }));

    setData(formattedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onEdit = (manager: Managers) => {
    setSelectedManager(manager);
    setEditPicture(manager.picture);
    setEditName(manager.name);
    setEditRole(manager.role);
    setEditDepartment(manager.department);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selectedManager) {
      await updateManager(selectedManager.id, {
        picture: editPicture,
        full_name: editName,
        role: editRole,
        department: editDepartment,
      });
      setIsEditModalOpen(false);
      setSelectedManager(null);
      fetchData(); // Reload data
    }
  };

  return (
    <>
      <DataTable columns={getColumns(onEdit)} data={data} onReload={fetchData} loading={loading} actions={actions}/>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Manager">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Picture URL</label>
            <Input
              type="text"
              value={editPicture}
              onChange={(e) => setEditPicture(e.target.value)}
              placeholder="Enter picture URL"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <Select value={editRole} onValueChange={(value) => setEditRole(value as typeof editRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Co-Manager">Co-Manager</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="President">President</SelectItem>
                <SelectItem value="Vice President">Vice President</SelectItem>
                <SelectItem value="SA">SA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Department</label>
            <Select value={editDepartment} onValueChange={(value) => setEditDepartment(value as departments)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Relex">Relex</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="secondary" onClick={handleSaveEdit}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}