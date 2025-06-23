"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Eye } from "lucide-react"

export type CoverageChainPerformance = {
  chain: string
  stores: number
  weeklyVisits: number
  coverage: number
  onViewChain?: (chainName: string) => void
}

export const columns: ColumnDef<CoverageChainPerformance>[] = [
  {
    accessorKey: "chain",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Cadena
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("chain")}</div>
    },
  },
  {
    accessorKey: "stores",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Total Tiendas
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("stores")}</div>
    },
  },
  {
    accessorKey: "weeklyVisits",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Visitas Semanales
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center text-blue-600 font-semibold">{row.getValue("weeklyVisits")}</div>
    },
  },
  {
    accessorKey: "coverage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Ratio Cobertura
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const coverage = row.getValue("coverage") as number
      return <div className="text-center">{coverage.toFixed(2)}</div>
    },
  },
  {
    id: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const coverage = row.getValue("coverage") as number
      const status = coverage >= 1.0 ? 'Óptima' : coverage >= 0.8 ? 'Buena' : 'Mejorable'
      
      return (
        <div className="text-center">
          <Badge variant={
            coverage >= 1.0 ? 'default' :
            coverage >= 0.8 ? 'secondary' :
            'destructive'
          } className={
            coverage >= 1.0 ? 'bg-green-100 text-green-800 border-green-200' :
            coverage >= 0.8 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
            'bg-red-100 text-red-800 border-red-200'
          }>
            {status}
          </Badge>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Acción",
    cell: ({ row }) => {
      const chain = row.original
      
      return (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => chain.onViewChain?.(chain.chain)}
            className="flex items-center justify-center space-x-1 mx-auto"
          >
            <Eye className="w-3 h-3" />
            <span>Ver</span>
          </Button>
        </div>
      )
    },
  },
] 