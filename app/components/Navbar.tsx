"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { BookOpen, Menu, X, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-navy border-b border-white/5 px-8 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-white font-semibold text-lg tracking-tight">
            Bokrecensioner
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          {session ? (
            <>
              <span className="text-white text-sm">
                Hej {session.user?.name}!
              </span>
              <Link
                href="/profile"
                className="text-white hover:text-white/50 text-sm font-medium transition flex items-center gap-2"
              >
                <User size={15} />
                Min profil
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-white hover:text-white/50 text-sm font-medium transition cursor-pointer"
              >
                <LogOut size={15} />
                Logga ut
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white hover:text-white/50 text-sm font-medium transition"
              >
                Logga in
              </Link>
              <Link
                href="/register"
                className="bg-blue text-white text-sm px-5 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Registrera
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white hover:text-white/50 transition cursor-pointer"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden max-w-6xl mx-auto mt-4 pt-4 border-t border-white/10 flex flex-col gap-5 pb-2 transition">
          {session ? (
            <>
              <span className="text-white text-sm">
                Hej {session.user?.name}!
              </span>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-white/50 text-sm font-medium transition flex items-center gap-2"
              >
                <User size={15} />
                Min profil
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="text-white hover:text-white/50 text-sm font-medium transition flex items-center gap-2 cursor-pointer w-fit"
              >
                <LogOut size={15} />
                Logga ut
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-white/50 text-sm font-medium transition"
              >
                Logga in
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-blue text-white text-sm px-5 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity w-fit"
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
