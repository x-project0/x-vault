import NextAuth from "next-auth";
import { authConfig } from "./lib/server/auth";

// export default NextAuth(authConfig).auth;

// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// };

// export { auth as middleware } from "auth";

// Or like this if you need to do something here.
export default NextAuth(authConfig).auth


// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/bookmarks/:path*", "/bookmarks"],
};