"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue px-8 py-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-bold text-xl tracking-wide hover:opacity-90 transition"
        >
          Bokrecensioner
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/search"
            className="text-white hover:text-white/80 font-medium transition"
          >
            Sök böcker
          </Link>
          {/* If logged in, show logout button and profile */}
          {session ? (
            <>
              <Link
                href="/profile"
                className="text-white hover:text-white/80 font-medium transition"
              >
                Min profil
              </Link>
              <span className="text-white/60 text-sm">
                Hej, {session.user?.name}!
              </span>
              <button
                onClick={() => signOut()}
                className="cursor-pointer bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full font-medium transition border border-white/30"
              >
                Logga ut
              </button>
            </>
          ) : (
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

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white cursor-pointer"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 pb-2 border-t border-white/20 pt-4">
          <Link
            href="/search"
            onClick={() => setMenuOpen(false)}
            className="text-white hover:text-white/80 font-medium transition"
          >
            Sök böcker
          </Link>

          {/* If logged in, show logout button and profile */}
          {session ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-white/80 font-medium transition"
              >
                Min profil
              </Link>
              <span className="text-white/60 text-sm">
                Hej, {session.user?.name}!
              </span>
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="cursor-pointer bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full font-medium transition border border-white/30 w-fit"
              >
                Logga ut
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-white/80 font-medium transition"
              >
                Logga in
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-white text-blue px-5 py-2 rounded-full font-medium hover:opacity-90 transition shadow-sm w-fit"
              >
                Registrera
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
