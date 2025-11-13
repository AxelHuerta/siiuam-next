import { ScheduleUea } from "@/interfaces/schedule-uea";
import * as cheerio from "cheerio";

export function parseScheduleTable(html: string): ScheduleUea[] {
  const $ = cheerio.load(html);
  const schedules: ScheduleUea[] = [];

  // Seleccionar todas las filas de datos (excluyendo el header)
  const rows = $("#t2 tbody tr").slice(1);

  rows.each((_, row) => {
    const inputs = $(row).find("input[type='hidden']");

    const entry: ScheduleUea = {
      uea: inputs.eq(0).attr("value") || "",
      nombre: inputs.eq(1).attr("value") || "",
      profesor: inputs.eq(2).attr("value") || "",
      grupo: inputs.eq(3).attr("value") || "",
      dias: [],
    };

    // Extraer los días (inputs 4-8 corresponden a CD_DIA1 a CD_DIA5)
    for (let i = 4; i < 9; i++) {
      const dayValue = inputs.eq(i).attr("value");
      if (dayValue) {
        entry.dias.push(dayValue);
      }
    }

    if (entry.uea || entry.nombre) {
      schedules.push(entry);
    }
  });

  return schedules;
}
