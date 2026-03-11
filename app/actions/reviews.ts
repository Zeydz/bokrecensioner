"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

/* Return types */
type ReviewActionResult =
  | { error?: string; success?: boolean }
  | null
  | undefined;

export async function createReview(
  prevState: unknown,
  formData: FormData,
): Promise<ReviewActionResult> {
  /* Check if user is logged in */
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Inte inloggad");
  }

  /* Grab data from form*/
  const bookId = formData.get("bookId") as string;
  const bookTitle = formData.get("bookTitle") as string;
  const bookCover = formData.get("bookCover") as string;
  const body = formData.get("body") as string;
  const rating = parseInt(formData.get("rating") as string);

  /* Validate data*/
  if (body.trim().length < 1) {
    return { error: "Innehållet får inte vara tomt." };
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Betyg måste innehålla ett nummer" };
  }
  /* Check if user already reviewed book */
  const existing = await prisma.review.findFirst({
    where: { bookId, userId: session.user.id },
  });

  if (existing) {
    return { error: "Du har redan recenserat den här boken." };
  }

  /* Save in database */
  await prisma.review.create({
    data: {
      userId: session.user.id,
      bookId,
      bookTitle,
      bookCover,
      body,
      rating,
    },
  });

  /* Update page  */
  revalidatePath(`/books/${bookId}`);

  return { success: true };
}

export async function deleteReview(reviewId: string, bookId: string) {
  /* Check if user is logged in */
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Inte inloggad");
  }

  /* Get review from database */
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
    },
  });

  /* Check if user owns the review */
  if (!review || review.userId !== session.user.id) {
    return { error: "Inte behörig" };
  }
  /* Remove review */
  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  /* Update page */
  revalidatePath(`/books/${bookId}`);
}

export async function updateReview(
  prevState: unknown,
  formData: FormData,
): Promise<ReviewActionResult> {
  /* Check if user is logged in */
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Inte inloggad");
  }

  /* Get data from form */
  const reviewId = formData.get("reviewId") as string;
  const bookId = formData.get("bookId") as string;
  const body = formData.get("body") as string;
  const rating = parseInt(formData.get("rating") as string);

  /* Validate data*/
  if (body.trim().length < 1) {
    return { error: "Innehållet får inte vara tomt." };
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Betyg måste innehålla ett nummer" };
  }
  /* Get review + check if user owns it  */
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
    },
  });

  /* Check if user owns the review */
  if (!review || review.userId !== session.user.id) {
    return { error: "Inte behörig" };
  }
  /*  Update review */
  await prisma.review.update({
    where: { id: reviewId },
    data: {
      body,
      rating,
    },
  });
  /*  Update page */
  revalidatePath(`/books/${bookId}`);
  return { success: true };
}
