import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

/* Props to be able to get the searchparams */
type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ProfilePage({ searchParams }: Props) {
  /* Get session */
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  /* Get page search params, for example if we paginate to page 2, pageParam will be 2 */
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const perPage = 5;

  /* Retrieve review, readingStatus and totalReviews information */
  const [reviews, readingStatus, totalReviews] = await Promise.all([
    prisma.review.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.readingStatus.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.count({
      where: { userId: session.user.id },
    }),
  ]);

  /* Round using ceil */
  const totalPages = Math.ceil(totalReviews / perPage);

  return (
    <div className="max-w-4xl mx-auto py-12 px-0 sm:px-6">
      {/* User information */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center text-cream text-2xl font-bold shrink-0">
            {session.user.name?.charAt(0).toUpperCase()}
          </div>
          {/* Name */}
          <div>
            <h1 className="text-2xl font-bold text-navy">
              {session.user.name}
            </h1>
            {/* Email */}
            <p className="text-muted text-sm">{session.user.email}</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="flex gap-8 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold text-navy">{totalReviews}</p>
            <p className="text-sm text-muted">Recensioner</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-navy">
              {readingStatus.length}
            </p>
            <p className="text-sm text-muted">Böcker i läslistan</p>
          </div>
        </div>
      </div>

      {/* My reviews */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-navy mb-4">
          Mina recensioner
        </h2>
        {reviews.length === 0 ? (
          <p className="text-muted text-sm">
            Du har inte skrivit några recensioner ännu.
          </p>
        ) : (
          /* If reviews exist */
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <Link
                    href={`/books/${review.bookId}`}
                    className="font-medium text-navy hover:underline"
                  >
                    {review.bookTitle}
                  </Link>
                  <span className="text-yellow-400 text-sm">
                    {/* Show the amount of stars based on rating-value */}
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {review.body}
                </p>
              </div>
            ))}

            {/* Show the pagination buttons */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                {page > 1 && (
                  <Link
                    href={`/profile?page=${page - 1}`}
                    className="px-4 py-2 text-sm rounded-full border border-gray-200 text-navy hover:border-navy transition-colors"
                  >
                    ← Föregående
                  </Link>
                )}
                <span className="text-sm text-muted">
                  {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/profile?page=${page + 1}`}
                    className="px-4 py-2 text-sm rounded-full border border-gray-200 text-navy hover:border-navy transition-colors"
                  >
                    Nästa →
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* My reading list */}
      <section>
        <h2 className="text-xl font-semibold text-navy mb-4">Min läslista</h2>
        {readingStatus.length === 0 ? (
          <p className="text-muted text-sm">
            Du har inte lagt till några böcker ännu.
          </p>
        ) : (
          /* If there are books: */
          <div className="space-y-6">
            {[
              { status: "WANT_TO_READ", label: "Vill läsa" },
              { status: "READING", label: "Läser" },
              { status: "READ", label: "Har läst" },
            ].map(({ status, label }) => {
              const books = readingStatus.filter((r) => r.status === status);
              if (books.length === 0) {
                return null;
              }
              return (
                <div key={status}>
                  <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                    {label}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {/* Map each book with key, booktitle and cover */}
                    {books.map((book) => (
                      <Link key={book.id} href={`/books/${book.bookId}`}>
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          {book.bookCover && (
                            <img
                              src={book.bookCover}
                              alt={book.bookTitle}
                              className="w-full h-36 object-cover"
                            />
                          )}
                          <p className="text-xs text-navy font-medium p-2 line-clamp-2">
                            {book.bookTitle}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
