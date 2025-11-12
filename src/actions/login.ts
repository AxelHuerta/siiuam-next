"use server";

import axios from "axios";
import { cookies } from "next/headers";
import * as cheerio from "cheerio";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default async function login(matricula: string, password: string) {
  const cookieStore = await cookies();
  const response = await axios
    .post(`${API_URL}/login`, {
      matricula,
      password,
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error("Login API ERROR:", error);
      return null;
    });

  cookieStore.set("COOKIEDATOS", response.cookies.COOKIEDATOS);
  cookieStore.set("MY_VARLIST_COOKIE", response.cookies.MY_VARLIST_COOKIE);
  cookieStore.set("UwdSessionID", response.cookies.UwdSessionID);
  cookieStore.set("JSESSIONID", response.cookies.JSESSIONID);

  return response;
}

async function getCookies(matricula: string, password: string) {
  try {
    const cookies = await getInitialCookies();
    if (cookies.length < 3) return null;

    const crc = await getCrcValue(cookies[0]);
    if (!crc) return null;

    const bodyParams = `
SIGLAS_UNI_XX.E_UNIDAD.AE02.1=IZT&%23.E_UNIDAD.AE02.1=AxJDMg%3D%3D&%23CRC.E_UNIDAD.AE02.1=${crc}&NOMBRE.IDENTIFICACION.NONMODELED=${matricula}&COMPLEMENTO.IDENTIFICACION.NONMODELED=${password}&GO.IDENTIFICACION.NONMODELED=Entrar&%25.IDENTIFICACION.NONMODELED=&%23.WEB_INFO.SW01=&%23.WEB_MOD_ASO.SW01=&%23.USUARIO_ANEXO.SG02=&%23.MODULO_UWAS.SAE01=, `;

    const headers = {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",

      "accept-language": "en-US,en;q=0.9,es;q=0.8",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": '"Not_A Brand";v="99", "Chromium";v="142"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "frame",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      cookie: `${cookies[2]}; ${cookies[1]}; ${cookies[0]}`,
      Referer:
        "https://zacatlan.rec.uam.mx:8443/rec/izt/AEWBU004.oIniSesWebLic?mod=1",
    };

    const loginResponse = await axios
      .post("https://zacatlan.rec.uam.mx:8443/rec/izt/AEWBU004", bodyParams, {
        headers,
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: (status) => status < 600,
        responseType: "text",
      })
      .then((res) => res)
      .catch((err) => {
        console.error("Login ERROR:", err.response?.status, err.response?.data);
        return null;
      });

    if (!loginResponse) return null;

    const isLogged = loginResponse.data.includes("Kardex");
    if (!isLogged) return null;

    const loginCookies = loginResponse.headers[`set-cookie`];

    loginCookies?.push(cookies[0]);
    const loginParsedCookies = parseCookies(
      loginResponse.headers["set-cookie"] || []
    );

    return formatCookies(loginParsedCookies);
  } catch (error) {
    console.error("Get cookies ERROR:", error);
    return null;
  }
}

async function getInitialCookies(): Promise<string[]> {
  const sessionResponse = await axios.get(
    "https://zacatlan.rec.uam.mx:8443/rec/izt/AEWBU004.oIniSesWebLic?mod=1",
    {
      withCredentials: true,
      maxRedirects: 0,
      validateStatus: (s) => s < 400,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
        Referer: "https://zacatlan.rec.uam.mx:8443/rec/izt/",
        "Upgrade-Insecure-Requests": "1",
        Connection: "keep-alive",
      },
    }
  );

  const initialCookies = sessionResponse.headers[`set-cookie`];

  if (!initialCookies || initialCookies?.length === 0) {
    return [];
  }

  let parsedInitialCookies = parseCookies(initialCookies);

  const framesResponse = await axios.get(
    "https://zacatlan.rec.uam.mx:8443/rec/izt/AEWBF003.oMuestraFrames?mod=1",
    {
      withCredentials: true,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        cookie: `${parsedInitialCookies[0]}; ${parsedInitialCookies[1]}`,
        Referer: "https://zacatlan.rec.uam.mx:8443/rec/izt/",
        "Upgrade-Insecure-Requests": "1",
        Connection: "keep-alive",
      },
    }
  );

  const frameCookies = framesResponse.headers[`set-cookie`];

  if (!frameCookies || frameCookies?.length === 0) {
    return [];
  }

  const formattedFrameCookies = parseCookies(frameCookies);
  parsedInitialCookies = parsedInitialCookies.concat(formattedFrameCookies);

  return parsedInitialCookies;
}

function parseCookies(cookieArray: string[]) {
  const auxArray = cookieArray.map((cookie) => cookie.split(";")[0]);

  return auxArray;
}

function formatCookies(cookieArray: string[]) {
  const cookieObj: Record<string, string> = {};

  for (const cookie of cookieArray) {
    const delimiter = "=";
    const index = cookie.indexOf(delimiter);
    const [name, value] = [
      cookie.substring(0, index),
      cookie.substring(index + delimiter.length),
    ];
    if (name && value) {
      cookieObj[name.trim()] = value.trim();
    }
  }

  return cookieObj;
}

async function getCrcValue(cookie: string) {
  const crcUrl =
    "https://zacatlan.rec.uam.mx:8443/rec/izt/AEWBU004.oIniSesWebLic?mod=1";

  const crcHeaders = {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9,es;q=0.8",
      "sec-ch-ua": '"Not_A Brand";v="99", "Chromium";v="142"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "frame",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "upgrade-insecure-requests": "1",
      cookie: `UwdSessionID=MODULOUAM=1; ${cookie}`,
      Referer:
        "https://zacatlan.rec.uam.mx:8443/rec/izt/AEWBF003.oMuestraFrames?mod=1",
    },
  };

  const crcRequest = await axios
    .get(crcUrl, crcHeaders)
    .then((res) => res.data)
    .catch((err) => {
      console.error("CRC ERROR:", err.response?.status, err.response?.data);
      return null;
    });

  const $ = cheerio.load(crcRequest || "");
  const crcValue = $('[name="#CRC.E_UNIDAD.AE02.1"]').val()?.toString() || "";

  return crcValue;
}
