"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { IconReload } from "@tabler/icons-react"
import { IconDotsVertical } from "@tabler/icons-react"
import { IconFilter } from "@tabler/icons-react"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onReload?: () => void
}

export function DataTable<TData, TValue>({ columns, data, onReload }: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10, }, },
    onSortingChange: setSorting, onColumnFiltersChange: setColumnFilters, onRowSelectionChange: setRowSelection, onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(), getFilteredRowModel: getFilteredRowModel(), globalFilterFn: 'includesString',
    state: { sorting, columnFilters, rowSelection, columnVisibility, },
  })

  return (
    <div className="overflow-hidden rounded-md border overflow-x-auto max-h-[91vh] overflow-y-auto">

      <div className="flex items-center justify-between w-full p-4 pr-0 bg-primary-light mb-4">

        <div className="w-full items-center flex gap-4">

          {/* selection state */}
          <div className="text-white text-sm">
            {table.getFilteredSelectedRowModel().rows.length} /{" "}
            {table.getFilteredRowModel().rows.length}
          </div>
          <Input placeholder="Filter rows..." value={table.getState().globalFilter ?? ''} onChange={(event) => table.setGlobalFilter(String(event.target.value))} className="max-w-lg text-black" />
        </div>

        <div className="center gap-2 mx-4">
          {/* reload button */}
          {onReload && (
            <Button variant="classic" size="sm" onClick={onReload} className="bg-white font-semibold">
              <IconReload />
              Reload
            </Button>
          )}

          {/* quick actions */}
          <DropdownMenu>

            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="bg-secondary-light font-semibold">
                <IconDotsVertical />
                Actions
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => table.resetColumnFilters()}>Reset Filters</DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.resetColumnFilters()}>Accept Selected</DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.resetColumnFilters()}>Reject Selected</DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.resetColumnFilters()}>Delete Selection</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="ml-auto font-semibold">
                <IconFilter />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>

      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <hr />
      <div className="flex items-center justify-end space-x-2 py-4 mr-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
      </div>
    </div>
  )
}