"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSeekerProfileSchema, JobSeekerProfileFormValues } from "@/lib/schemas/profile-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ExperienceSection } from "./experience-section";
import { EducationSection } from "./education-section";

export function JobSeekerProfileForm({ user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [skills, setSkills] = useState<string[]>(
    user?.jobSeekerProfile?.skills?.map((skill) => skill.name) || []
  );
  const [newSkill, setNewSkill] = useState("");

  // Transform profile data into form values
  const defaultValues: Partial<JobSeekerProfileFormValues> = {
    title: user?.jobSeekerProfile?.title || "",
    bio: user?.jobSeekerProfile?.bio || "",
    location: user?.jobSeekerProfile?.location || "",
    contactEmail: user?.jobSeekerProfile?.contactEmail || user?.email || "",
    contactPhone: user?.jobSeekerProfile?.contactPhone || "",
    linkedin: user?.jobSeekerProfile?.linkedin || "",
    github: user?.jobSeekerProfile?.github || "",
    twitter: user?.jobSeekerProfile?.twitter || "",
    website: user?.jobSeekerProfile?.website || "",
    skills: user?.jobSeekerProfile?.skills?.map((skill) => skill.name) || [],
    isProfilePublic: user?.jobSeekerProfile?.isProfilePublic ?? true,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<JobSeekerProfileFormValues>({
    resolver: zodResolver(jobSeekerProfileSchema),
    defaultValues,
  });

  // Update form value when skills change
  useEffect(() => {
    setValue("skills", skills);
  }, [skills, setValue]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setValue("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    setValue("skills", updatedSkills);
  };

  const onSubmit = async (data: JobSeekerProfileFormValues) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile/jobseeker", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                placeholder="e.g. Frontend Developer"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell employers about yourself..."
                rows={5}
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. New York, NY"
                {...register("location")}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Skills</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" onClick={addSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 rounded-full hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {errors.skills && (
              <p className="text-sm text-red-500">{errors.skills.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <ExperienceSection 
        experiences={(user?.jobSeekerProfile?.experience || []).map((experience) => ({
          ...experience,
          isCurrentPosition: experience.current,
        }))}
        userId={user?.id} 
        onUpdate={() => router.refresh()}
      />

      <EducationSection 
        educations={user?.jobSeekerProfile?.education || []} 
        userId={user?.id} 
        onUpdate={() => router.refresh()}
      />

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contact@example.com"
                {...register("contactEmail")}
              />
              {errors.contactEmail && (
                <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                placeholder="+1 (555) 123-4567"
                {...register("contactPhone")}
              />
              {errors.contactPhone && (
                <p className="text-sm text-red-500">{errors.contactPhone.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Social & Links</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/username"
                {...register("linkedin")}
              />
              {errors.linkedin && (
                <p className="text-sm text-red-500">{errors.linkedin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                placeholder="https://github.com/username"
                {...register("github")}
              />
              {errors.github && (
                <p className="text-sm text-red-500">{errors.github.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                placeholder="@username"
                {...register("twitter")}
              />
              {errors.twitter && (
                <p className="text-sm text-red-500">{errors.twitter.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Personal Website</Label>
              <Input
                id="website"
                placeholder="https://yourwebsite.com"
                {...register("website")}
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-lg font-medium">Profile Visibility</h3>
              <p className="text-sm text-muted-foreground">
                Control who can see your profile
              </p>
            </div>
            <Switch
              checked={watch("isProfilePublic")}
              onCheckedChange={(checked) => setValue("isProfilePublic", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}