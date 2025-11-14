"use client"

import { createClient } from "@/utils/supabase/client"

import Image from "next/image"
import Link from "next/link"

interface User {
	id: string;
	email?: string | undefined | null;
	app_metadata?: {
		display_name?: string;
		role?: string;
		status?: string;
		department?: string;
	};
	user_metadata?: {
		display_name?: string;
		image?: string;
		department?: string;
		status?: string;
		role?: string;
	};
}

import * as React from "react"
import { useEffect, useState } from "react"
import {
  User,
  Mail,
  Calendar,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"

import {
  Sidebar,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  const supabase = createClient();

  const [user, setUser] = useState({
    name: "EBEC",
    email: "ebec@ensia.edu.dz",
    avatar: "/imgs/logo.png",
    id: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          name: authUser.user_metadata?.display_name || "User",
          email: authUser.email || "",
          avatar: authUser.user_metadata?.image || "/imgs/logo.png",
          id: authUser.id,
        });
      }
    };
    fetchUser();
  }, [supabase]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link className="flex items-center gap-4 cursor-pointer" href="/">
            <Image src='/imgs/logo-bw.png' alt='EBEC Logo' width={40} height={40} />
            {state === "expanded" && (
              <span className="text-sm text-primary-light font-bold">EBEC</span>
            )}
          </Link>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
