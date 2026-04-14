import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ScrapeJobsButton } from "@/components/jobs/scrape-jobs-button";

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

export default async function JobsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; type?: string; remote?: string; location?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q?.trim();
  const type = resolvedParams?.type?.trim();
  const location = resolvedParams?.location?.trim();
  const remote = resolvedParams?.remote === "true";

  const jobs = await prisma.job.findMany({
    where: {
      status: "ACTIVE",
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { company: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(type ? { type: { equals: type, mode: "insensitive" } } : {}),
      ...(location
        ? { location: { contains: location, mode: "insensitive" } }
        : {}),
      ...(resolvedParams?.remote ? { remote } : {}),
    },
    orderBy: { postedAt: "desc" },
    include: {
      recruiter: { select: { name: true } },
      skills: true,
    },
  });

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Browse Jobs</h1>
            <p className="text-sm text-muted-foreground">
              Find internships and job opportunities tailored for you.
            </p>
          </div>
          <ScrapeJobsButton />
        </div>

        <form className="grid gap-3 md:grid-cols-4" action="/jobs" method="get">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Search</label>
            <input
              name="q"
              defaultValue={query}
              placeholder="Title, company, keywords"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Location</label>
            <input
              name="location"
              defaultValue={location}
              placeholder="City or remote"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <input
              name="type"
              defaultValue={type}
              placeholder="Full-time, Internship"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="remote" value="true" defaultChecked={remote} />
              Remote
            </label>
            <button
              type="submit"
              className="ml-auto rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Filter
            </button>
          </div>
        </form>

        {jobs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                No jobs available yet. Check back soon.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>
                    {job.company} • {job.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">{job.type}</Badge>
                    {job.remote && <Badge variant="outline">Remote</Badge>}
                    <Badge variant="outline">{formatSalary(job.salaryMin, job.salaryMax)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {job.description}
                  </p>
                  {job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 6).map((skill) => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Posted by {job.recruiter?.name || "Recruiter"}
                  </p>
                  <Link
                    href={`/jobs/${job.id}`}
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
    </main>
  );
}
