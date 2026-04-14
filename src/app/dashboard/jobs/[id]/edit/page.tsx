import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { JobForm } from "@/components/jobs/job-form";

const prisma = new PrismaClient();

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "RECRUITER") {
    redirect("/dashboard");
  }

  const job = await prisma.job.findFirst({
    where: { id, recruiterId: session.user.id },
    include: { skills: true },
  });

  if (!job) {
    redirect("/dashboard/jobs");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Job</h1>
      <JobForm
        jobId={job.id}
        initialData={{
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          requirements: job.requirements,
          type: job.type,
          remote: job.remote,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          deadlineAt: job.deadlineAt,
          skills: job.skills.map((skill) => skill.name),
        }}
      />
    </div>
  );
}
