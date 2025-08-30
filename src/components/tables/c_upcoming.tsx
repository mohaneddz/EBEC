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

export interface Upcoming {
    eventId: string;
    eventName?: string;
    eventDate?: Date;
    eventLocation?: string;
    eventImage?: string;
    eventBrief?: string;
    shown: boolean;
}

export const columns: ColumnDef<Upcoming>[] = [
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
        accessorKey: "eventId",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Event ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="w-[80px] truncate">{String(row.getValue("eventId") ?? "")}</div>,
    },
    {
        accessorKey: "eventName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Event Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue("eventName") || "N/A"}</div>,
    },
    {
        accessorKey: "eventDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
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
            return <div>{formattedDate}</div>;
        },
    },
    {
        accessorKey: "eventLocation",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Location
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="max-w-[120px] truncate">{row.getValue("eventLocation") || "N/A"}</div>,
    },
    {
        accessorKey: "eventImage",
        header: "Preview",
        cell: ({ row }) => {
            const imageUrl = row.getValue("eventImage") as string;
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
        accessorKey: "eventBrief",
        header: "Brief",
        cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("eventBrief") || "N/A"}</div>,
    },
    {
        accessorKey: "shown",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Shown
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const isShown = row.getValue("shown") as boolean;
            return (
                <div className={`w-[60px] font-medium ${isShown ? 'text-green-600' : 'text-orange-600'}`}>
                    {isShown ? 'Yes' : 'No'}
                </div>
            );
        },
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
                            console.log("View upcoming event details for:", event.eventId);
                            // Add navigation or modal logic here
                        }}>
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            console.log("Edit upcoming event:", event.eventId);
                            // Add edit form/modal logic here
                        }}>
                            Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                            console.log(`Toggle visibility for event ${event.eventId}: currently ${event.shown ? 'shown' : 'hidden'}`);
                            // Add logic to toggle 'shown' status
                        }}>
                            {event.shown ? 'Hide Event' : 'Show Event'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                            console.log("Delete upcoming event:", event.eventId);
                            // Add logic to handle deletion
                        }}>
                            Delete Event
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]