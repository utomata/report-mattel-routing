"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Eye } from "lucide-react"

export type CoverageAgentPerformance = {
  name: string
  weeklyVisits: number
  storeTime: number
  travelTime: number
  adminTime: number
  efficiencyRating: string
  onViewAgent?: (agentName: string) => void
}

export const columns: ColumnDef<CoverageAgentPerformance>[] = [
  {
    accessorKey: "name",
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
      return <div className="font-medium">{row.getValue("name")}</div>
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
      return <div className="text-center">{row.getValue("weeklyVisits")}</div>
    },
  },
  {
    accessorKey: "storeTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Tiempo en Tienda %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const storeTime = row.getValue("storeTime") as number
      return <div className="text-center text-green-600 font-semibold">{storeTime.toFixed(1)}%</div>
    },
  },
  {
    accessorKey: "travelTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Tiempo de Viaje %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const travelTime = row.getValue("travelTime") as number
      return <div className="text-center">{travelTime.toFixed(1)}%</div>
    },
  },
  {
    accessorKey: "efficiencyRating",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Rendimiento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const rating = row.getValue("efficiencyRating") as string
      const ratingTranslation = {
        'Excellent': 'Excelente',
        'Good': 'Bueno', 
        'Average': 'Promedio',
        'Poor': 'Bajo'
      }
      
      const translatedRating = ratingTranslation[rating as keyof typeof ratingTranslation] || rating
      
      return (
        <div className="text-center">
          <Badge variant={
            rating === 'Excellent' ? 'default' :
            rating === 'Good' ? 'secondary' :
            rating === 'Average' ? 'outline' :
            'destructive'
          } className={
            rating === 'Excellent' ? 'bg-green-100 text-green-800 border-green-200' :
            rating === 'Good' ? 'bg-blue-100 text-blue-800 border-blue-200' :
            rating === 'Average' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
            'bg-red-100 text-red-800 border-red-200'
          }>
            {translatedRating}
          </Badge>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Acción",
    cell: ({ row }) => {
      const agent = row.original
      
      return (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => agent.onViewAgent?.(agent.name)}
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