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

export interface Issues {
    user_id: string;
    email: string;
    name: string;
    department: departments;
    issue: string;
    createdAt: Date;
    status: 'open' | 'in_progress' | 'resolved';
}

export function getColumns(onViewDetails: (issue: Issues) => void): ColumnDef<Issues>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                            ? true
                            : table.getIsSomePageRowsSelected()
                            ? "indeterminate"
                            : false
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
            cell: ({ row }) => <div className="w-40 truncate">{row.getValue("email")}</div>,
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
            accessorKey: "department",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Department
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue("department")}</div>,
        },
        {
            accessorKey: "issue",
            header: "Issue",
            cell: ({ row }) => <div className="max-w-[250px] truncate">{row.getValue("issue")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Reported At
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
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const status = row.getValue("status") as 'open' | 'in_progress' | 'resolved' | undefined;
                if (!status) return <div>N/A</div>;
                const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
                return <div className="w-[100px]">{formattedStatus}</div>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const issue = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewDetails(issue)}>
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                //console.log("Mark issue as in progress for:", issue.user_id);
                                // Add logic to update status
                            }}>
                                Mark In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => {
                                //console.log("Delete issue for:", issue.user_id);
                                // Add logic to handle issue deletion
                            }}>
                                Delete Issue
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];
}