import Link from "next/link";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prisma = new PrismaClient();

export default async function ApplicationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const isRecruiter = session.user.role === "RECRUITER";

  const applications = await prisma.application.findMany({
    where: isRecruiter
      ? { job: { recruiterId: session.user.id } }
      : { applicantId: session.user.id },
    include: {
      job: true,
      applicant: { select: { name: true, email: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Applications</h1>
      {applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              No applications yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <CardTitle>{application.job.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {application.job.company} • {application.job.location}
                </div>
                <div className="text-sm">
                  Status: {application.status}
                </div>
                {isRecruiter && (
                  <div className="text-sm text-muted-foreground">
                    Applicant: {application.applicant?.name || "Unknown"} ({application.applicant?.email})
                  </div>
                )}
                <Link
                  href={`/jobs/${application.jobId}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View job
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
