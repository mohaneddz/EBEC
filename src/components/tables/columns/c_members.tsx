"use client"

import Image from "next/image"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

import { deleteUser } from "@/server/users"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Members {
    user_id: string;
    picture: string;
    name: string;
    email: string;
    department: departments;
    status: 'Active' | 'Inactive';
    score: number;
    role: string;
    created_at: Date;
}

export function getColumns(onDelete: (user: Members) => void, onPromote: (user: Members) => void, onChangeDepartment: (user: Members) => void): ColumnDef<Members>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false
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
            accessorKey: "picture",
            header: "Picture",
            cell: ({ row }) => {
                const pictureUrl = row.getValue("picture") as string;
                return (
                    <div className="flex items-center justify-center h-8 w-8 rounded-full overflow-hidden">
                        {pictureUrl ? (
                            <Image
                                src={pictureUrl}
                                alt="Profile"
                                width={32}
                                height={32}
                                className="object-cover rounded-full"
                                loading="lazy"
                            />
                        ) : (
                            <div className="bg-gray-200 text-gray-600 flex items-center justify-center h-full w-full rounded-full text-xs">
                                N/A
                            </div>
                        )}
                    </div>
                );
            },
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
            accessorKey: "role",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Role
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="w-[120px] truncate">{row.getValue("role")}</div>,
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
            }
        },
        {
            accessorKey: "score",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Score
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            }
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Signed Up At
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const val = row.getValue("created_at") as string | Date | undefined;
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
                const user = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(user)}>
                                Delete User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onPromote(user)}>
                                Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onChangeDepartment(user)}>
                                Change Department
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];
}

export const actions = [
    {
        title: "Delete Selection",
        action: (selectedRows: Members[], onReload: () => void) => {
            selectedRows.forEach((user) => {
                deleteUser(user.user_id);
                
            })
        }
    },
]