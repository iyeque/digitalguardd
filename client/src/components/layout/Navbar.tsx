import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { NavLink } from "./NavLink";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
            Digital Guardian
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavLink href="/" exact>
                  Home
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink href="/about">
                  About
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary">Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-48 p-2 bg-popover">
                    <Link href="/resources/blog">
                      <Button variant="ghost" className="w-full justify-start text-popover-foreground hover:text-primary">Blog</Button>
                    </Link>
                    <Link href="/resources/videos">
                      <Button variant="ghost" className="w-full justify-start text-popover-foreground hover:text-primary">Videos</Button>
                    </Link>
                    <Link href="/resources/games">
                      <Button variant="ghost" className="w-full justify-start text-popover-foreground hover:text-primary">Games</Button>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink href="/support">
                  Support
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <ModeToggle />
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink href="/contact" variant="default" className="text-primary-foreground">
                  Contact Us
                </NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation Button */}
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <Button 
            variant="ghost" 
            className="text-foreground hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
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
        <div className="md:hidden bg-background border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink href="/" variant="ghost" className="w-full justify-start" exact onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink href="/about" variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
              About
            </NavLink>
            <NavLink href="/resources/blog" variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
              Blog
            </NavLink>
            <NavLink href="/resources/videos" variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
              Videos
            </NavLink>
            <NavLink href="/resources/games" variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
              Games
            </NavLink>
            <NavLink href="/support" variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
              Support
            </NavLink>
            <NavLink href="/contact" variant="default" className="w-full justify-start mt-4" onClick={() => setIsOpen(false)}>
              Contact Us
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}