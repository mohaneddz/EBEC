"use client"

import Image from "next/image"
import Link from "next/link"

import * as React from "react"
import {
  User,
  Mail,
  Calendar,
  ClipboardType,
  ClipboardPen
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavTools } from "./nav-tools"

// This is sample data.
const data = {
  user: {
    name: "EBEC",
    email: "ebec@ensia.edu.dz",
    avatar: "/imgs/logo.png",
  },
  navMain: [
    {
      title: "Emails",
      url: "#",
      icon: Mail,
      isActive: true,
      items: [
        {
          title: "SignUps",
          url: "/dashboard/emails/signups",
        },
        {
          title: "Departments",
          url: "/dashboard/emails/departments",
        },
        {
          title: "Issues",
          url: "/dashboard/emails/issues",
        },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: User,
      isActive: true,
      items: [
        {
          title: "Members",
          url: "/dashboard/users/members",
        },
        {
          title: "Managers",
          url: "/dashboard/users/managers",
        },
      ],
    },
    {
      title: "Events",
      url: "#",
      icon: Calendar,
      isActive: true,
      items: [
        {
          title: "Gallery",
          url: "/dashboard/events/gallery",
        },
        {
          title: "Upcoming",
          url: "/dashboard/events/upcoming",
        },
      ],
    },
    {
      title: "Forms",
      url: "#",
      icon: ClipboardType,
      isActive: true,
      items: [
        {
          title: "Forms",
          url: "/dashboard/forms/archive",
        },
        {
          title: "Submissions",
          url: "/dashboard/forms/submissions",
        },
      ],
    },
  ],
  tools: [
    {
      name: "Form Creator",
      url: "/dashboard/tools/form_creator",
      icon: ClipboardPen,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link className="flex items-center gap-4 cursor-pointer" href="/">
          <Image src='/imgs/logo.png' alt='EBEC Logo' width={40} height={40} />
          {state === "expanded" && (
            <span className="text-sm text-secondary-light font-bold">EBEC</span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavTools tools={data.tools} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
