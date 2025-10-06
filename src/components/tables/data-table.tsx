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
  actions?: { title: string; action: (...args: unknown[]) => void }[]
  loading?: boolean
}

export function DataTable<TData, TValue>({ columns, data, onReload, actions, loading }: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20, }, },
    onSortingChange: setSorting, onColumnFiltersChange: setColumnFilters, onRowSelectionChange: setRowSelection, onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(), getFilteredRowModel: getFilteredRowModel(), globalFilterFn: 'includesString',
    state: { sorting, columnFilters, rowSelection, columnVisibility, },
  })

  return (
    <div className="flex flex-col w-full h-[calc(100vh-6rem)] border rounded-md overflow-hidden">

      {/* Top bar */}
      <div className="screen flex items-center justify-between w-full p-4 pr-0 bg-primary-light">
        <div className="w-full flex items-center gap-4">
          {/* Selection count */}
          <div className="text-white md:text-sm text-[0.5rem]">
            {table.getFilteredSelectedRowModel().rows.length} /{" "}
            {table.getFilteredRowModel().rows.length}
          </div>

          {/* Global filter */}
          <Input
            placeholder="Filter rows..."
            value={table.getState().globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            className="max-w-lg text-black"
          />
        </div>

        {/* Actions */}
        <div className="items-center gap-2 mx-4 hidden md:flex">
          {onReload && (
            <Button
              variant="classic"
              size="sm"
              onClick={onReload}
              className="bg-white font-semibold"
            >
              <IconReload />
              Reload
            </Button>
          )}

          {/* Quick actions */}
          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-secondary-light font-semibold"
                >
                  <IconDotsVertical />
                  Actions
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                {actions.map((act, index) => (
                  <DropdownMenuItem key={index} onClick={() => act.action(table.getFilteredSelectedRowModel().rows.map(row => row.original), onReload || (() => {}))}>
                    {act.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Column visibility */}
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
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(val) => col.toggleVisibility(!!val)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table container */}
      <div className="flex-1 overflow-auto">
        <Table className="min-w-full h-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="h-full border-b">
            {loading ? (
              <TableRow className="h-full">
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-lg h-[calc(100vh-14rem)] align-middle"
                >
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
              <TableRow className="h-full">
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-lg h-[calc(100vh-14rem)] align-middle"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 p-4 border-t bg-white">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );

}