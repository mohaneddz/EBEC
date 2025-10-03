import React from 'react';
import { Button } from '@/components/ui/button';

export default function QuickActions() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md my-8">
      <h2 className="text-xl font-semibold text-primary-dark mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <Button className="bg-primary-light text-white hover:bg-primary-dark">Add Member</Button>
        <Button className="bg-secondary-light text-black hover:bg-secondary-dark">Create Event</Button>
        <Button className="bg-primary-dark text-white hover:bg-primary-light">View Reports</Button>
      </div>
    </div>
  );
}
