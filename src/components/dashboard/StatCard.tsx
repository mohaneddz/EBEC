import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  bgColor: string;
}

export default function StatCard({ icon: Icon, title, value, bgColor }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className={`p-2 ${bgColor} rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-primary-dark">{title}</p>
          <p className="text-2xl font-bold text-primary-dark">{value}</p>
        </div>
      </div>
    </div>
  );
}
