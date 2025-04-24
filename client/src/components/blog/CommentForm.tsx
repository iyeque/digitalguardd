import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface CommentFormProps {
  onSubmit: (comment: { content: string; author: string }) => void;
  className?: string;
}

export function CommentForm({ onSubmit, className }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!content.trim()) {
      setError("Please enter a comment");
      return;
    }
    
    // Submit the comment
    onSubmit({ 
      content, 
      author: author.trim() || "Anonymous" 
    });
    
    // Reset form
    setContent("");
    setAuthor("");
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <label htmlFor="comment-content" className="block text-sm font-medium mb-1">
            Your Comment
          </label>
          <textarea
            id="comment-content"
            className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            aria-describedby={error ? "comment-error" : undefined}
          />
          {error && (
            <p id="comment-error" className="text-sm text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="comment-author" className="block text-sm font-medium mb-1">
            Your Name (optional)
          </label>
          <input
            id="comment-author"
            type="text"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        
        <Button type="submit" className="mt-2">
          Post Comment
        </Button>
      </div>
    </form>
  );
}