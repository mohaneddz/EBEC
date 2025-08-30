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
import Image from "next/image" // Assuming you are in a Next.js environment for Image component

export interface Managers {
    userId: string;
    picture: string;
    name: string;
    email: string;
    department: 'IT' | 'HR' | 'Multimedia' | 'Design' | 'Relex' | 'Events';
    role: 'Manager' | 'President' | 'Vice President' | 'SA';
    status: 'Active' | 'Inactive';
    assignedAt: Date;
}

export const columns: ColumnDef<Managers>[] = [
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
                            width={32} // Set width to 32
                            height={32} // Set height to 32
                            className="object-cover rounded-full" // Added rounded-full
                            loading="lazy" // Explicitly setting to lazy load, though it's often default for non-priority images
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
            const status = row.getValue("status") as 'Active' | 'Inactive';
            return (
                <div className={`w-[80px] font-medium ${status === 'Active' ? 'text-primary-dark' : 'text-red-600'}`}>
                    {status}
                </div>
            );
        },
    },
    {
        accessorKey: "assignedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Assigned At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const val = row.getValue("assignedAt") as string | Date | undefined;
            const date = typeof val === "string" ? new Date(val) : (val as Date | undefined);
            if (!date || Number.isNaN(date.getTime())) return <div>N/A</div>;
            const formattedDate = new Intl.DateTimeFormat("en-US", {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(date);
            return <div>{formattedDate}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const manager = row.original

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
                            console.log("View manager details for:", manager.userId);
                            // Add navigation or modal logic here
                        }}>
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            console.log("Edit manager for:", manager.userId);
                            // Add edit form/modal logic here
                        }}>
                            Edit Manager
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                            console.log("Deactivate manager:", manager.userId);
                            // Add logic to change status to Inactive
                        }}>
                            Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                            console.log("Remove manager:", manager.userId);
                            // Add logic to remove manager entry
                        }}>
                            Remove Manager
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]