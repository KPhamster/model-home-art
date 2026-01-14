"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingCTA() {
  const pathname = usePathname();
  
  // Don't show on quote page
  if (pathname === "/quote") return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
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
