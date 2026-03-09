"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue px-8 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 text-white font-bold text-xl tracking-wide hover:opacity-90 transition"
      >
        Bokrecensioner
      </Link>

      {/* Navigation links */}
      <div className="flex items-center gap-8">
        <Link
          href="/search"
          className="text-white hover:text-white/80 font-medium transition"
        >
          Sök böcker
        </Link>

        {/* User menu if logged in */}
        {session ? (
          <>
            <span className="text-white/60 text-sm">
              Hej, {session.user?.name}!
            </span>
            <Link
              href="/profile"
              className="text-white hover:text-white/80 font-medium transition"
            >
              Min profil
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full font-medium transition border border-white/30"
            >
              Logga ut
            </button>
          </>
        ) : (
          /* Not logged in  */
          <>
            <Link
              href="/login"
              className="text-white hover:text-white/80 font-medium transition"
            >
              Logga in
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue px-5 py-2 rounded-full font-medium hover:opacity-90 transition shadow-sm"
            >
              Registrera
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
