"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  /* Runs when user submits login-form */
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    /* Get the submitted data */
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    /* If email or password doesn't match */
    if (!email || !password) {
      setError("Email och lösenord krävs.");
      setIsPending(false);
      return;
    }

    /* Login user */
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsPending(false);

    if (!result?.ok) {
      setError("Fel email eller lösenord.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-navy text-center mb-6">
          Logga in
        </h1>

        {/* Error message */}
        {error && (
          <p className="bg-red-100 text-red-600 text-sm rounded-lg px-4 py-3 mb-4 text-center">
            {error}
          </p>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="din@email.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue shadow-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Lösenord</label>
            <input
              name="password"
              type="password"
              required
              placeholder="Minst 6 tecken"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue shadow-sm"
            />
          </div>

          {/* submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer bg-navy text-cream rounded-full py-2 font-medium hover:opacity-90 transition disabled:opacity-50 mt-2"
          >
            {isPending ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        {/* No account? */}
        <p className="text-center text-sm text-muted mt-6">
          Har du inget konto?{" "}
          <Link
            href="/register"
            className="text-blue font-medium hover:underline"
          >
            Skapa konto här
          </Link>
        </p>
      </div>
    </div>
  );
}
