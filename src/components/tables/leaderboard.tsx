"use client"

import * as React from "react"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, SortingState, getSortedRowModel } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataTableProps<TData extends { department?: string; score?: number }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  department: string
}

export function Leaderboard<TData extends { department?: string; score?: number }, TValue>({ columns, data, department }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  // Only take top 5 members for the specified department or all if "All"
  const topData = React.useMemo(() => {
    const filtered = department === "All" ? data : data.filter((item) => item.department === department)
    return [...filtered].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 5)
  }, [data, department])

  const table = useReactTable({
    data: topData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  })

  return (
    <div className="overflow-hidden rounded-md border overflow-x-auto w-full overflow-y-auto">
      <Table>
        <TableHeader className="bg-primary-dark">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} className="text-secondary-dark font-bold md:text-lg">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="bg-slate-100">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
