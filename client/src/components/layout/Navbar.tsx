import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold text-primary">Digital Guardian</a>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/">
                  <Button variant="ghost">Home</Button>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about">
                  <Button variant="ghost">About</Button>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-48 p-2">
                    <Link href="/resources/blog">
                      <Button variant="ghost" className="w-full justify-start">Blog</Button>
                    </Link>
                    <Link href="/resources/videos">
                      <Button variant="ghost" className="w-full justify-start">Videos</Button>
                    </Link>
                    <Link href="/resources/games">
                      <Button variant="ghost" className="w-full justify-start">Games</Button>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/support">
                  <Button variant="ghost">Support</Button>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact">
                  <Button variant="default">Contact Us</Button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <Button variant="ghost" className="w-full text-left">Home</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="w-full text-left">About</Button>
            </Link>
            <Link href="/resources/blog">
              <Button variant="ghost" className="w-full text-left">Blog</Button>
            </Link>
            <Link href="/resources/videos">
              <Button variant="ghost" className="w-full text-left">Videos</Button>
            </Link>
            <Link href="/resources/games">
              <Button variant="ghost" className="w-full text-left">Games</Button>
            </Link>
            <Link href="/support">
              <Button variant="ghost" className="w-full text-left">Support</Button>
            </Link>
            <Link href="/contact">
              <Button variant="default" className="w-full">Contact Us</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
