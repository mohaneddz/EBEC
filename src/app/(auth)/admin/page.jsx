"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Dashboard from "@/components/Sidebar";
import { usePageContext } from "./layout";

const DashboardPage = dynamic(() => import("@/app/(auth)/admin/_dashboard/page"));
const TeamPage = dynamic(() => import("@/app/(auth)/admin/_team/page"));
const MembersPage = dynamic(() => import("@/app/(auth)/admin/_members/page"));
const EmailsPage = dynamic(() => import("@/app/(auth)/admin/_emails/page"));
const EventsPage = dynamic(() => import("@/app/(auth)/admin/_events/page"));

export default function Page() {
  const { page } = usePageContext();

  const pages = {
    dashboard: DashboardPage,
    team: TeamPage,
    members: MembersPage,
    emails: EmailsPage,
    events: EventsPage,
  };
  const PageComponent = pages[page] || DashboardPage;

  return (

    <Dashboard>
      <div className="w-full h-full">
        <Suspense fallback={<div>Loading...</div>}>
          <PageComponent />
        </Suspense>
      </div>
    </Dashboard>
    
  );
}
