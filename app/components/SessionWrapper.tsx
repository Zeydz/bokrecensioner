"use client";

import { SessionProvider } from "next-auth/react";

/* Wrapper component to provide session context to client components */
export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
