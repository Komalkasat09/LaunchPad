// src/schemas/profile-schema.ts
import { z } from "zod";

// Base profile schema with common fields
const baseProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  profilePicture: z.string().url().optional(),
});

// Job seeker specific fields
export const jobSeekerProfileSchema = baseProfileSchema.extend({
  title: z.string().max(100).optional(),
  skills: z.array(z.string()).optional(),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      location: z.string().optional(),
      startDate: z.date(),
      endDate: z.date().optional(),
      current: z.boolean().default(false),
      description: z.string().optional(),
    })
  ).optional(),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string(),
      startDate: z.date(),
      endDate: z.date().optional(),
      current: z.boolean().default(false),
      description: z.string().optional(),
    })
  ).optional(),
  resumeUrl: z.string().url().optional(),
  openToWork: z.boolean().default(true),
  preferredJobTypes: z.array(z.string()).optional(),
  preferredLocations: z.array(z.string()).optional(),
  salary: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().default("USD"),
  }).optional(),
});

// Recruiter specific fields
export const recruiterProfileSchema = baseProfileSchema.extend({
  company: z.string().max(100).optional(),
  industry: z.string().max(100).optional(),
  website: z.string().url().optional(),
  companySize: z.enum([
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001-5000",
    "5001-10000",
    "10001+"
  ]).optional(),
  companyLogo: z.string().url().optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    facebook: z.string().url().optional(),
  }).optional(),
});

// Form submission schema for updating job seeker profile
export const jobSeekerProfileFormSchema = jobSeekerProfileSchema.extend({
  // Convert date objects to strings for form handling
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().optional(),
      current: z.boolean().default(false),
      description: z.string().optional(),
    })
  ).optional(),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      current: z.boolean().default(false),
      description: z.string().optional(),
    })
  ).optional(),
});

// Form submission schema for updating recruiter profile
export const recruiterProfileFormSchema = recruiterProfileSchema;

// Type definitions based on schemas
export type JobSeekerProfile = z.infer<typeof jobSeekerProfileSchema>;
export type RecruiterProfile = z.infer<typeof recruiterProfileSchema>;
export type JobSeekerProfileForm = z.infer<typeof jobSeekerProfileFormSchema>;
export type RecruiterProfileForm = z.infer<typeof recruiterProfileFormSchema>;