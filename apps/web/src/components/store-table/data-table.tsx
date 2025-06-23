"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "sales", desc: true } // Sort by sales descending by default
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  
  // Status filter with checkboxes - hide "No Requerida" by default
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([
    'Óptima', 'Parcial', 'Sin Cobertura'
  ])

  // Filter data based on selected statuses
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const status = (item as Record<string, unknown>).status as string
      return selectedStatuses.includes(status)
    })
  }, [data, selectedStatuses])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  // Get unique chains for filter (from all data, not filtered)
  const chains = React.useMemo(() => {
    const chainSet = new Set<string>()
    data.forEach((item) => {
      const chain = (item as Record<string, unknown>).chain
      if (typeof chain === 'string' && chain) {
        chainSet.add(chain)
      }
    })
    return Array.from(chainSet).sort()
  }, [data])

  // Get unique statuses for filter
  const statuses = React.useMemo(() => {
    const statusSet = new Set<string>()
    data.forEach((item) => {
      const status = (item as Record<string, unknown>).status
      if (typeof status === 'string' && status) {
        statusSet.add(status)
      }
    })
    return Array.from(statusSet).sort()
  }, [data])

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filtrar tiendas..."
          value={(table.getColumn("store")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("store")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        
        <Select
          value={(table.getColumn("chain")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) =>
            table.getColumn("chain")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por cadena" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las cadenas</SelectItem>
            {chains.map((chain) => (
              <SelectItem key={chain} value={chain}>
                {chain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-between">
              Estados ({selectedStatuses.length})
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-3">
            <div className="space-y-2">
              <div className="font-medium text-sm">Estado de Cobertura</div>
              {statuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={status}
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedStatuses([...selectedStatuses, status])
                      } else {
                        setSelectedStatuses(selectedStatuses.filter(s => s !== status))
                      }
                    }}
                  />
                  <label htmlFor={status} className="text-sm cursor-pointer flex-1">
                    <Badge variant={
                      status === 'Óptima' ? 'default' :
                      status === 'Parcial' ? 'secondary' :
                      status === 'No Requerida' ? 'outline' :
                      'destructive'
                    } className="text-xs">
                      {status}
                    </Badge>
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="ml-auto text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} de {filteredData.length} tienda(s) mostradas ({data.length} total)
        </div>
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
} 