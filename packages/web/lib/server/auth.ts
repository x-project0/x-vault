// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import { Resource } from "sst";
// import clientPromise from "../mongodb";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";

// export const {
//   handlers: { GET, POST },
//   auth,
// } = NextAuth({
//   secret: Resource.NextAuthSecret.value,
//   trustHost: true,
//   callbacks: {
//     session: ({ session, token, user }) => {
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           id: user.id,
//         },
//       };
//     },
//   },
//   adapter: MongoDBAdapter(clientPromise),
//   providers: [
//     Google({
//       clientId: Resource.GoogleClientId.value,
//       clientSecret: Resource.GoogleClientSecret.value,
//     }),
//   ],
// })

import type { DefaultSession, NextAuthConfig } from "next-auth";
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export const authConfig = {
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60,
  },
  //   pages: { signIn: "/" },
  callbacks: {
    session: async ({ session, token }) => {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    // authorized({ request, auth }) {
    //   const isLoggedIn = !!auth?.user;
    //   console.log('isLoggedIn', isLoggedIn);
    //   const { pathname } = request.nextUrl;
    //   if (pathname !== "/") return isLoggedIn;
    //   return true;
    // },
    authorized({ auth ,request}) {
      const isLoggedIn = !!auth?.user;
      if (isLoggedIn) return true; // If there is a token, the user is authenticated
    },
  },
} satisfies NextAuthConfig;
