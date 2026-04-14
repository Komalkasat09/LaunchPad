import { z } from "zod";

export const jobSeekerProfileSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  bio: z.string().min(10, "Bio should be at least 10 characters").max(1000, "Bio should be less than 1000 characters"),
  location: z.string().min(1, "Location is required"),
  contactEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  contactPhone: z.string().optional().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  twitter: z.string().optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  isProfilePublic: z.boolean().default(true),
});

export const recruiterProfileSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  bio: z.string().min(10, "Bio should be at least 10 characters").max(1000, "Bio should be less than 1000 characters"),
  location: z.string().min(1, "Location is required"),
  company: z.string().min(1, "Company name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().optional().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  isProfilePublic: z.boolean().default(true),
});

export const experienceSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrentPosition: z.boolean().default(false),
  description: z.string().max(500, "Description should be less than 500 characters").optional(),
});

export const educationSchema = z.object({
  school: z.string().min(1, "School name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrentlyStudying: z.boolean().default(false),
  description: z.string().max(500, "Description should be less than 500 characters").optional(),
});

export type JobSeekerProfileFormValues = z.infer<typeof jobSeekerProfileSchema>;
export type RecruiterProfileFormValues = z.infer<typeof recruiterProfileSchema>;
export type ExperienceFormValues = z.infer<typeof experienceSchema>;
export type EducationFormValues = z.infer<typeof educationSchema>;