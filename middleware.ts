import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const PROTECTED_PATHS = ["/dashboard", "/projects", "/grants", "/caltrans", "/environmental", "/sales-tax", "/meetings", "/records-requests", "/documents", "/reports", "/community"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  const url = new URL(req.url);
  const isProtected = PROTECTED_PATHS.some((path) => url.pathname.startsWith(path));

  if (isProtected) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("redirect_to", url.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/public|community).*)"],
};

