import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// OAuth endpoints for the MCP connector flow are deliberately public: /token
// and /register are called server-to-server by the client with no browser
// session, the .well-known documents are public metadata, and /authorize does
// its own auth check (redirecting to /login?next=... so the user lands back
// here post-login instead of on a bare /login from this gate).
const PUBLIC_PREFIXES = ["/auth/", "/f/", "/api/mcp", "/.well-known/"];
const PUBLIC_PATHS = ["/", "/login", "/signup", "/authorize", "/token", "/register"];
const PUBLIC_SUBMIT_ROUTE = /^\/api\/forms\/[^/]+\/submit$/;

function isPublicPath(pathname: string) {
  return (
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    PUBLIC_SUBMIT_ROUTE.test(pathname)
  );
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
