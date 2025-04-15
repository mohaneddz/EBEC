"use client";

import { Sidebar, SidebarBody, Logo, LogoIcon, SidebarLink } from "@/components/Admin/Sidebar";
import { createContext, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    IconBrandTabler,
    IconMail,
    IconCalendarEvent,
    IconUsersGroup,
    IconAlignBoxCenterTop,
} from "@tabler/icons-react";
import fkAround from "@/config/fkAround";

const PageContext = createContext();

export function usePageContext() {
    return useContext(PageContext);
}

export default function AdminPage({ children }) {

    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState("Members");

    const links = [
        { label: "Dashboard", page: "dashboard", icon: <IconBrandTabler className="w-6 h-6 text-neutral-700" /> },
        { label: "Members", page: "members", icon: <IconUsersGroup className="w-6 h-6 text-neutral-700" /> },
        { label: "Emails", page: "emails", icon: <IconMail className="w-6 h-6 text-neutral-700" /> },
        { label: "Events", page: "events", icon: <IconCalendarEvent className="w-6 h-6 text-neutral-700" /> },
        { label: "Forms", page: "forms", icon: <IconAlignBoxCenterTop className="w-6 h-6 text-neutral-700" /> },
    ];

    useEffect(() => {
        (async () => {
            await fkAround();
            setLoading(false);
        })();
    }, []);

    return (
        <PageContext.Provider value={{ page, setPage }}>
            <>
                {loading && <div className="flex items-center justify-center w-full h-screen bg-gray-100"> Loading...</div>}
                {!loading &&
                    <div className={cn("flex flex-col md:flex-row bg-gray-100 flex-1 border border-neutral-200 h-screen w-full overflow-x-hidden")}>

                        <Sidebar open={open} setOpen={setOpen}>
                            <SidebarBody className="justify-between gap-10">

                                <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
                                    {open ? <Logo /> : <LogoIcon />}
                                    <div className="flex flex-col gap-2 mt-8">
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
                    </div>}
            </>
        </PageContext.Provider>
    );
}
