"use client";

import { X } from "lucide-react";
import { useState } from "react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4">
      <div className="container-wide flex items-center justify-center gap-2 text-sm">
        <p className="text-center">
          <span className="font-medium">Budget-friendly custom framing</span>
          <span className="mx-2 hidden sm:inline">•</span>
          <span className="hidden sm:inline">Delivery / Shipping / Installation</span>
          <span className="mx-2 hidden md:inline">•</span>
          <span className="hidden md:inline">United States</span>
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-white/10 rounded transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
