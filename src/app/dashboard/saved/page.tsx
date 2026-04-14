import Link from "next/link";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prisma = new PrismaClient();

export default async function SavedJobsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "JOBSEEKER") {
    redirect("/dashboard");
  }

  const savedJobs = await prisma.savedOpportunity.findMany({
    where: { userId: session.user.id },
    include: { job: true },
    orderBy: { savedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Saved Jobs</h1>
      {savedJobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              You have not saved any jobs yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedJobs.map((saved) => (
            <Card key={saved.id}>
              <CardHeader>
                <CardTitle>{saved.job.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {saved.job.company} • {saved.job.location}
                </div>
                <Link
                  href={`/jobs/${saved.job.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
