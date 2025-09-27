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
import { ArrowUpDown, ChevronDown, MoreHorizontal, CheckCircle, XCircle, Clock, User, MessageCircle, Calendar, Eye } from "lucide-react"

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
import { ExchangeRequest } from "../../types"

interface ExchangeRequestsDataTableProps {
  data: ExchangeRequest[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onViewDetails: (request: ExchangeRequest) => void;
  isLoading?: boolean;
}

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'accepted': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
  };
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Clock className="w-3 h-3 mr-1" />;
    case 'accepted':
      return <CheckCircle className="w-3 h-3 mr-1" />;
    case 'rejected':
      return <XCircle className="w-3 h-3 mr-1" />;
    case 'cancelled':
      return <XCircle className="w-3 h-3 mr-1" />;
    default:
      return <Clock className="w-3 h-3 mr-1" />;
  }
};

export const columns = (
  onAccept: (requestId: string) => void,
  onReject: (requestId: string) => void,
  onViewDetails: (request: ExchangeRequest) => void
): ColumnDef<ExchangeRequest>[] => [
  {
    accessorKey: "requester",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Requester
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const requester = row.getValue("requester") as any
      return (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src={requester?.avatar} 
              alt={requester?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center" style={{ display: 'none' }}>
              <span className="text-white text-sm font-semibold">
                {requester?.name?.charAt(0) || 'R'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate" title={requester?.name}>
              {requester?.name || 'Unknown User'}
            </p>
            {requester?.email && (
              <p className="text-xs text-muted-foreground truncate" title={requester?.email}>
                {requester?.email}
              </p>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "sessionId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Session
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const session = row.getValue("sessionId") as any
      return (
        <div className="max-w-[200px]">
          <div className="font-medium truncate" title={session?.title}>
            {session?.title || 'Session Title'}
          </div>
          <div className="text-sm text-muted-foreground truncate" title={session?.description}>
            {session?.description || 'No description'}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "offeredSkillId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Teaching Skill
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const teachingSkill = row.getValue("offeredSkillId") as any
      return (
        <div className="max-w-[150px]">
          <div className="font-medium truncate" title={teachingSkill?.name}>
            {teachingSkill?.name || 'Skill Name'}
          </div>
          <div className="text-sm text-muted-foreground truncate" title={teachingSkill?.category}>
            {teachingSkill?.category || 'Category'}
          </div>
        </div>
      )
    },
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
      const status = row.getValue("status") as string
      return (
        <Badge variant="secondary" className={getStatusColor(status)}>
          {getStatusIcon(status)}
          {status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || 'Unknown'}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Requested
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      return (
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>{createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string
      return (
        <div className="max-w-[200px] truncate text-sm text-muted-foreground" title={message}>
          {message || 'No message'}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const request = row.original
      const isPending = request.status === 'pending'

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(request)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {isPending && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => onAccept(request._id)}
                className="h-8 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Accept
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onReject(request._id)}
                className="h-8"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      )
    },
  },
]

export function ExchangeRequestsDataTable({ 
  data, 
  onAccept, 
  onReject, 
  onViewDetails, 
  isLoading = false 
}: ExchangeRequestsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns: columns(onAccept, onReject, onViewDetails),
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

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Teaching Skill</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading exchange requests...</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter requests..."
          value={(table.getColumn("requester")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("requester")?.setFilterValue(event.target.value)
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
                  colSpan={columns(onAccept, onReject, onViewDetails).length}
                  className="h-24 text-center"
                >
                  No exchange requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} request(s) found.
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
