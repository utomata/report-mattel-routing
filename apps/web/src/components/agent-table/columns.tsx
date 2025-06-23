"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react"

export type AgentPerformance = {
  agent: string
  before: number
  after: number
  efficiency_gain: number
}

export const columns: ColumnDef<AgentPerformance>[] = [
  {
    accessorKey: "agent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Agente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("agent")}</div>
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
    accessorKey: "efficiency_gain",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Ganancia de Eficiencia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const efficiency = row.getValue("efficiency_gain") as number
      
      return (
        <div className="text-center flex items-center justify-center">
          {efficiency > 0 && <TrendingUp className="w-4 h-4 text-green-600 mr-1" />}
          {efficiency < 0 && <TrendingDown className="w-4 h-4 text-red-600 mr-1" />}
          {efficiency === 0 && <Minus className="w-4 h-4 text-gray-600 mr-1" />}
          <span className={`font-semibold ${
            efficiency > 0 ? 'text-green-600' : 
            efficiency < 0 ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {efficiency > 0 ? '+' : ''}{efficiency.toFixed(1)}%
          </span>
        </div>
      )
    },
  },
] 