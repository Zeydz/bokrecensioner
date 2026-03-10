import "./globals.css";
import Navbar from "./components/Navbar";
import SessionWrapper from "./components/SessionWrapper";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="bg-cream">
        <SessionWrapper>
          <Navbar />
          <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
