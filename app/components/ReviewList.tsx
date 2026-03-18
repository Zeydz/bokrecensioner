"use client";

import { useState } from "react";
import ReviewCard from "./ReviewCard";

type Review = {
  id: string;
  body: string;
  rating: number;
  createdAt: Date;
  bookId: string;
  bookTitle: string;
  user: { id: string; name: string };
};

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
}

export default function ReviewList({
  reviews,
  currentUserId,
}: ReviewListProps) {
  const [sortBy, setSortBy] = useState<"newest" | "highest">("newest");

  /* Copy array */
  const sorted = [...reviews].sort((a, b) => {
    /* Sort by date. Compares A with B using Date, which creates a date with milliseconds */
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      /* Same logic as above, but this time it compares which rating is the highest */
      return b.rating - a.rating;
    }
  });

  return (
    <div>
      {/* Sorting buttons */}
      <div className="flex gap-2 mb-6">
        {/* Newest button */}
        <button
          onClick={() => setSortBy("newest")}
          className={
            sortBy === "newest"
              ? "cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium bg-navy text-cream"
              : "cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200 text-muted hover:border-navy transition-colors"
          }
        >
          Nyast
        </button>
        {/* Highest button */}
        <button
          onClick={() => setSortBy("highest")}
          className={
            sortBy === "highest"
              ? "cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium bg-navy text-cream"
              : "cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200 text-muted hover:border-navy transition-colors"
          }
        >
          Högst betyg
        </button>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {sorted.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}
