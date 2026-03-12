"use client";
import { ReadingStatusType } from "../generated/prisma/enums";
import { setReadingStatus } from "../actions/readingstatus";
import { useRouter } from "next/navigation";

interface ReadingStatusButtonProps {
  bookId: string;
  bookTitle: string;
  bookCover: string;
  currentStatus?: ReadingStatusType | null;
}

export default function ReadingStatus({
  bookId,
  bookTitle,
  bookCover,
  currentStatus,
}: ReadingStatusButtonProps) {
  const router = useRouter();

  /* Refresh UI when choosing ReadingStatusType */
  const handleClick = async (status: ReadingStatusType) => {
    await setReadingStatus(bookId, bookTitle, bookCover, status);
    router.refresh();
  };

  /* Statuses  */
  const statuses = [
    { value: ReadingStatusType.WANT_TO_READ, label: "Vill läsa" },
    { value: ReadingStatusType.READING, label: "Läser" },
    { value: ReadingStatusType.READ, label: "Har läst" },
  ];
  return (
    <div className="flex gap-2">
      {/* Map each button to a value/label */}
      {statuses.map((s) => (
        <button
          key={s.value}
          onClick={() => handleClick(s.value)}
          className={
            s.value === currentStatus
              ? "cursor-pointer bg-navy text-cream px-4 py-2 rounded-lg text-sm font-medium"
              : "cursor-pointer bg-white text-navy px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:border-navy transition-colors"
          }
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
