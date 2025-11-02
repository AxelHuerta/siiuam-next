import axios, { AxiosResponse } from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { matricula, password } = await request.json();

    const sessionResponse: AxiosResponse = await axios.get(
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
      return NextResponse.json({ error: "No cookies found" }, { status: 500 });
    }
    const parsedCookies = parseCookies(initialCookies);

    const framesResponse = await axios.get(
      "https://zacatlan.rec.uam.mx:8443/rec/izt/AEWBF003.oMuestraFrames?mod=1",
      {
        withCredentials: true,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          cookie: `${parsedCookies[0]}; ${parsedCookies[1]}`,
          Referer: "https://zacatlan.rec.uam.mx:8443/rec/izt/",
          "Upgrade-Insecure-Requests": "1",
          Connection: "keep-alive",
        },
      }
    );

    const frameCookies = framesResponse.headers[`set-cookie`];

    if (!frameCookies || frameCookies?.length === 0) {
      return NextResponse.json(
        { error: "No frame cookies found" },
        { status: 500 }
      );
    }
    const formattedFrameCookies = parseCookies(frameCookies);

    const bodyParams = `
SIGLAS_UNI_XX.E_UNIDAD.AE02.1=IZT&%23.E_UNIDAD.AE02.1=AxJDMg%3D%3D&%23CRC.E_UNIDAD.AE02.1=00000054&NOMBRE.IDENTIFICACION.NONMODELED=${matricula}&COMPLEMENTO.IDENTIFICACION.NONMODELED=${password}&GO.IDENTIFICACION.NONMODELED=Entrar&%25.IDENTIFICACION.NONMODELED=&%23.WEB_INFO.SW01=&%23.WEB_MOD_ASO.SW01=&%23.USUARIO_ANEXO.SG02=&%23.MODULO_UWAS.SAE01=,      

`;

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
      cookie: `${formattedFrameCookies[0]}; ${parsedCookies[1]}; ${parsedCookies[0]}`,
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

    if (!loginResponse) {
      return NextResponse.json(
        {
          success: false,
          body: null,
          cookies: [],
        },
        {
          status: 500,
        }
      );
    }

    const isLogged = loginResponse.data.includes("Kardex");
    const loginCookies = loginResponse.headers[`set-cookie`];
    loginCookies?.push(initialCookies[0]);
    const loginParsedCookies = parseCookies(
      loginResponse.headers["set-cookie"] || []
    );

    const finalCookies = formatCookies(loginParsedCookies);

    return NextResponse.json(
      {
        success: isLogged,
        cookies: finalCookies,
      },
      {
        status: isLogged ? 200 : 401,
      }
    );
  } catch (error) {
    console.error("❌ ERROR:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
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
