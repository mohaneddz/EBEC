"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Dashboard from "@/components/Admin/Sidebar";
import { usePageContext } from "./layout";

const DashboardPage = dynamic(() => import("@/app/(auth)/admin/_dashboard/page"));
const MembersPage = dynamic(() => import("@/app/(auth)/admin/_members/page"));
const EmailsPage = dynamic(() => import("@/app/(auth)/admin/_emails/page"));
const EventsPage = dynamic(() => import("@/app/(auth)/admin/_events/page"));

export default function Page() {
  const { page } = usePageContext();

  const pages = {
    dashboard: DashboardPage,
    members: MembersPage,
    emails: EmailsPage,
    events: EventsPage,
  };
  const PageComponent = pages[page] || DashboardPage;

  return (

    <Dashboard>
      <div className="w-full h-full">
        <Suspense fallback={<div className="w-full h-full flex flex-col items-center justify-center text-center text-gray-600">Loading...</div>}>
          <PageComponent />
        </Suspense>
      </div>
    </Dashboard>
    
  );
}
