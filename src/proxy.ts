import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("UwdSessionID")?.value;

  if (!sessionCookie || sessionCookie === '"MODULOUAM=1"')
    return NextResponse.redirect(new URL("/login", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/kardex"],
};
