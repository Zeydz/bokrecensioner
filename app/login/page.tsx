"use client";

import { useActionState } from "react";
import { loginAction } from "@/app//actions/login";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Logga in</h1>

        {/* Error message */}
        {state?.error && (
          <p className="bg-red-100 text-red-600 text-sm rounded-lg px-4 py-3 mb-4 text-center">
            {state.error}
          </p>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="din@email.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-mirage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Lösenord</label>
            <input
              name="password"
              type="password"
              required
              placeholder="Minst 6 tecken"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-mirage"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer not-first:bg-blue text-white rounded-full py-2 font-medium hover:opacity-90 transition disabled:opacity-50 mt-2"
          >
            {isPending ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Har du inget konto?{" "}
          <Link
            href="/register"
            className="text-blue-mirage font-medium hover:underline"
          >
            Skapa konto här
          </Link>
        </p>
      </div>
    </div>
  );
}
