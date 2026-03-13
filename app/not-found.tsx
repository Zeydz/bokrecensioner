import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-8xl font-bold text-blue mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-navy mb-3">
        Sidan hittades inte
      </h2>
      <p className="text-muted text-sm mb-8 max-w-sm">
        Boken du letar efter verkar ha försvunnit från hyllan. Gå tillbaka och
        fortsätt utforska!
      </p>
      <Link
        href="/"
        className="bg-navy text-cream px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Tillbaka till startsidan
      </Link>
    </div>
  );
}
