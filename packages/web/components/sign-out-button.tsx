'use client';
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import React from "react";

interface SignOutButtonProps {
  user: Session["user"];
}

export function SignOutButton({ user }: SignOutButtonProps) {
  return (
    <button
      className="items-center whitespace-nowrap shrink-0 justify-center text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50"
      onClick={() => signOut({
        callbackUrl: "/",
      })}
    >
      {user.name}
    </button>
  );
}
