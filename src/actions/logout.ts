"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("COOKIEDATOS");
  cookieStore.delete("JSESSIONID");
  cookieStore.delete("MY_VARLIST_COOKIE");
  cookieStore.delete("UwdSessionID");

  redirect("/login");
}
