"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
};

export function AdminJobModeration({ jobs }: { jobs: Job[] }) {
  const [removing, setRemoving] = useState<string | null>(null);

  const removeJob = async (jobId: string) => {
    setRemoving(jobId);

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove job");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error removing job:", error);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Moderation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{job.title}</p>
                <p className="text-xs text-muted-foreground">
                  {job.company} • {job.location}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeJob(job.id)}
                disabled={removing === job.id}
              >
                {removing === job.id ? "Removing..." : "Remove"}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
