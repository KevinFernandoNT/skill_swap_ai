"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, ArrowRightLeft, Calendar, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SuggestedSession } from "../../hooks/useGetSuggestedSessions"

interface ConnectDataTableProps {
  data: SuggestedSession[];
  onSwapClick: (session: SuggestedSession, event: React.MouseEvent) => void;
  onViewDetails: (session: SuggestedSession) => void;
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'programming': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'design': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    'marketing': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'data science': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
    'business': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'finance': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    'writing': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
    'communication': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
    'sales': 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
  };
  return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
};


export const columns = (
  onSwapClick: (session: SuggestedSession, event: React.MouseEvent) => void,
  onViewDetails: (session: SuggestedSession) => void
): ColumnDef<SuggestedSession>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium max-w-[200px] truncate" title={row.getValue("title")}>
        {row.getValue("title") || 'Untitled Session'}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-[200px] truncate text-sm text-muted-foreground" title={description}>
          {description || 'No description available'}
        </div>
      )
    },
  },
  {
    accessorKey: "skillCategory",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const category = row.getValue("skillCategory") as string
      return (
        <Badge variant="secondary" className={getCategoryColor(category || '')}>
          {category?.charAt(0).toUpperCase() + category?.slice(1).toLowerCase() || 'General'}
        </Badge>
      )
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as string
      return (
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>{date ? new Date(date).toLocaleDateString() : 'Date TBD'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "startTime",
    header: "Time",
    cell: ({ row }) => {
      const startTime = row.getValue("startTime") as string
      const endTime = row.original.endTime as string
      return (
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>{startTime && endTime ? `${startTime} - ${endTime}` : 'TBD'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "hostId",
    header: "Host",
    cell: ({ row }) => {
      const host = row.getValue("hostId") as any
      return (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src={host?.avatar} 
              alt={host?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initial if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center" style={{ display: 'none' }}>
              <span className="text-white text-sm font-semibold">
                {host?.name?.charAt(0) || 'H'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate" title={host?.name}>
              {host?.name || 'Session Host'}
            </p>
            {host?.email && (
              <p className="text-xs text-muted-foreground truncate" title={host?.email}>
                {host?.email}
              </p>
            )}
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const session = row.original

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(session)}
            className="h-8"
          >
            View Details
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={(e) => onSwapClick(session, e)}
            className="h-8"
          >
            <ArrowRightLeft className="w-4 h-4 mr-1" />
            Request Swap
          </Button>
        </div>
      )
    },
  },
]

export function ConnectDataTable({ data, onSwapClick, onViewDetails }: ConnectDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns: columns(onSwapClick, onViewDetails),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter sessions..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns(onSwapClick, onViewDetails).length}
                  className="h-24 text-center"
                >
                  No sessions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} session(s) found.
        </div>
        <div className="space-x-2">
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
    </div>
  )
}
