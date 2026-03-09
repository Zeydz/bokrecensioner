import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

type LoginState = {
  error?: string;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  /*  Check if email and password are provided */
  if (!email || !password) {
    return { error: "Email och lösenord krävs." };
  }

  try {
    /* Check credentials. Uses signIn method using credentials provider in lib/auth.ts */
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    return { error: "Fel email eller lösenord." };
  }
  redirect("/");
}
