"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react"

export type StorePerformance = {
  store: string
  chain: string
  sales: number
  before: number
  after: number
  change: number
}

export const columns: ColumnDef<StorePerformance>[] = [
  {
    accessorKey: "store",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Tienda
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("store")}</div>
    },
  },
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
      return <div className="text-gray-600">{row.getValue("chain")}</div>
    },
  },
  {
    accessorKey: "sales",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Ventas
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("sales"))
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 0,
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "before",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Proceso Manual
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("before")} visitas</div>
    },
  },
  {
    accessorKey: "after",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Optimizado con Utomata
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-semibold text-primary">{row.getValue("after")} visitas</div>
    },
  },
  {
    accessorKey: "change",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Cambio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const change = row.getValue("change") as number
      
      return (
        <div className="text-center flex items-center justify-center">
          {change > 0 && <TrendingUp className="w-4 h-4 text-green-600 mr-1" />}
          {change < 0 && <TrendingDown className="w-4 h-4 text-red-600 mr-1" />}
          {change === 0 && <Minus className="w-4 h-4 text-gray-600 mr-1" />}
          <span className={`font-semibold ${
            change > 0 ? 'text-green-600' : 
            change < 0 ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {change > 0 ? '+' : ''}{change} visitas
          </span>
        </div>
      )
    },
  },

] 