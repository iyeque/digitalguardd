import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link";
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  onClick?: () => void;
}

export function NavLink({
  href,
  children,
  variant = "ghost",
  className,
  activeClassName = "text-primary",
  exact = false,
  onClick,
}: NavLinkProps) {
  const [location] = useLocation();
  const isActive = exact ? location === href : location.startsWith(href);

  return (
    <Link href={href}>
      <Button
        variant={variant}
        className={cn(
          "text-foreground hover:text-primary",
          isActive && activeClassName,
          className
        )}
        onClick={onClick}
      >
        {children}
      </Button>
    </Link>
  );
}