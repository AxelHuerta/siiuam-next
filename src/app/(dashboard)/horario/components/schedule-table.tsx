import { ScheduleUea } from "@/interfaces/schedule-uea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScheduleTableProps {
  schedules: ScheduleUea[];
}

export function ScheduleTable({ schedules }: ScheduleTableProps) {
  if (!schedules || schedules.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No hay horarios disponibles
          </p>
        </CardContent>
      </Card>
    );
  }

  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horario de Clases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UEA</TableHead>
                <TableHead>Nombre de la UEA</TableHead>
                <TableHead>Profesor</TableHead>
                <TableHead>Grupo</TableHead>
                {daysOfWeek.map((day) => (
                  <TableHead key={day} className="text-center">
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule, idx) => (
                <TableRow key={schedule.uea}>
                  <TableCell className="font-medium">{schedule.uea}</TableCell>
                  <TableCell>{schedule.nombre}</TableCell>
                  <TableCell>{schedule.profesor}</TableCell>
                  <TableCell>{schedule.grupo}</TableCell>
                  {daysOfWeek.map((_, dayIdx) => (
                    <TableCell
                      key={schedule.uea + dayIdx}
                      className="text-center"
                    >
                      {schedule.dias?.[dayIdx] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
