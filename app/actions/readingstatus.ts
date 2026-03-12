"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { ReadingStatusType } from "../generated/prisma/enums";

export async function setReadingStatus(
  bookId: string,
  bookTitle: string,
  bookCover: string,
  status: ReadingStatusType,
) {
  /* Check if user is logged in */
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Inte inloggad");
  }
  const userId = session?.user.id;

  /* If the same status already exists, remove it (swap) */
  const currentStatus = await prisma.readingStatus.findFirst({
    where: {
      userId,
      bookId,
    },
  });

  if (currentStatus?.status === status) {
    await prisma.readingStatus.delete({
      where: {
        id: currentStatus.id,
      },
    });
  } else {
    /* Else - save the new status */
    await prisma.readingStatus.upsert({
      where: {
        userId_bookId: { userId, bookId },
      },
      update: { status },
      create: { userId, bookId, bookTitle, bookCover, status },
    });
  }

  /* Update page */
}
