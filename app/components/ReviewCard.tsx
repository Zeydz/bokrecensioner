"use client";

import { useState } from "react";
import { deleteReview } from "../actions/reviews";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRating";

/* Props */
interface ReviewCardProps {
  review: {
    id: string;
    body: string;
    rating: number;
    createdAt: Date;
    bookId: string;
    bookTitle: string;
    bookCover?: string | null;
    user: {
      id: string;
      name: string;
    };
  };
  currentUserId?: string;
}

export default function ReviewCard({ review, currentUserId }: ReviewCardProps) {
  /* State to check if user is editing or not */
  const [editing, setEditing] = useState(false);
  const isOwner = currentUserId === review.user.id;

  /* Format date */
  const formattedDate = new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(review.createdAt));

  /* If the user is editing */
  if (editing) {
    return (
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        {/* Show ReviewForm and send props, like review info and so on */}
        <ReviewForm
          bookId={review.bookId}
          bookTitle={review.bookTitle}
          bookCover={review.bookCover ?? undefined}
          existingReview={{
            id: review.id,
            body: review.body,
            rating: review.rating,
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  /* If not editing */
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-navy text-sm">{review.user.name}</p>
          <p className="text-xs text-muted">{formattedDate}</p>
        </div>
        {/* Not possible to change value of StarRating, readonly locks it */}
        <StarRating value={review.rating} readonly />
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{review.body}</p>

      {/* If the owner is of review is logged in, show edit and remove button  */}
      {isOwner && (
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-blue hover:underline cursor-pointer"
          >
            Redigera
          </button>
          <button
            onClick={() => deleteReview(review.id, review.bookId)}
            className="text-xs text-red-400 hover:underline cursor-pointer"
          >
            Ta bort
          </button>
        </div>
      )}
    </div>
  );
}
