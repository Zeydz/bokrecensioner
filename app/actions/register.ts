"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

type RegisterState = {
  error?: string;
};

export async function registerAction(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  /* Validate that all fields are provided */
  if (!name || !email || !password) {
    return { error: "Alla fält måste fyllas i." };
  }

  /* Validate password length */
  if (password.length < 6) {
    return { error: "Lösenordet måste vara minst 6 tecken långt." };
  }

  /*  Check if user already exists */
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email är redan registrerad." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  redirect("/login");
}
