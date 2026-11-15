"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

const hasScrolledHalfAScreen = () => window.scrollY > window.innerHeight / 2;

export function FloatingCTA() {
  const pathname = usePathname();

  // At the top of a page the button would sit on top of the hero's own buttons on a
  // phone, so it stays away until the visitor has scrolled half a screen.
  const shown = useSyncExternalStore(subscribeToScroll, hasScrolledHalfAScreen, () => false);

  // Don't show on quote page
  if (pathname === "/quote") return null;

  return (
    <div
      inert={!shown}
      className={cn(
        "fixed bottom-6 right-6 z-40 transition-opacity duration-300",
        shown ? "opacity-100" : "opacity-0"
      )}
    >
      <Button
        asChild
        size="lg"
        className="shadow-lg hover:shadow-xl transition-shadow rounded-full pr-5"
      >
        <Link href="/quote">
          <MessageSquare className="h-5 w-5 mr-2" />
          Get a Quote
        </Link>
      </Button>
    </div>
  );
}
