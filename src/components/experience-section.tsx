"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema, ExperienceFormValues } from "@/lib/schemas/profile-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

type Experience = {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  isCurrentPosition: boolean;
  description?: string | null;
};

type ExperienceSectionProps = {
  experiences?: Experience[];
  onUpdate: () => void;
};

export function ExperienceSection({ experiences = [], onUpdate }: ExperienceSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrentPosition: false,
      description: "",
    },
  });

  const isCurrentPosition = watch("isCurrentPosition");

  const handleAdd = () => {
    setIsAdding(true);
    reset();
  };

  const handleEdit = (experience: Experience) => {
    setIsEditing(experience.id);
    reset({
      title: experience.title,
      company: experience.company,
      location: experience.location || "",
      startDate: format(new Date(experience.startDate), "yyyy-MM-dd"),
      endDate: experience.endDate ? format(new Date(experience.endDate), "yyyy-MM-dd") : "",
      isCurrentPosition: experience.isCurrentPosition,
      description: experience.description || "",
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    reset();
  };

  const onSubmit = async (data: ExperienceFormValues) => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isEditing ? `/api/profile/experience/${isEditing}` : "/api/profile/experience";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save experience");
      }

      setSuccess("Experience saved successfully!");
      setIsAdding(false);
      setIsEditing(null);
      reset();
      onUpdate();
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    try {
      const response = await fetch(`/api/profile/experience/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete experience");
      }

      setSuccess("Experience deleted successfully!");
      onUpdate();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Work Experience</h3>
          {!isAdding && !isEditing && (
            <Button variant="outline" onClick={handleAdd}>
              Add Experience
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {(isAdding || isEditing) && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input id="company" {...register("company")} />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input 
                id="startDate" 
                type="date" 
                {...register("startDate")} 
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isCurrentPosition"
                checked={isCurrentPosition}
                onCheckedChange={(checked) => setValue("isCurrentPosition", checked)}
              />
              <Label htmlFor="isCurrentPosition">I currently work here</Label>
            </div>

            {!isCurrentPosition && (
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  {...register("endDate")} 
                  disabled={isCurrentPosition}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={4}
                placeholder="Brief description of your responsibilities and achievements..."
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update" : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((experience) => (
              <div key={experience.id} className="border rounded-md p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{experience.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {experience.company}
                      {experience.location && ` • ${experience.location}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(experience.startDate), "MMM yyyy")} - {" "}
                      {experience.isCurrentPosition
                        ? "Present"
                        : experience.endDate && format(new Date(experience.endDate), "MMM yyyy")}
                    </p>
                    {experience.description && (
                      <p className="text-sm mt-2">{experience.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(experience)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(experience.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No work experience added yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}