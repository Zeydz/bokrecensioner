"use server";

import prisma from "@/lib/prisma";

export async function getRecentBooks() {
  const recentBooks = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    distinct: ["bookId"],
    select: {
      bookId: true,
      bookTitle: true,
      bookCover: true,
    },
  });
  return recentBooks;
}
