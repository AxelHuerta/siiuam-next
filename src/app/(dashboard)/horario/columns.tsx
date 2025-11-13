"use client";

import { Button } from "@/components/ui/button";
import { ScheduleUea } from "@/interfaces/schedule-uea";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<ScheduleUea>[] = [
  {
    accessorKey: "uea",
    header: "UEA",
  },
  {
    accessorKey: "nombre",
    header: "Nombre de la UEA",
  },
  {
    accessorKey: "profesor",
    header: "Profesor",
  },
  {
    accessorKey: "grupo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Grupo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "tipoEvaluacion",
    header: "Tipo de Evaluación",
  },
];
