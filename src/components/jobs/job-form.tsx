"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type JobFormProps = {
  jobId?: string;
  initialData?: {
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string;
    type: string;
    remote: boolean;
    salaryMin: number | null;
    salaryMax: number | null;
    deadlineAt: Date | null;
    skills: string[];
  };
};

export function JobForm({ jobId, initialData }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [skillsInput, setSkillsInput] = useState(
    initialData?.skills?.join(", ") || ""
  );
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    company: initialData?.company || "",
    location: initialData?.location || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || "",
    type: initialData?.type || "",
    remote: initialData?.remote || false,
    salaryMin: initialData?.salaryMin?.toString() || "",
    salaryMax: initialData?.salaryMax?.toString() || "",
    deadlineAt: initialData?.deadlineAt
      ? new Date(initialData.deadlineAt).toISOString().slice(0, 10)
      : "",
  });

  const onChange = (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const skills = skillsInput
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      remote: formData.remote,
      salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
      deadlineAt: formData.deadlineAt || null,
      skills,
    };

    try {
      const response = await fetch(jobId ? `/api/jobs/${jobId}` : "/api/jobs", {
        method: jobId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save job");
      }

      setSuccess(jobId ? "Job updated successfully." : "Job created successfully.");
      router.push("/dashboard/jobs");
      router.refresh();
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
    <form onSubmit={onSubmit} className="space-y-6">
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

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" value={formData.title} onChange={onChange("title")} required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={formData.company} onChange={onChange("company")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={formData.location} onChange={onChange("location")} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Employment Type</Label>
            <Input id="type" value={formData.type} onChange={onChange("type")} required />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="remote"
              checked={formData.remote}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, remote: checked }))
              }
            />
            <Label htmlFor="remote">Remote role</Label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Minimum Salary</Label>
              <Input
                id="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={onChange("salaryMin")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Maximum Salary</Label>
              <Input
                id="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={onChange("salaryMax")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadlineAt">Application Deadline</Label>
            <Input
              id="deadlineAt"
              type="date"
              value={formData.deadlineAt}
              onChange={onChange("deadlineAt")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              value={skillsInput}
              onChange={(event) => setSkillsInput(event.target.value)}
              placeholder="React, TypeScript, SQL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={onChange("description")}
              rows={5}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={onChange("requirements")}
              rows={4}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : jobId ? "Update Job" : "Create Job"}
      </Button>
    </form>
  );
}
