"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuSeparator,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image" // Assuming you are in a Next.js environment for Image component
import type { CheckedState } from "@radix-ui/react-checkbox"

export interface Managers {
    user_id: string;
    picture: string;
    name: string;
    department: departments;
    role: 'Co-Manager' | 'Manager' | 'President' | 'Vice President' | 'SA';
}

export const columns: ColumnDef<Managers>[] = [
    {
        id: "select",
        header: ({ table }) => {
            const headerChecked: CheckedState = table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                    ? "indeterminate"
                    : false;
            return (
                <Checkbox
                    checked={headerChecked}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            )
        },
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
                <div className="flex items-center justify-center h-8 w-8 rounded-full overflow-hidden"> {/* Adjusted container size */}
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
        cell: ({ row }) => <div className="w-[100px] truncate">{row.getValue("department")}</div>,
    },
    {
        id: "actions",
        cell: ({  }) => {
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
                            //console.log("View manager details for:", manager.user_id);
                            // Add navigation or modal logic here
                        }}>
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            //console.log("Edit manager for:", manager.user_id);
                            // Add edit form/modal logic here
                        }}>
                            Edit Manager
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                            //console.log("Deactivate manager:", manager.user_id);
                            // Add logic to change status to Inactive
                        }}>
                            Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                            //console.log("Remove manager:", manager.user_id);
                        }}>
                            Remove Manager
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]