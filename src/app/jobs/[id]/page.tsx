import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { ApplyJobForm } from "@/components/jobs/apply-job-form";
import { auth } from "@/auth";

const prisma = new PrismaClient();

function formatSalary(min?: number | null, max?: number | null) {
  if (min == null && max == null) {
    return "Salary not disclosed";
  }
  if (min != null && max != null) {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }
  if (min != null) {
    return `From $${min.toLocaleString()}`;
  }
  return `Up to $${max?.toLocaleString()}`;
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      recruiter: { select: { name: true } },
      skills: true,
    },
  });

  if (!job) {
    notFound();
  }

  const session = await auth();
  const isJobSeeker = session?.user?.role === "JOBSEEKER";

  let isSaved = false;
  if (isJobSeeker && session?.user?.id) {
    const saved = await prisma.savedOpportunity.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId: job.id,
        },
      },
    });
    isSaved = Boolean(saved);
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/jobs" className="text-sm text-muted-foreground hover:underline">
          Back to jobs
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{job.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {job.company} • {job.location}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{job.type}</Badge>
              {job.remote && <Badge variant="outline">Remote</Badge>}
              <Badge variant="outline">{formatSalary(job.salaryMin, job.salaryMax)}</Badge>
            </div>
            {job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {job.description}
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Requirements</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {job.requirements}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Posted by {job.recruiter?.name || "Recruiter"}
            </p>
            {isJobSeeker && (
              <div className="flex flex-wrap gap-3">
                <SaveJobButton jobId={job.id} initialSaved={isSaved} />
                <ApplyJobForm jobId={job.id} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
