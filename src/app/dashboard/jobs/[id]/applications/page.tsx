import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationStatusSelect } from "@/components/jobs/application-status-select";

const prisma = new PrismaClient();

export default async function JobApplicationsPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "RECRUITER") {
    redirect("/dashboard");
  }

  const job = await prisma.job.findFirst({
    where: { id: params.id, recruiterId: session.user.id },
  });

  if (!job) {
    redirect("/dashboard/jobs");
  }

  const applications = await prisma.application.findMany({
    where: { jobId: params.id },
    include: { applicant: { select: { name: true, email: true } } },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Applications for {job.title}</h1>
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
                <CardTitle>
                  {application.applicant?.name || "Applicant"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {application.applicant?.email}
                </p>
                {application.resumeUrl && (
                  <a
                    href={application.resumeUrl}
                    className="text-sm font-medium text-primary hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View resume
                  </a>
                )}
                {application.coverLetter && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {application.coverLetter}
                  </p>
                )}
                <ApplicationStatusSelect
                  applicationId={application.id}
                  initialStatus={application.status}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
