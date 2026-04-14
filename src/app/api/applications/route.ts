import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await prisma.application.findMany({
      where: { applicantId: session.user.id },
      include: { job: true },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "JOBSEEKER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const { jobId, resumeUrl, coverLetter } = data;

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.status !== "ACTIVE") {
      return NextResponse.json({ error: "Job not available" }, { status: 404 });
    }

    const existing = await prisma.application.findFirst({
      where: { jobId, applicantId: session.user.id },
    });

    if (existing) {
      return NextResponse.json({ error: "Already applied" }, { status: 409 });
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        applicantId: session.user.id,
        resumeUrl: resumeUrl || null,
        coverLetter: coverLetter || null,
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
