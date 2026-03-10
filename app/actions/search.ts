"use server";

import { Book, searchBooks } from "@/lib/googleBooks";

type SearchState = {
  books: Book[];
  query: string;
  error?: string;
};

/* Search action for handling book searches */
export async function searchAction(
  prevState: SearchState,
  formData: FormData,
): Promise<SearchState> {
  /* Save the search query */
  const query = formData.get("query") as string;

  /* Validate the search query */
  if (!query.trim()) {
    return { books: [], query: "" };
  }

  /* Search for books */
  try {
    const books = await searchBooks(query);
    return { books, query };
  } catch {
    return { books: [], query, error: "Något gick fel, försök igen." };
  }
}
