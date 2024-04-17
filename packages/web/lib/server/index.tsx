import NextAuth, { Session } from "next-auth";
import { authConfig } from "./auth";
import { Resource } from "sst";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import db from "../mongodb";
import { cache } from "react";
import { redirect } from "next/navigation";

const {
  auth: uncachedAuth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(db),
  providers: [
    Google({
      clientId: Resource.GoogleClientId.value,
      clientSecret: Resource.GoogleClientSecret.value,
    }),
  ],
});

export { signIn, signOut, GET, POST };


export const auth = cache(async () => {
  try {
    return await uncachedAuth();
  } catch (err) {
    console.error("Error fetching session", err);
    return null;
  }
});
export const currentUser = cache(async () => {
  const sesh = await auth();
  if (!sesh?.user) redirect("/");
  return sesh.user;
});

export async function SignedIn(props: {
  children: (props: { user: Session["user"] }) => React.ReactNode;
}) {
  const sesh = await auth();
  return sesh?.user ? <>{props.children({ user: sesh.user })}</> : null;
}

export async function SignedOut(props: { children: React.ReactNode }) {
  const sesh = await auth();
  return sesh?.user ? null : <>{props.children}</>;
}

