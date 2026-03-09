import "next-auth";

/* https://next-auth.js.org/getting-started/typescript declared here */
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
        }
    }
}