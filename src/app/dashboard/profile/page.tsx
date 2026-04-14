// src/app/dashboard/profile/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { JobSeekerProfileForm } from "@/components/profile/job-seeker-profile-form";

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      jobSeekerProfile: {
        include: {
          experience: true,
          education: true,
          skills: true,
        },
      },
      recruiterProfile: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      {user.role === "JOBSEEKER" ? (
        <JobSeekerProfileForm user={user} />
      ) : (
        <p className="text-sm text-gray-600">
          Recruiter profile editing is not available yet.
        </p>
      )}
    </div>
  );
}