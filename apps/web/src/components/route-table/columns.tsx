"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

// This type is manually created based on the data we expect to be passed to the table.
export type RouteVisitRow = {
  day: string
  sequence: number
  storeName: string
  arrivalTime: string
  serviceDuration: number
}

export const columns: ColumnDef<RouteVisitRow>[] = [
  {
    accessorKey: "day",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Día
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const day = row.getValue("day") as string;
      const dayMap: { [key: string]: string } = {
        'mon': 'Lunes', 'tue': 'Martes', 'wed': 'Miércoles', 
        'thu': 'Jueves', 'fri': 'Viernes', 'sat': 'Sábado'
      };
      return <div>{dayMap[day.toLowerCase()] || day}</div>
    }
  },
  {
    accessorKey: "sequence",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Orden de Visita
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
  },
  {
    accessorKey: "storeName",
    header: "Nombre de Tienda",
  },
  {
    accessorKey: "arrivalTime",
    header: "Hora de Llegada",
  },
  {
    accessorKey: "serviceDuration",
    header: () => <div className="text-right">Servicio (min)</div>,
    cell: ({ row }) => {
      const duration = parseFloat(row.getValue("serviceDuration"))
      return <div className="text-right font-medium">{duration}</div>
    },
  },
] 