import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  className?: string;
}

export function NewsletterSignup({
  title = "Stay Updated",
  description = "Subscribe to our newsletter for the latest articles and updates on digital wellness.",
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    // In a real app, this would send the email to a backend
    console.log("Subscribing email:", email);
    
    // Show success message
    setIsSubmitted(true);
    setError(null);
  };

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {isSubmitted ? (
          <div className="text-green-600 mb-4">
            <p>Thank you for subscribing! We've sent a confirmation email.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">{description}</p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-describedby={error ? "email-error" : undefined}
                />
                {error && (
                  <p id="email-error" className="text-sm text-red-500 mt-1">
                    {error}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full sm:w-auto">Subscribe</Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}