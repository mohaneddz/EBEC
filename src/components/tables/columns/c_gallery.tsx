"use client"

import { deleteEvent } from "@/server/events"

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
import type { CheckedState } from "@radix-ui/react-checkbox"

export interface Gallery {

    id: string;
    name: string;
    date: Date;
    brief: string;

    location: string;
    attendance: number;
    description: string;

    picture1: string;
    picture2: string;
    picture3: string;
    picture4: string;
}

export const getColumns = (openEditModal: (event: Gallery) => void): ColumnDef<Gallery>[] => [
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
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="w-28"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Event Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="w-28 ">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="w-16"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Event Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const val = row.getValue("date") as string | Date | undefined;
            const date = typeof val === "string" ? new Date(val) : (val as Date | undefined);
            if (!date || Number.isNaN(date.getTime())) return <div>N/A</div>;
            const formattedDate = new Intl.DateTimeFormat("en-US", {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(date);
            return <div className="w-16">{formattedDate}</div>;
        },
    },
    {
        accessorKey: "location",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="w-24"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Location
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="w-24 truncate">{row.getValue("location")}</div>,
    },
    {
        accessorKey: "attendance",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="w-16"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Attendance
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const attendance = row.getValue("attendance") as number | undefined;
            return <div className="text-right w-16">{attendance != null ? attendance.toLocaleString() : 'N/A'}</div>;
        },
    },
    {
        accessorKey: "brief",
        header: "Brief",
        cell: ({ row }) => <div className="w-24 truncate">{row.getValue("brief")}</div>,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <div className="w-24 truncate">{row.getValue("description")}</div>,
    },
    {
        accessorKey: "picture1",
        header: "Preview",
        cell: ({ row }) => {
            const imageUrl = row.getValue("picture1") as string;
            return (
                <div className="relative flex items-center justify-center h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Event Preview"
                            fill
                            className="object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <span className="text-xs text-gray-500">No Image</span>
                    )}
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "picture2",
        header: "Preview",
        cell: ({ row }) => {
            const imageUrl = row.getValue("picture2") as string;
            return (
                <div className="relative flex items-center justify-center h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Event Preview"
                            fill
                            className="object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <span className="text-xs text-gray-500">No Image</span>
                    )}
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "picture3",
        header: "Preview",
        cell: ({ row }) => {
            const imageUrl = row.getValue("picture3") as string;
            return (
                <div className="relative flex items-center justify-center h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Event Preview"
                            fill
                            className="object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <span className="text-xs text-gray-500">No Image</span>
                    )}
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "picture4",
        header: "Preview",
        cell: ({ row }) => {
            const imageUrl = row.getValue("picture4") as string;
            return (
                <div className="relative flex items-center justify-center h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Event Preview"
                            fill
                            className="object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <span className="text-xs text-gray-500">No Image</span>
                    )}
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const event = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(event)}>
                            Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                            deleteEvent(event.id);
                        }}>
                            Delete Event
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export const actions = [
    {
        title: "Delete Selected",
        action: (selectedRows: Gallery[]) => {
            selectedRows.forEach(row => deleteEvent(row.id));
        },
    }
]