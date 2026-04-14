import Link from "next/link";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prisma = new PrismaClient();

export default async function DashboardJobsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "RECRUITER") {
    redirect("/dashboard");
  }

  const jobs = await prisma.job.findMany({
    where: { recruiterId: session.user.id },
    orderBy: { postedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Jobs</h1>
        <Link
          href="/dashboard/jobs/create"
          className="text-sm font-medium text-primary hover:underline"
        >
          Post a Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              You have not posted any jobs yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {job.company} • {job.location}
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/dashboard/jobs/${job.id}/applications`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Applications
                  </Link>
                  <Link
                    href={`/dashboard/jobs/${job.id}/edit`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
