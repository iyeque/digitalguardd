import React from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  className,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div 
      className={cn("flex items-center gap-1", className)}
      role="img" 
      aria-label={`Rating: ${rating} out of ${maxRating} stars`}
    >
      {[...Array(maxRating)].map((_, i) => (
        <button
          key={i}
          type="button"
          className={cn(
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
            interactive ? "cursor-pointer" : "cursor-default"
          )}
          onClick={() => interactive && onChange?.(i + 1)}
          disabled={!interactive}
          aria-label={`${i + 1} star${i !== 0 ? "s" : ""}`}
          aria-pressed={i < rating}
        >
          <svg 
            className={cn(
              sizeClasses[size], 
              i < rating ? "text-yellow-500" : "text-gray-300"
            )} 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}