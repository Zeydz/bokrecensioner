"use client";

import { useActionState, useEffect, useState } from "react";
import { createReview, updateReview } from "@/app/actions/reviews";
import StarRating from "./StarRating";

/* Props */
interface ReviewFormProps {
  bookId: string;
  bookTitle: string;
  bookCover?: string;
  existingReview?: {
    id: string;
    body: string;
    rating: number;
  };
  onCancel?: () => void;
}

export default function ReviewForm({
  bookId,
  bookTitle,
  bookCover,
  existingReview,
  onCancel,
}: ReviewFormProps) {
  /* Set rating-value and check if user is editing or not */
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const isEdit = !!existingReview;

  /* Defines if formAction should be updateReview or createReview */
  const action = isEdit ? updateReview : createReview;
  const [state, formAction, pending] = useActionState(action, null);

  /* Remove form when updated */
  useEffect(() => {
    if (state?.success && onCancel) onCancel();
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="bookId" value={bookId} />
      <input type="hidden" name="bookTitle" value={bookTitle} />
      <input type="hidden" name="bookCover" value={bookCover ?? ""} />
      <input type="hidden" name="rating" value={rating} />

      {/* Send reviewId if editing. Hidden element */}
      {isEdit && (
        <input type="hidden" name="reviewId" value={existingReview?.id} />
      )}

      {state?.error && (
        <p className="bg-red-50 text-red-500 text-sm rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      {/* Stars */}
      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Betyg
        </label>
        <StarRating value={rating} onChange={setRating} size="sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Din recension
        </label>
        {/* Body - defaultValue is the already existing value */}
        <textarea
          name="body"
          defaultValue={existingReview?.body}
          rows={4}
          placeholder="Vad tyckte du om boken?"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue resize-none"
        />
      </div>

      {/* Change statet of button when submitting */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending || rating === 0}
          className="bg-navy text-cream px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
        >
          {pending
            ? "Sparar..."
            : isEdit
              ? "Spara ändringar"
              : "Publicera recension"}
        </button>
        {/* Cancel button */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-white bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"
          >
            Avbryt
          </button>
        )}
      </div>
    </form>
  );
}
