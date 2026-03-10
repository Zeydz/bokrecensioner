import { getBookById } from "@/lib/googleBooks";
import { BookOpen, Calendar, Tag } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookPage({ params }: Props) {
  const { id } = await params;
  const book = await getBookById(id);

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
        <p className="text-muted text-sm">
          Inga recensioner ännu. Bli den första!
        </p>
      </div>
    </div>
  );
}
