import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { AdminJobModeration } from "@/components/admin/admin-job-moderation";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [userCount, jobCount, applicationCount, jobs] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.application.count(),
    prisma.job.findMany({
      orderBy: { postedAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Console</h1>
        <p className="text-sm text-muted-foreground">
          Monitor users, jobs, and applications.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Users</p>
          <p className="text-2xl font-semibold">{userCount}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Jobs</p>
          <p className="text-2xl font-semibold">{jobCount}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Applications</p>
          <p className="text-2xl font-semibold">{applicationCount}</p>
        </div>
      </div>
      <AdminJobModeration jobs={jobs} />
    </div>
  );
}
