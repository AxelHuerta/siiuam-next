"use server";

import axios from "axios";
import { cookies } from "next/headers";

export default async function login(matricula: string, password: string) {
  const cookieStore = await cookies();
  const response = await axios
    .post("http://localhost:3000/api/login", {
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
