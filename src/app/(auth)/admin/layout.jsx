"use client";

import { useState } from "react";
import { Sidebar, SidebarBody, Dashboard, Logo, LogoIcon, SidebarLink } from "@/components/Sidebar"
import { cn } from "@/lib/utils";

import {
    IconBrandTabler,
    IconMail,
    IconCalendarEvent,
    IconUsersGroup,
    IconUserUp,
} from "@tabler/icons-react";


export default function AdminLayout({ children, dashboard, team, members, emails, events }) {

    const [open, setOpen] = useState(false);

    const [DashboardState, setDashboardState] = useState(false);
    const [teamState, setTeamState] = useState(false);
    const [membersState, setMembersState] = useState(false);
    const [emailsState, setEmailsState] = useState(false);
    const [eventsState, setEventsState] = useState(true);

    const toggleAll = () => {
        setDashboardState(false);
        setTeamState(false);
        setMembersState(false);
        setEmailsState(false); 
        setEventsState(false);
    }

    const toggleDashboard = () => {
        toggleAll();
        setDashboardState(true);
    }

    const toggleTeam = () => {
        toggleAll();
        setTeamState(true);
    }

    const toggleMembers = () => {
        toggleAll();
        setMembersState(true);
    }

    const toggleEmails = () => {
        toggleAll();
        setEmailsState(true);
    }

    const toggleEvents = () => {
        toggleAll();
        setEventsState(true);
    }

    const printStates = () => {
        console.log("DashboardState: " + DashboardState);
        console.log("teamState: " + teamState);
        console.log("membersState: " + membersState);
        console.log("emailsState: " + emailsState);
        console.log("eventsState: " + eventsState);
    }

    const links = [
        {
            label: "Dashboard",
            onClick: () => {
                toggleDashboard();
                printStates();
            }
            , icon: (
                <IconBrandTabler className="text-neutral-700 h-5 w-5 flex-shrink-0" />
            )
        },
        {
            label: "Team",
            onClick: () => {
                toggleTeam();
                printStates();
            }
            , icon: (
                <IconUserUp className="text-neutral-700 h-5 w-5 flex-shrink-0" />
            )
        },
        {
            label: "Members",
            onClick: () => {
                toggleMembers();
                printStates();
            }
            , icon: (
                <IconUsersGroup className="text-neutral-700 h-5 w-5 flex-shrink-0" />
            )
        },
        {
            label: "Emails",
            onClick: () => {
                toggleEmails();
                printStates();
            }
            , icon: (
                <IconCalendarEvent className="text-neutral-700 h-5 w-5 flex-shrink-0" />
            )
        },
        {
            label: "Events",
            onClick: () => {
                toggleEvents();
                printStates();
            }
            , icon: (
                <IconMail className="text-neutral-700 h-5 w-5 flex-shrink-0" />
            )
        }
    ];

    return (

        (<div
            className={cn("flex flex-col md:flex-row bg-gray-100  flex-1 border border-neutral-200  h-screen w-full")}>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} onClick={link.onClick} />
                            ))}
                        </div>
                    </div>
                    <div>
                    </div>
                </SidebarBody>
            </Sidebar>

            <Dashboard>
                {DashboardState && dashboard}
                {teamState && team}
                {membersState && members}
                {emailsState && emails}
                {eventsState && events}
            </Dashboard>
            
        </div>)
    );
}