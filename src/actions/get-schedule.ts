import { ScheduleUea } from "@/interfaces/schedule-uea";
import { parseScheduleTable } from "@/lib/schedule-parser";
import axios from "axios";
import { cookies } from "next/headers";

export default async function getSchedule(): Promise<ScheduleUea[] | null> {
  const cookieStore = await cookies();
  const COOKIEDATOS = cookieStore.get("COOKIEDATOS")?.value || "";
  const UwdSessionID = cookieStore.get("UwdSessionID")?.value || "";
  const MY_VARLIST_COOKIE = cookieStore.get("MY_VARLIST_COOKIE")?.value || "";
  const JSESSIONID = cookieStore.get("JSESSIONID")?.value || "";
  const url = "https://zacatlan.rec.uam.mx:8443/rec/izt/IEWBC002.oConsulta";
  const cookie = `COOKIEDATOS=${COOKIEDATOS}; UwdSessionID=${UwdSessionID}; MY_VARLIST_COOKIE=${MY_VARLIST_COOKIE}; JSESSIONID=${JSESSIONID}`;

  const response = await axios
    .post(url, "------WebKitFormBoundary2lNUQ0BGWxtzBow8--\r\n", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9,es;q=0.8",
        "cache-control": "max-age=0",
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundary2lNUQ0BGWxtzBow8",
        "sec-ch-ua": '"Not_A Brand";v="99", "Chromium";v="142"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "iframe",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "upgrade-insecure-requests": "1",
        cookie: cookie,
        Referer:
          "https://zacatlan.rec.uam.mx:8443/rec/izt/AELCWBCTC008?PROCEDENCIA=2",
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error fetching schedule", err);
      return null;
    });

  if (!response) return null;

  const parsedScheduleTable = parseScheduleTable(response);

  return parsedScheduleTable;
}
