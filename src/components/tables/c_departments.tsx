"use client"

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

export interface DepartmentSwitch {
    userId: string;
    email: string;
    name: string;
    oldDepartment: string;
    newDepartment: string;
    motivation: string;
    createdAt: Date;
}

export const columns: ColumnDef<DepartmentSwitch>[] = [
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
    },
    {
        accessorKey: "userId",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="w-[80px] truncate">{String(row.getValue("userId") ?? "")}</div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="max-w-[180px] truncate">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "oldDepartment",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Old Dept.
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="w-[100px] truncate">{row.getValue("oldDepartment")}</div>,
    },
    {
        accessorKey: "newDepartment",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    New Dept.
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="w-[100px] truncate">{row.getValue("newDepartment")}</div>,
    },
    {
        accessorKey: "motivation",
        header: "Motivation",
        cell: ({ row }) => <div className="max-w-[250px] truncate">{row.getValue("motivation")}</div>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Requested At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const val = row.getValue("createdAt") as string | Date | undefined;
            const date = typeof val === "string" ? new Date(val) : (val as Date | undefined);
            if (!date || Number.isNaN(date.getTime())) return <div>N/A</div>;
            const formattedDate = new Intl.DateTimeFormat("en-US", {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
            return <div>{formattedDate}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const departmentSwitch = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                            console.log("View department switch request for:", departmentSwitch.userId);
                            // Add navigation or modal logic here
                        }}>
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            console.log("View user profile for:", departmentSwitch.userId);
                            // Add navigation to user profile
                        }}>
                            View User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-green-600" onClick={() => {
                            console.log("Approve department switch for:", departmentSwitch.userId);
                            // Add logic to handle approval
                        }}>
                            Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                            console.log("Reject department switch for:", departmentSwitch.userId);
                            // Add logic to handle rejection
                        }}>
                            Reject
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]