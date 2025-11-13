import getSchedule from "@/actions/get-schedule";
import { ScheduleTable } from "@/app/(dashboard)/horario/components/schedule-table";

async function getData() {
  return getSchedule();
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Horario</h1>
        <p className="text-muted-foreground">
          Visualiza tu horario de clases del trimestre
        </p>
      </div>
      <ScheduleTable schedules={data || []} />
    </div>
  );
}
