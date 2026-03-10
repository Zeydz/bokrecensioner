/* GOOGLE DOCUMENTATION FOR BOOKS:
https://developers.google.com/books/docs/v1/using
*/
const GOOGLE_BOOKS_API_KEY = "https://www.googleapis.com/books/v1/volumes";

export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  coverImage: string;
  publishedDate: string;
  pageCount: number;
  categories: string[];
}

/* Search for books based on a query, max 12 */
export async function searchBooks(query: string): Promise<Book[]> {
  const response = await fetch(
    `${GOOGLE_BOOKS_API_KEY}?q=${encodeURIComponent(query)}&maxResults=12&key=${process.env.GOOGLE_BOOKS_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books.");
  }

  const data = await response.json();

  if (!data.items) {
    return [];
  }

  /* Map the API response to the Book interface */
  return data.items.map((item: any) => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors || [],
    description: item.volumeInfo.description || "Ingen beskrivning tillgänglig",
    coverImage:
      item.volumeInfo.imageLinks?.thumbnail ||
      "https://placehold.net/default.png",
    publishedDate: item.volumeInfo.publishedDate || "Okänt år",
    pageCount: item.volumeInfo.pageCount ?? 0,
    categories: item.volumeInfo.categories ?? [],
  }));
}

/*  Get details of a specific book */
export async function getBookById(id: string): Promise<Book> {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${id}?key=${process.env.GOOGLE_BOOKS_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch book details.");
  }

  const item = await response.json();

  return {
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors || [],
    description: item.volumeInfo.description || "Ingen beskrivning tillgänglig",
    coverImage:
      item.volumeInfo.imageLinks?.thumbnail ||
      "https://placehold.net/default.png",
    publishedDate: item.volumeInfo.publishedDate || "Okänt år",
    pageCount: item.volumeInfo.pageCount ?? 0,
    categories: item.volumeInfo.categories ?? [],
  };
}
