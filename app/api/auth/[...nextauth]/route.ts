import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

/* NextAuth handles both GET and POST requests */
export { handler as GET, handler as POST };
