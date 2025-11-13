"use client";

import { Button } from "@/components/ui/button";
import { Grade } from "@/interfaces/grade";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Grade>[] = [
  {
    accessorKey: "registro",
    header: "Registro",
  },
  {
    accessorKey: "codigo",
    header: "Código",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "trimestre",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Trimestre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "tipoEvaluacion",
    header: "Tipo de Evaluación",
  },
  {
    accessorKey: "acta",
    header: "Acta",
  },
  {
    accessorKey: "creditos",
    header: "Créditos",
  },
];
