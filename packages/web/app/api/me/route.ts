import { authConfig } from "@/lib/server/auth";
import { type NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const token = await NextAuth(authConfig).auth();

  return new Response(
    JSON.stringify({
      message: "OK",
      data: { hello: token ?? "no token" },
    }),
    { status: 200 }
  );
}
