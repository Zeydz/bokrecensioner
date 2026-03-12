import ReadingStatus from "@/app/components/ReadingStatusButton";
import ReviewCard from "@/app/components/ReviewCard";
import ReviewForm from "@/app/components/ReviewForm";
import { authOptions } from "@/lib/auth";
import { getBookById } from "@/lib/googleBooks";
import prisma from "@/lib/prisma";
import { BookOpen, Calendar, Tag } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookPage({ params }: Props) {
  /* Get info */
  const { id } = await params;
  const book = await getBookById(id);
  const session = await getServerSession(authOptions);

  /* Retrieve review and readingStatus information */
  const [reviews, readingStatus] = await Promise.all([
    prisma.review.findMany({
      where: { bookId: id },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.readingStatus.findFirst({
      where: { bookId: id, userId: session?.user?.id ?? "" },
    }),
  ]);

  const userReview = reviews.find((r) => r.user.id === session?.user?.id);

  /* 404 */
  if (!book) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Cover */}
        <div className="shrink-0 flex justify-center md:justify-start">
          <div className="relative w-48 h-72 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Book info */}
        <div className="flex flex-col gap-4 flex-1">
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight leading-tight mb-2">
              {book.title}
            </h1>
            <p className="text-muted text-lg">{book.authors.join(", ")}</p>
            {session?.user && (
              <ReadingStatus
                bookId={book.id}
                bookTitle={book.title}
                bookCover={book.coverImage}
                currentStatus={readingStatus?.status ?? null}
              />
            )}
          </>
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            {book.publishedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {book.publishedDate}
              </span>
            )}
            {book.pageCount > 0 && (
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} />
                {book.pageCount} sidor
              </span>
            )}
            {book.categories.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Tag size={14} />
                {book.categories[0]}
              </span>
            )}
          </div>
          {/* Description - dangerouslySetInnetHTML removes the p-tags, had to search this up */}
          {book.description && (
            <p
              className="text-gray-600 text-sm leading-relaxed max-w-xl line-clamp-6"
              dangerouslySetInnerHTML={{ __html: book.description }}
            />
          )}
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-gray-200 my-10" />
      {/* Reviews section - fylls i senare */}
      <div>
        <h2 className="text-xl font-semibold text-navy mb-6">Recensioner</h2>
        {/* Review form, check if user already made a review */}
        {session?.user ? (
          userReview ? (
            <p className="text-muted text-sm mb-6">
              Du har redan recenserat den här boken.
            </p>
          ) : (
            <div className="mb-8">
              <ReviewForm
                bookId={book.id}
                bookTitle={book.title}
                bookCover={book.coverImage}
              />
            </div>
          )
        ) : (
          /* If user doesn't have a session, ask them to Log in */
          <p className="text-muted text-sm mb-6">
            <a href="/login" className="text-blue hover:underline">
              Logga in
            </a>{" "}
            för att skriva en recension.
          </p>
        )}

        {/* Show reviews */}
        {reviews.length === 0 ? (
          <p className="text-muted text-sm">
            Inga recensioner ännu. Bli den första!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={session?.user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
