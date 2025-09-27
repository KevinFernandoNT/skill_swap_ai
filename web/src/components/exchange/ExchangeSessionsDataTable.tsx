import React from 'react';
import { ArrowUpDown, CheckCircle, Clock, XCircle } from 'lucide-react';
import { ExchangeSession } from '@/hooks/useGetUpcomingExchangeSessions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';

interface ExchangeSessionsDataTableProps {
  data: ExchangeSession[];
  onViewDetails: (session: ExchangeSession) => void;
  onComplete: (sessionId: string) => void;
  isLoading?: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return <Clock className="w-3 h-3 mr-1" />;
    case 'completed':
      return <CheckCircle className="w-3 h-3 mr-1" />;
    case 'expired':
      return <XCircle className="w-3 h-3 mr-1" />;
    default:
      return <Clock className="w-3 h-3 mr-1" />;
  }
};

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    'upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'expired': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  };
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
};

export const columns = (
  onViewDetails: (session: ExchangeSession) => void,
  onComplete: (sessionId: string) => void
): ColumnDef<ExchangeSession>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Session Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const session = row.original;
      return (
        <div className="max-w-[200px]">
          <div className="font-medium truncate" title={session.title}>
            {session.title}
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {session.skillCategory}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "skillId",
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
      const skill = row.getValue("skillId") as any;
      return (
        <div className="max-w-[150px]">
          <div className="font-medium truncate" title={skill?.name}>
            {skill?.name || 'Skill Name'}
          </div>
          <div className="text-sm text-muted-foreground truncate" title={skill?.category}>
            {skill?.category || 'Category'}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "requestedSkillId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Learning Skill
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const skill = row.getValue("requestedSkillId") as any;
      return (
        <div className="max-w-[150px]">
          <div className="font-medium truncate" title={skill?.name}>
            {skill?.name || 'Skill Name'}
          </div>
          <div className="text-sm text-muted-foreground truncate" title={skill?.category}>
            {skill?.category || 'Category'}
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
      const status = row.getValue("status") as string;
      return (
        <Badge variant="secondary" className={getStatusColor(status)}>
          {getStatusIcon(status)}
          {status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase()}
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
      const date = row.getValue("date") as string;
      return (
        <div className="text-sm">
          {date ? new Date(date).toLocaleDateString() : 'TBD'}
        </div>
      )
    },
  },
  {
    accessorKey: "startTime",
    header: "Time",
    cell: ({ row }) => {
      const startTime = row.getValue("startTime") as string;
      const endTime = row.original.endTime;
      return (
        <div className="text-sm">
          {startTime && endTime ? `${startTime} - ${endTime}` : 'TBD'}
        </div>
      )
    },
  },
  {
    accessorKey: "hostId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Exchange Partner
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const session = row.original;
      const currentUserId = (() => {
        try {
          const userStr = localStorage.getItem('user');
          if (!userStr) return null;
          const u = JSON.parse(userStr);
          return u?._id || u?.id || null;
        } catch {
          return null;
        }
      })();
      
      // Determine which user is the exchange partner (not the current user)
      const exchangePartner = currentUserId === session.hostId?._id ? session.requestedBy : session.hostId;
      
      return (
        <div className="flex items-center gap-3 max-w-[200px]">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src={exchangePartner?.avatar} 
              alt={exchangePartner?.name}
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
                {exchangePartner?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate" title={exchangePartner?.name}>
              {currentUserId === exchangePartner?._id ? 'You' : exchangePartner?.name || 'Unknown User'}
            </div>
            <div className="text-sm text-muted-foreground truncate" title={exchangePartner?.email}>
              {exchangePartner?.email || 'No email available'}
            </div>
          </div>
        </div>
      )
    },
  },
]

export function ExchangeSessionsDataTable({ 
  data, 
  onViewDetails, 
  onComplete, 
  isLoading = false 
}: ExchangeSessionsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns: columns(onViewDetails, onComplete),
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
                <TableHead>Session Title</TableHead>
                <TableHead>Teaching Skill</TableHead>
                <TableHead>Learning Skill</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Exchange Partner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading exchange sessions...</span>
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No exchange sessions found.
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
