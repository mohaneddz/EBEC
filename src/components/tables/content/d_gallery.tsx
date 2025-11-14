"use client"

import Image from "next/image"

import { useState, useEffect, useCallback, useRef } from "react"
import { DataTable } from "@/components/tables/data-table"
import { actions, getColumns, Gallery } from "@/components/tables/columns/c_gallery"
import { getSupabaseAdmin } from "@/utils/supabase/admin";

import { uploadEventImage } from "@/server/gallery";
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
import { X, Image as ImgIcon } from 'lucide-react'

interface DBEvent {
  id: string;
  name: string;
  date: string;
  brief: string;
  description: string;
  attendance: number;
  location: string;
  pictures: string[];
}

const ImageUpload = ({ src, onRemove, onFileSelect }: { src: string | null; onRemove: () => void; onFileSelect: (file: File | null) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-20 h-20 border border-gray-300 rounded overflow-hidden group bg-slate-300">
      {src && <Image src={src} alt="" className="w-full h-full object-cover" />}

      {/* Overlay only on hover */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity flex items-center justify-center">
        <X className="text-white cursor-pointer mr-2" onClick={onRemove} />
        <ImgIcon className="text-white cursor-pointer" onClick={() => fileInputRef.current?.click()} />
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

export default function GalleryTable() {
  const [data, setData] = useState<Gallery[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Gallery | null>(null);
  const [formData, setFormData] = useState<Partial<Gallery>>({});
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});

  const fetchData = useCallback(async () => {
    const supabase = await getSupabaseAdmin();
    const { data: galleryData, error } = await supabase
      .from('events')
      .select('*');

    if (error) {
      console.error("Error fetching managers:", error);
      return;
    }

    const formattedData = await Promise.all(galleryData.map(async (item: DBEvent) => ({
      id: item.id,
      name: item.name,
      date: new Date(item.date),
      brief: item.brief,
      description: item.description,
      attendance: item.attendance,
      location: item.location,
      picture1: item.pictures[0] || null,
      picture2: item.pictures[1] || null,
      picture3: item.pictures[2] || null,
      picture4: item.pictures[3] || null
    })));

    setData(formattedData);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openEditModal = (event: Gallery) => {
    setEditingEvent(event);
    setFormData(event);
    setSelectedFiles({});
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingEvent) return;

    const supabase = await getSupabaseAdmin();

    // Upload selected files and get URLs using editingEvent.id
    const updatedPictures: Partial<Gallery> = { ...formData };
    for (const key of ['picture1', 'picture2', 'picture3', 'picture4']) {
      if (selectedFiles[key]) {
        const number = parseInt(key.slice(-1));
        const publicUrl = await uploadEventImage(selectedFiles[key]!, editingEvent.id, number);
        (updatedPictures as Record<string, string | null>)[key] = publicUrl;
      }
    }

    // Update database
    const { error: updateError } = await supabase
      .from('events')
      .update({
        name: updatedPictures.name,
        date: updatedPictures.date,
        brief: updatedPictures.brief,
        description: updatedPictures.description,
        attendance: updatedPictures.attendance,
        location: updatedPictures.location,
        pictures: [
          updatedPictures.picture1,
          updatedPictures.picture2,
          updatedPictures.picture3,
          updatedPictures.picture4
        ].filter(Boolean)
      })
      .eq('id', editingEvent.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return;
    }

    // Update local state
    setData(prev => prev.map(item => item.id === editingEvent.id ? { ...item, ...updatedPictures } : item));
    setIsEditModalOpen(false);
    setEditingEvent(null);
    setSelectedFiles({});
  };

  const columns = getColumns(openEditModal);

  return (
    <>
      <DataTable columns={columns} data={data} onReload={fetchData} actions={actions} />
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              type="date"
              value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ""}
              onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
            />
            <Input
              placeholder="Location"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Attendance"
              value={formData.attendance || ""}
              onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
            />
            <textarea
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-slate-700 focus:border-slate-500"
              placeholder="Brief"
              rows={2}
              value={formData.brief || ""}
              onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
            />
            <textarea
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-slate-700 focus:border-slate-500"
              placeholder="Description"
              rows={8}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="gap-4 center">
              <ImageUpload
                src={selectedFiles.picture1 ? URL.createObjectURL(selectedFiles.picture1) : formData.picture1}
                onRemove={() => { setFormData({ ...formData, picture1: null }); setSelectedFiles({ ...selectedFiles, picture1: null }); }}
                onFileSelect={async (file) => {
                  if (!file) return setSelectedFiles({ ...selectedFiles, picture1: null });
                  const compressed = await compressToAvif(file);
                  setSelectedFiles({ ...selectedFiles, picture1: compressed });
                }}
              />
              <ImageUpload
                src={selectedFiles.picture2 ? URL.createObjectURL(selectedFiles.picture2) : formData.picture2}
                onRemove={() => { setFormData({ ...formData, picture2: null }); setSelectedFiles({ ...selectedFiles, picture2: null }); }}
                onFileSelect={async (file) => {
                  if (!file) return setSelectedFiles({ ...selectedFiles, picture2: null });
                  const compressed = await compressToAvif(file);
                  setSelectedFiles({ ...selectedFiles, picture2: compressed });
                }}
              />
              <ImageUpload
                src={selectedFiles.picture3 ? URL.createObjectURL(selectedFiles.picture3) : formData.picture3}
                onRemove={() => { setFormData({ ...formData, picture3: null }); setSelectedFiles({ ...selectedFiles, picture3: null }); }}
                onFileSelect={async (file) => {
                  if (!file) return setSelectedFiles({ ...selectedFiles, picture3: null });
                  const compressed = await compressToAvif(file);
                  setSelectedFiles({ ...selectedFiles, picture3: compressed });
                }}
              />
              <ImageUpload
                src={selectedFiles.picture4 ? URL.createObjectURL(selectedFiles.picture4) : formData.picture4}
                onRemove={() => { setFormData({ ...formData, picture4: null }); setSelectedFiles({ ...selectedFiles, picture4: null }); }}
                onFileSelect={async (file) => {
                  if (!file) return setSelectedFiles({ ...selectedFiles, picture4: null });
                  const compressed = await compressToAvif(file);
                  setSelectedFiles({ ...selectedFiles, picture4: compressed });
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
