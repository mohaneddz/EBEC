"use client";

import { Sidebar, SidebarBody, Logo, LogoIcon, SidebarLink } from "@/components/Sidebar";
import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import {
    IconBrandTabler,
    IconMail,
    IconCalendarEvent,
    IconUsersGroup,
    IconUserUp,
} from "@tabler/icons-react";

const PageContext = createContext();

export function usePageContext() {
    return useContext(PageContext);
}

export default function AdminPage({ children }) {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState("events");

    const links = [
        { label: "Dashboard", page: "dashboard", icon: <IconBrandTabler className="text-neutral-700 h-5 w-5" /> },
        { label: "Team", page: "team", icon: <IconUserUp className="text-neutral-700 h-5 w-5" /> },
        { label: "Members", page: "members", icon: <IconUsersGroup className="text-neutral-700 h-5 w-5" /> },
        { label: "Emails", page: "emails", icon: <IconMail className="text-neutral-700 h-5 w-5" /> },
        { label: "Events", page: "events", icon: <IconCalendarEvent className="text-neutral-700 h-5 w-5" /> }
    ];

    return (
        <PageContext.Provider value={{ page, setPage }}>

            <div className={cn("flex flex-col md:flex-row bg-gray-100 flex-1 border border-neutral-200 h-screen w-full")}>

                <Sidebar open={open} setOpen={setOpen}>
                    <SidebarBody className="justify-between gap-10">

                        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                            {open ? <Logo /> : <LogoIcon />}
                            <div className="mt-8 flex flex-col gap-2">
                                {links.map((link, idx) => (
                                    <SidebarLink
                                        key={idx}
                                        link={link}
                                        onClick={() => setPage(link.page)}
                                    />
                                ))}
                            </div>
                        </div>
                    
                    </SidebarBody>
                </Sidebar>
                {children}
            </div>

        </PageContext.Provider>
    );
}
