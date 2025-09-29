"use client"

import React from "react"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table" // Assuming you use shadcn/ui

// Define a generic type for our data that must include a 'score' property
interface ScorableData {
    score: number;
    [key: string]: any; // Allows for any other properties
}

// Props for our new, more reusable component
interface LeaderboardTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    topCount?: number // Optional: how many top items to show
    noResultsMessage?: string // Optional: message to show when data is empty
}

/**
 * A reusable table component to display the top N items from a list of data,
 * sorted by a 'score' property in descending order.
 */
export function LeaderboardTable<TData extends ScorableData, TValue>({
    columns,
    data,
    topCount = 5, // Default to showing the top 5
    noResultsMessage = "No members found.", // A more specific default message
}: LeaderboardTableProps<TData, TValue>) {

    // 1. Sort the data by score in descending order.
    // 2. Limit the result to the specified topCount.
    // We use React.useMemo to avoid re-calculating this on every render.
    const topSortedData = React.useMemo(() => {
        return data
            .sort((a, b) => b.score - a.score)
            .slice(0, topCount);
    }, [data, topCount]); // Dependency array includes topCount now

    const table = useReactTable({
        data: topSortedData, // Use the processed data
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="font-semibold text-gray-600 bg-gray-50">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                {noResultsMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}