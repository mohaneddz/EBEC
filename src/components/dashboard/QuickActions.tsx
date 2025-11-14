import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming Select components are available
import { compressToAvif } from "@/utils/convertion";
import { X, Image as ImgIcon } from 'lucide-react';

import Image from 'next/image';
import useQuickActions from '@/hooks/useQuickActions';

const ImageUpload = ({ src, onRemove, onFileSelect }: { src: string | null; onRemove: () => void; onFileSelect: (file: File | null) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-20 h-20 border border-gray-300 rounded overflow-hidden group bg-slate-300">
      {src && <Image src={src} alt="" className="w-full h-full object-cover" fill />}

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

export default function QuickActions() {
  const {
    // Add Manager
    isAddManagerModalOpen,
    setIsAddManagerModalOpen,
    managerFullName,
    setManagerFullName,
    managerDepartment,
    setManagerDepartment,
    managerRole,
    setManagerRole,
    setManagerPicture,
    managerPicturePreview,
    setManagerPicturePreview,
    handleAddManager,
    // Create Event
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
    eventTitle,
    setEventTitle,
    eventDescription,
    setEventDescription,
    eventDate,
    setEventDate,
    eventLocation,
    setEventLocation,
    eventBrief,
    setEventBrief,
    eventAttendance,
    setEventAttendance,
    selectedFiles,
    setSelectedFiles,
    previews,
    setPreviews,
    handleCreateEvent,
  } = useQuickActions();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md my-8">
      <h2 className="text-xl font-semibold text-primary-dark mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <Button className="bg-primary-light hover:bg-primary-dark" onClick={() => setIsAddManagerModalOpen(true)}>Add Manager</Button>
        <Button className="bg-secondary-light hover:bg-secondary-dark" onClick={() => setIsCreateEventModalOpen(true)}>Create Event</Button>
      </div>

      <Dialog open={isAddManagerModalOpen} onOpenChange={setIsAddManagerModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Manager</DialogTitle>
            <DialogDescription>
              Enter the details of the user to add as Manager.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manager-full-name" className="text-right">
                Full Name
              </Label>
              <Input
                id="manager-full-name"
                value={managerFullName}
                onChange={(e) => setManagerFullName(e.target.value)}
                className="col-span-3"
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manager-department" className="text-right">
                Department
              </Label>
              <Select value={managerDepartment} onValueChange={(value) => setManagerDepartment(value as departments)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Relex">Relex</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manager-role" className="text-right">
                Role
              </Label>
              <Select value={managerRole} onValueChange={setManagerRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="President">President</SelectItem>
                  <SelectItem value="Vice-President">Vice-President</SelectItem>
                  <SelectItem value="Co-Manager">Co-Manager</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Picture
              </Label>
              <ImageUpload
                src={managerPicturePreview}
                onRemove={() => { setManagerPicture(null); setManagerPicturePreview(null); }}
                onFileSelect={async (file) => {
                  if (!file) return setManagerPicture(null), setManagerPicturePreview(null);
                  const compressed = await compressToAvif(file);
                  setManagerPicture(compressed);
                  setManagerPicturePreview(URL.createObjectURL(compressed));
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddManagerModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddManager}>Add Manager</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateEventModalOpen} onOpenChange={setIsCreateEventModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <Input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
            <Input
              placeholder="Location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Attendance"
              value={eventAttendance}
              onChange={(e) => setEventAttendance(Number(e.target.value))}
            />
            <textarea
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-slate-700 focus:border-slate-500"
              placeholder="Brief"
              rows={2}
              value={eventBrief}
              onChange={(e) => setEventBrief(e.target.value)}
            />
            <textarea
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-slate-700 focus:border-slate-500"
              placeholder="Description"
              rows={8}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <div className="gap-4 center">
              <ImageUpload
                src={previews.picture1}
                onRemove={() => { setSelectedFiles({ ...selectedFiles, picture1: null }); setPreviews({ ...previews, picture1: null }); }}
                onFileSelect={async (file) => {
                  if (!file) return setSelectedFiles({ ...selectedFiles, picture1: null }), setPreviews({ ...previews, picture1: null });
                  const compressed = await compressToAvif(file);
                  setSelectedFiles({ ...selectedFiles, picture1: compressed });
                  setPreviews({ ...previews, picture1: URL.createObjectURL(compressed) });
                }}
              />
              <ImageUpload
                src={previews.picture2}
                onRemove={() => { setSelectedFiles({ ...selectedFiles, picture2: null }); setPreviews({ ...previews, picture2: null }); }}
                onFileSelect={async (file) => {
                  if (!file) return setSelectedFiles({ ...selectedFiles, picture2: null }), setPreviews({ ...previews, picture2: null });
                  const compressed = await compressToAvif(file);
                  setSelectedFiles({ ...selectedFiles, picture2: compressed });
                  setPreviews({ ...previews, picture2: URL.createObjectURL(compressed) });
                }}
              />
              <ImageUpload
                src={previews.picture3}
                onRemove={() => { setSelectedFiles({ ...selectedFiles, picture3: null }); setPreviews({ ...previews, picture3: null }); }}
                onFileSelect={async (file) => {
                  if (!file) return setSelectedFiles({ ...selectedFiles, picture3: null }), setPreviews({ ...previews, picture3: null });
                  const compressed = await compressToAvif(file);
                  setSelectedFiles({ ...selectedFiles, picture3: compressed });
                  setPreviews({ ...previews, picture3: URL.createObjectURL(compressed) });
                }}
              />
              <ImageUpload
                src={previews.picture4}
                onRemove={() => { setSelectedFiles({ ...selectedFiles, picture4: null }); setPreviews({ ...previews, picture4: null }); }}
                onFileSelect={async (file) => {
                  if (!file) return setSelectedFiles({ ...selectedFiles, picture4: null }), setPreviews({ ...previews, picture4: null });
                  const compressed = await compressToAvif(file);
                  setSelectedFiles({ ...selectedFiles, picture4: compressed });
                  setPreviews({ ...previews, picture4: URL.createObjectURL(compressed) });
                }}
              />
            </div>
          </div>
          <DialogFooter className="flex w-full">
            <Button variant="outline" className="w-1/2" onClick={() => setIsCreateEventModalOpen(false)}>Cancel</Button>
            <Button variant="secondary" className="w-1/2" onClick={handleCreateEvent}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
