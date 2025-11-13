import { ScheduleUea } from "@/interfaces/schedule-uea";

export const mockScheduleData: ScheduleUea[] = [
  {
    uea: "AE02",
    nombre: "Cálculo Diferencial",
    profesor: "Dr. Juan García",
    grupo: "1-1",
    dias: ["09:00-11:00", "09:00-11:00", "-", "09:00-11:00", "-"],
  },
  {
    uea: "AE05",
    nombre: "Álgebra Lineal",
    profesor: "Dra. María López",
    grupo: "2-1",
    dias: ["-", "14:00-16:00", "14:00-16:00", "-", "14:00-16:00"],
  },
  {
    uea: "AE08",
    nombre: "Física I",
    profesor: "Dr. Carlos Martínez",
    grupo: "1-2",
    dias: ["11:00-13:00", "-", "11:00-13:00", "11:00-13:00", "-"],
  },
  {
    uea: "AE12",
    nombre: "Programación I",
    profesor: "Ing. Roberto Sánchez",
    grupo: "3-1",
    dias: ["-", "16:00-18:00", "-", "16:00-18:00", "16:00-18:00"],
  },
];
