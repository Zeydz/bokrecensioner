import Link from "next/link";
import Image from "next/image";
import { Book } from "@/lib/googleBooks";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="group flex flex-col gap-3 cursor-pointer">
        {/* Cover */}
        <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 px-1">
          <h3 className="font-semibold text-navy text-sm line-clamp-2 leading-snug">
            {book.title}
          </h3>
          <p className="text-muted text-xs line-clamp-1">
            {book.authors.join(", ")}
          </p>
        </div>
      </div>
    </Link>
  );
}
