"use client"

import { switchDepartment, deleteDepartmentSwitch } from "@/app/actions"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export interface DepartmentSwitch {
    user_id: string;
    email: string;
    name: string;
    picture?: string;
    old_department: string;
    new_department: string;
    motivation: string;
    created_at: Date;
}

export const getColumns = (removeRow: (userId: string) => void): ColumnDef<DepartmentSwitch>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 30,
    },
    {
        accessorKey: "picture",
        header: "Picture",
        cell: ({ row }) => {
            const pic = row.getValue("picture") as string | undefined;
            return (
                <div className="flex justify-center items-center min-w-[40px]">
                    {pic ? (
                        <Image
                            src={pic}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300" />
                    )}
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="px-2"
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const email = row.getValue("email") as string;
            const display = email.length > 30 ? email.slice(0, 30) + "…" : email;
            return <div className="truncate min-w-[100px]">{display}</div>;
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="truncate min-w-[100px]">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "old_department",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Old Dept.
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="truncate min-w-[80px]">{row.getValue("old_department")}</div>,
    },
    {
        accessorKey: "new_department",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                New Dept.
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="truncate min-w-[80px]">{row.getValue("new_department")}</div>,
    },
    {
        accessorKey: "motivation",
        header: "Motivation",
        cell: ({ row }) => <div className="truncate min-w-[120px]">{row.getValue("motivation")}</div>,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Requested At
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const val = row.getValue("created_at") as string | Date | undefined;
            const date = typeof val === "string" ? new Date(val) : (val as Date | undefined);
            if (!date || Number.isNaN(date.getTime())) return <div>N/A</div>;
            const formattedDate = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(date);
            return <div className="min-w-[140px]">{formattedDate}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const departmentSwitch = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-green-600" onClick={() => approveSwitch(departmentSwitch.user_id, departmentSwitch.new_department, removeRow)}>
                            Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => RejectSwitch(departmentSwitch.user_id, removeRow)}>
                            Reject
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]

async function approveSwitch(userId: string, newDepartment: string, removeRow: (userId: string) => void) {
    await switchDepartment(userId, newDepartment);
    await deleteDepartmentSwitch(userId);
    removeRow(userId);
}

async function RejectSwitch(userId: string, removeRow: (userId: string) => void) {
    await deleteDepartmentSwitch(userId);
    removeRow(userId);
}