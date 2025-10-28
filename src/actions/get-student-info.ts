"use server";

import { StudentData } from "@/interfaces";
import axios from "axios";
import * as cheerio from "cheerio";
import { cookies } from "next/headers";

export default async function getStudentInfo(): Promise<StudentData | null> {
  const cookieStore = await cookies();

  const cookieDatos = cookieStore.get("COOKIEDATOS")?.value || "";
  const cookieVarlist = cookieStore.get("MY_VARLIST_COOKIE")?.value || "";
  const cookieSessionID = cookieStore.get("UwdSessionID")?.value || "";
  const cookieJSessionID = cookieStore.get("JSESSIONID")?.value || "";

  const cookiesValue = `COOKIEDATOS=${cookieDatos}; UwdSessionID=${cookieSessionID}; MY_VARLIST_COOKIE=${cookieVarlist}; JSESSIONID=${cookieJSessionID}`;

  const response = await axios.get(
    "https://zacatlan.rec.uam.mx:8443/rec/izt/IEWBC007.oConsulta",
    {
      withCredentials: true,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9,es;q=0.8",
        "sec-ch-ua": '"Chromium";v="141", "Not?A_Brand";v="8"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "frame",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        cookie: cookiesValue,
        Referer: "https://zacatlan.rec.uam.mx:8443/rec/izt/AEWBU004",
      },
    }
  );

  const isLogged = response.data.includes("Matrícula");
  if (!isLogged) return null;

  const $ = cheerio.load(response.data);

  // Student data selectors
  const studentData: StudentData = {
    general: {
      matricula: $('[name="MATRICULA_CL.V_ALUMNO_ACAD.VW01"]')
        .val()
        ?.toString(),
      name: $('[name="NOMBRE_AL_NO.V_ALUMNO_ACAD.VW01"]').val()?.toString(),
      paternalLastName: $('[name="APE_PAT_AL_XX.V_ALUMNO_ACAD.VW01"]')
        .val()
        ?.toString(),
      maternalLastName: $('[name="APE_MAT_AL_XX.V_ALUMNO_ACAD.VW01"]')
        .val()
        ?.toString(),
      academicStatus: $('[name="ESTADO_AL_DE.ESTADO_ALUMNO.AE02.1"]')
        .val()
        ?.toString(),
      nacionality: $('[name="CD_NACIONALIDAD.ESTADO_ALUMNO.AE02.1"]')
        .val()
        ?.toString(),
    },
    academic: {
      unity: $('[name="UNIDAD_NO.E_UNIDAD.AE02.1"]').val()?.toString(),
      division: $('[name="DIVISION_NO.DIVISION.AE02.1"]').val()?.toString(),
      planName: $('[name="NOMBRE_PLAN_NO.E_PLAN.PE02.1"]').val()?.toString(),
      planCode: $('[name="CLAVE_PLAN_CL.E_PLAN.PE02.1"]').val()?.toString(),
      planVersion: $('[name="VERSION_CL.E_PLAN.PE02.1"]').val()?.toString(),
      maxCredits: $('[name="CRED_TOT_PL_NU.E_PLAN.PE02.1"]').val()?.toString(),
      planDuration: $('[name="DURACION_PL_NU.E_PLAN.PE02.1"]')
        .val()
        ?.toString(),
      minCredits: $('[name="CRED_MIN_PL_NU.E_PLAN.PE02.1"]').val()?.toString(),
      concentrationArea: $('[name="NO_AREA_AC_NU.V_ALUMNO_ACAD.VW01"]')
        .val()
        ?.toString(),
      subArea: $('[name="NO_AREA_AC_NU.V_ALUMNO_ACAD.VW01"]').val()?.toString(),
    },
    performance: {
      creditsCounter: $('[name="CREDITOS_CONTAB_NU.ALUMNO_V_ESPE.AE02.1-1"]')
        .val()
        ?.toString(),
      naCount: $('[name="NO_NAS_T_AL_NU.V_ALUMNO_ACAD.VW01"]')
        .val()
        ?.toString(),
      conversionCount: $('[name="NO_CONV_AL_NU.V_ALUMNO_ACAD.VW01"]')
        .val()
        ?.toString(),
      enrollmentTrimester: $('[name="TRIMESTRE_XX.TRIMESTRE_INI.AE02.1"]')
        .val()
        ?.toString(),
      lastActivityTrimester: $('[name="TRIMESTRE_XX.TRIMESTRE_ACA.AE02.1"]')
        .val()
        ?.toString(),
      lastEnrrolmentTrimester: $('[name="TRIMESTRE_XX.TRIMESTRE_REI.AE02.1"]')
        .val()
        ?.toString(),
      lastTrimesterAvgActive: $('[name="CD_PROMEDIO_NU.V_ALUMNO_ACAD.VW01"]')
        .val()
        ?.toString(),
      generalAvg: $('[name="PROMEDIO_G_NU.ALUMNO_V_ESPE.AE02"]')
        .val()
        ?.toString(),
    },
  };

  return studentData;
}
