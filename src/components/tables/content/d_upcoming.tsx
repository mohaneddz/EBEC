"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { DataTable } from "@/components/tables/data-table"
import { getColumns, Upcoming, actions } from "@/components/tables/columns/c_upcoming"
import { getSupabaseAdmin } from "@/utils/supabase/admin";
import { updateUpcomingEvent, clearEvent, uploadEventImage } from "@/server/upcoming";
import { compressToAvif } from "@/utils/convertion";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { X, Image } from 'lucide-react'

const ImageUpload = ({ src, onRemove, onFileSelect }: { src: string | null; onRemove: () => void; onFileSelect: (file: File | null) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-20 h-20 border border-gray-300 rounded overflow-hidden group bg-slate-300">
      {src && <img src={src} alt="" className="w-full h-full object-cover" />}

      {/* Overlay only on hover */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity flex items-center justify-center">
        <X className="text-white cursor-pointer mr-2" onClick={onRemove} />
        <Image className="text-white cursor-pointer" onClick={() => fileInputRef.current?.click()} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
      />
    </div>
  );
};

export default function UpcomingEventsTable() {
  const [data, setData] = useState<Upcoming[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Upcoming | null>(null);
  const [formData, setFormData] = useState<Partial<Upcoming>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const supabase = await getSupabaseAdmin();
    const { data: upcomingEventsData, error } = await supabase
      .from('upcoming')
      .select('*');

    if (error) {
      console.error("Error fetching upcoming events:", error);
      return;
    }

    setData(upcomingEventsData.map(item => ({ ...item, date: item.date ? new Date(item.date) : null })) as Upcoming[]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openEditModal = (event: Upcoming) => {
    setEditingEvent(event);
    setFormData(event);
    setSelectedFile(null);
    setPreviewSrc(null);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingEvent) return;

    let updatedImage = formData.picture;
    if (selectedFile) {
      const publicUrl = await uploadEventImage(selectedFile, formData.id || '1');
      updatedImage = publicUrl;
    }

    await updateUpcomingEvent(
      formData.title || '',
      formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : null,
      formData.brief || '',
      formData.location || '',
      updatedImage || '',
      formData.open || false,
      editingEvent.id
    );

    setData(prev => prev.map(item => item.id === editingEvent.id ? { ...item, ...formData, picture: updatedImage } : item));
    setIsEditModalOpen(false);
    setEditingEvent(null);
    setSelectedFile(null);
    setPreviewSrc(null);
  };

  const toggleOpen = async (id: string) => {
    const supabase = await getSupabaseAdmin();
    const event = data.find(e => e.id === id);
    if (!event) return;

    const newOpen = !event.open;
    const { error } = await supabase
      .from('upcoming')
      .update({ open: newOpen })
      .eq('id', id);

    if (error) {
      console.error('Toggle open error:', error);
      return;
    }

    setData(prev => prev.map(item => item.id === id ? { ...item, open: newOpen } : item));
  };

  const clearEventHandler = async (id: string) => {
    await clearEvent(id);
    setData(prev => prev.map(item => item.id === id ? { ...item, title: '', date: null, brief: '', location: '', picture: '', open: false } : item));
  };

  const columns = getColumns(openEditModal, toggleOpen, clearEventHandler);

  return (
    <>
      <DataTable columns={columns} data={data} onReload={fetchData} actions={actions(toggleOpen, clearEventHandler)} />
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Upcoming Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Event Name"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              type="date"
              value={formData.date ? formData.date.toISOString().split('T')[0] : ""}
              onChange={(e) => setFormData({ ...formData, date: e.target.value ? new Date(e.target.value) : null })}
            />
            <Input
              placeholder="Location"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <textarea
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-slate-700 focus:border-slate-500"
              placeholder="Brief"
              rows={4}
              value={formData.brief || ""}
              onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
            />
            <select
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-slate-700 focus:border-slate-500"
              value={formData.open ? "Yes" : "No"}
              onChange={(e) => setFormData({ ...formData, open: e.target.value === "Yes" })}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <div className="center ">
              <ImageUpload
                src={previewSrc || formData.picture}
                onRemove={() => { setFormData({ ...formData, picture: null }); setSelectedFile(null); setPreviewSrc(null); }}
                onFileSelect={async (file) => {
                  if (!file) return setSelectedFile(null), setPreviewSrc(null);
                  const compressed = await compressToAvif(file);
                  setSelectedFile(compressed);
                  setPreviewSrc(URL.createObjectURL(compressed));
                }}
              />
            </div>
          </div>
          <DialogFooter className="center w-full">
            <Button variant="outline" className="click w-1/2" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="secondary" className="w-1/2" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}