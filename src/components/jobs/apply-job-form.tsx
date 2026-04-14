"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ApplyJobForm({ jobId }: { jobId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const onSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId, resumeUrl, coverLetter }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit application");
      }

      setSuccess("Application submitted successfully.");
      setResumeUrl("");
      setCoverLetter("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="resumeUrl">Resume URL</Label>
        <Input
          id="resumeUrl"
          value={resumeUrl}
          onChange={(event) => setResumeUrl(event.target.value)}
          placeholder="https://"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover Letter</Label>
        <Textarea
          id="coverLetter"
          value={coverLetter}
          onChange={(event) => setCoverLetter(event.target.value)}
          rows={4}
        />
      </div>
      <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Apply now"}
      </Button>
    </div>
  );
}
