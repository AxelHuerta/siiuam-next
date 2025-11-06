"use server";

import { cookies } from "next/headers";
import axios from "axios";
import * as cheerio from "cheerio";
import { Calificacion, Grade } from "@/interfaces/grade";

export async function getKardex() {
  const cookiesStore = await cookies();
  const COOKIEDATOS = cookiesStore.get("COOKIEDATOS")?.value || "";
  const UwdSessionID = cookiesStore.get("UwdSessionID")?.value || "";
  const MY_VARLIST_COOKIE = cookiesStore.get("MY_VARLIST_COOKIE")?.value || "";
  const JSESSIONID = cookiesStore.get("JSESSIONID")?.value || "";

  const cookiesValues = `COOKIEDATOS=${COOKIEDATOS}; UwdSessionID=${UwdSessionID}; MY_VARLIST_COOKIE=${MY_VARLIST_COOKIE}; JSESSIONID=${JSESSIONID}`;

  const url = "https://zacatlan.rec.uam.mx:8443/rec/izt/IEWBC020.oConsulta";
  const headers = {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9,es;q=0.8",
    "sec-ch-ua": '"Not_A Brand";v="99", "Chromium";v="142"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "frame",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    cookie: cookiesValues,
    Referer: "https://zacatlan.rec.uam.mx:8443/rec/izt/AEWBU004",
  };

  const response = await axios
    .get(url, { headers })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
      return null;
    });

  const isKardex = response?.includes("Kardex") ?? false;
  if (!isKardex) return null;

  const $ = cheerio.load(response);
  const kardex: Grade[] = [];

  $("table.inftab tr").each((index, row) => {
    // Saltar la fila de encabezado
    if (index === 0) return;

    const cols = $(row).find("td");
    if (cols.length >= 8) {
      kardex.push({
        registro: $(cols[0]).text().trim(),
        codigo: $(cols[1]).text().trim(),
        nombre: $(cols[2]).text().trim(),
        trimestre: $(cols[3]).text().trim(),
        tipoEvaluacion: $(cols[4]).text().trim(),
        calificacion: $(cols[5]).text().trim() as Calificacion,
        acta: $(cols[6]).text().trim(),
        creditos: $(cols[7]).text().trim(),
      });
    }
  });

  return kardex;
}
