"use client";

import { Users, Calendar, Ticket, Activity, Clock, Shield } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import QuickActions from '@/components/dashboard/QuickActions';
import useDashboard from '@/hooks/useDashboard';
// import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
  const {
    totalMembers,
    eventsCount,
    totalRegistrations,
    activeMembers,
    upcomingEvents,
    totalManagers,
    loading,
  } = useDashboard();

  if (loading) {
    return <div className="min-h-screen p-6 flex items-center justify-center">Loading...</div>;
  }

  return (
    <section className="full mb-8 p-6 flex col flex-1">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-dark">EBEC Club Dashboard</h1>
        <p className="text-primary-dark mt-2">Manage members, events, and club activities here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <StatCard icon={Users} title="Total Members" value={totalMembers} bgColor="bg-primary-light" />
        <StatCard icon={Calendar} title="Events Organized" value={eventsCount} bgColor="bg-primary-light" />
        <StatCard icon={Ticket} title="Events Registrations" value={totalRegistrations} bgColor="bg-primary-light" />
        <StatCard icon={Activity} title="Active Members" value={activeMembers} bgColor="bg-secondary-light" />
        <StatCard icon={Clock} title="Upcoming Events" value={upcomingEvents} bgColor="bg-secondary-light" />
        <StatCard icon={Shield} title="Total Managers" value={totalManagers} bgColor="bg-secondary-light" />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      <div className="center bg-white full flex flex-1 col">
          To be continued...
      </div>

    </section>
  );
}