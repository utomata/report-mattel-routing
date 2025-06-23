"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, TrendingUp, TrendingDown, Minus, CheckCircle2, AlertTriangle, XCircle, MinusCircle } from "lucide-react"

export type StorePerformance = {
  store: string
  chain: string
  sales: number
  before: number
  after: number
  change: number
  status: string
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
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Estado de Cobertura
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
      const statusConfig = {
        'Óptima': { 
          variant: 'default' as const, 
          icon: CheckCircle2,
          className: 'bg-green-100 text-green-800 border-green-200'
        },
        'Parcial': { 
          variant: 'secondary' as const, 
          icon: AlertTriangle,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        },
        'Sin Cobertura': { 
          variant: 'destructive' as const, 
          icon: XCircle,
          className: 'bg-red-100 text-red-800 border-red-200'
        },
        'No Requerida': { 
          variant: 'outline' as const, 
          icon: MinusCircle,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
      }

      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Sin Cobertura']
      const Icon = config.icon
      
      return (
        <div className="text-center">
          <Badge 
            variant={config.variant}
            className={`${config.className} flex items-center gap-1 w-fit mx-auto`}
          >
            <Icon className="w-3 h-3" />
            {status}
          </Badge>
        </div>
      )
    },
  },
] 