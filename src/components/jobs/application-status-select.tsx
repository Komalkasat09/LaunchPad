"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = ["PENDING", "REVIEWED", "INTERVIEW", "REJECTED", "HIRED"];

export function ApplicationStatusSelect({
  applicationId,
  initialStatus,
}: {
  applicationId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isSaving, setIsSaving] = useState(false);

  const updateStatus = async () => {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        className="rounded-md border border-input bg-background px-2 py-1 text-sm"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Button type="button" variant="secondary" size="sm" onClick={updateStatus} disabled={isSaving}>
        {isSaving ? "Saving" : "Update"}
      </Button>
    </div>
  );
}
