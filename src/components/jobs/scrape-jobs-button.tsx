"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ScrapeJobsButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/scrape", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to refresh jobs");
      }
      router.refresh();
    } catch (error) {
      console.error("Error refreshing jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button type="button" variant="secondary" onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Refreshing..." : "Refresh internships"}
    </Button>
  );
}
