// import NextAuth from "next-auth";
// // import { MongoDBAdapter } from "@auth/mongodb-adapter";
// // import clientPromise from "@/lib/mongodb";
// import Google from "next-auth/providers/google";
// import { Resource } from "sst";
// export const runtime = "edge";

// const {
//   handlers: { GET, POST },
//   auth
// } = NextAuth({
//   secret: Resource.NextAuthSecret.value,
//   providers: [
//     Google({
//       clientId: Resource.GoogleClientId.value,
//       clientSecret: Resource.GoogleClientSecret.value,
//     }),
//   ],
//   // adapter: MongoDBAdapter(clientPromise),
//   // trustHost: true,

//   callbacks: {
//     session: ({ session, token, user }) => ({
//       ...session,
//       user: {
//         ...session.user,
//         id: user.id,
//       },
//     }),
//   },
// });

// export { GET, POST, auth };

// // import { env } from "@/env";
// // import NextAuth from "next-auth";
// // import Google from "next-auth/providers/google";
// // import { DrizzleAdapter } from "@auth/drizzle-adapter";
// // import { db } from "./db";

// // export const {
// //   handlers: { GET, POST },
// //   auth,
// // } = NextAuth({
// //   secret: env.NEXTAUTH_SECRET,
// //   trustHost: true,
// //   callbacks: {
// //     session: ({ session, token, user }) => ({
// //       ...session,
// //       user: {
// //         ...session.user,
// //         id: user.id,
// //       },
// //     }),
// //   },
// //   adapter: DrizzleAdapter(db),
// //   providers: [
// //     Google({
// //       clientId: env.GOOGLE_CLIENT_ID,
// //       clientSecret: env.GOOGLE_CLIENT_SECRET,
// //     }),
// //   ],
// // });

export { GET, POST } from "@/lib/server";

