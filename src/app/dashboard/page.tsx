// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const isJobSeeker = session.user.role === "JOBSEEKER";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>
              Complete your profile to increase visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Profile Completion</span>
                <span className="font-bold">0%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-0"></div>
              </div>
              <Button asChild>
                <Link href="/dashboard/profile">Complete Your Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isJobSeeker ? "Job Applications" : "Job Postings"}
            </CardTitle>
            <CardDescription>
              {isJobSeeker
                ? "Track your submitted applications"
                : "Manage your job postings"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">
                {isJobSeeker
                  ? "You haven't applied to any jobs yet"
                  : "You haven't posted any jobs yet"}
              </p>
              <Button asChild>
                <Link href={isJobSeeker ? "/jobs" : "/dashboard/jobs/create"}>
                  {isJobSeeker ? "Browse Jobs" : "Post a Job"}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}