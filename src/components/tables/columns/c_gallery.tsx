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
import Image from "next/image" 

export interface Gallery {
    eventId: string;
    eventName: string;
    eventDate: Date;
    eventLocation: string;
    eventAttendance: number;
    eventBrief: string;
    eventDescription: string;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
}

export const columns: ColumnDef<Gallery>[] = [
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
        accessorKey: "eventName",
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
        cell: ({ row }) => <div className="w-28 ">{row.getValue("eventName")}</div>,
    },
    {
        accessorKey: "eventDate",
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
            const val = row.getValue("eventDate") as string | Date | undefined;
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
        accessorKey: "eventLocation",
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
        cell: ({ row }) => <div className="w-24 truncate">{row.getValue("eventLocation")}</div>,
    },
    {
        accessorKey: "eventAttendance",
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
            const attendance = row.getValue("eventAttendance") as number | undefined;
            return <div className="text-right w-16">{attendance != null ? attendance.toLocaleString() : 'N/A'}</div>;
        },
    },
    {
        accessorKey: "eventBrief",
        header: "Brief",
        cell: ({ row }) => <div className="w-24 truncate">{row.getValue("eventBrief")}</div>,
    },
    {
        accessorKey: "eventDescription",
        header: "Description",
        cell: ({ row }) => <div className="w-24 truncate">{row.getValue("eventDescription")}</div>,
    },
    {
        accessorKey: "image1",
        header: "Preview",
        cell: ({ row }) => {
            const imageUrl = row.getValue("image1") as string;
            return (
                <div className="flex items-center justify-center h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Event Preview"
                            width={40}
                            height={40}
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
        accessorKey: "image2",
        header: "Preview",
        cell: ({ row }) => {
            const imageUrl = row.getValue("image2") as string;
            return (
                <div className="flex items-center justify-center h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Event Preview"
                            width={40}
                            height={40}
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
        accessorKey: "image3",
        header: "Preview",
        cell: ({ row }) => {
            const imageUrl = row.getValue("image3") as string;
            return (
                <div className="flex items-center justify-center h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Event Preview"
                            width={40}
                            height={40}
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
        accessorKey: "image4",
        header: "Preview",
        cell: ({ row }) => {
            const imageUrl = row.getValue("image4") as string;
            return (
                <div className="flex items-center justify-center h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Event Preview"
                            width={40}
                            height={40}
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
            const event = row.original

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
                            console.log("View event details for:", event.eventId);
                            // Implement navigation or a modal to show all event details, including all images
                        }}>
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            console.log("Edit event:", event.eventId);
                            // Implement navigation or a modal for editing
                        }}>
                            Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                            console.log("Delete event:", event.eventId);
                            // Implement delete logic, possibly with a confirmation dialog
                        }}>
                            Delete Event
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]