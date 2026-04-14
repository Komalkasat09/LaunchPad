"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type SaveJobButtonProps = {
  jobId: string;
  initialSaved: boolean;
};

export function SaveJobButton({ jobId, initialSaved }: SaveJobButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSave = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/saved/${jobId}`, {
        method: saved ? "DELETE" : "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update saved job");
      }

      setSaved(!saved);
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button type="button" variant={saved ? "secondary" : "default"} onClick={toggleSave} disabled={isLoading}>
      {isLoading ? "Saving..." : saved ? "Saved" : "Save job"}
    </Button>
  );
}
