import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  footer?: React.ReactNode;
  className?: string;
  featured?: boolean;
}

export function ResourceCard({
  title,
  description,
  href,
  icon,
  badge,
  footer,
  className,
  featured = false,
}: ResourceCardProps) {
  return (
    <Link href={href}>
      <Card 
        className={cn(
          "cursor-pointer hover:shadow-lg transition-shadow", 
          className
        )}
      >
        <CardContent className="pt-6">
          {(featured || badge) && (
            <div className="flex items-center gap-2 mb-4">
              {featured && <Crown className="h-5 w-5 text-yellow-500" />}
              {badge && (
                <span className="text-sm font-medium text-primary">{badge}</span>
              )}
            </div>
          )}
          {icon && <div className="mb-4">{icon}</div>}
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          {footer && <div className="text-sm text-gray-500">{footer}</div>}
        </CardContent>
      </Card>
    </Link>
  );
}