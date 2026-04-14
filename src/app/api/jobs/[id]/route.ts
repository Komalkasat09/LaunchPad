import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        recruiter: { select: { name: true } },
        skills: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existing = await prisma.job.findFirst({
      where: { id: params.id, recruiterId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const data = await request.json();
    const {
      title,
      company,
      location,
      description,
      requirements,
      type,
      remote,
      salaryMin,
      salaryMax,
      deadlineAt,
      skills,
    } = data;

    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        title,
        company,
        location,
        description,
        requirements,
        type,
        remote: Boolean(remote),
        salaryMin: salaryMin != null ? Number(salaryMin) : null,
        salaryMax: salaryMax != null ? Number(salaryMax) : null,
        deadlineAt: deadlineAt ? new Date(deadlineAt) : null,
        skills: {
          deleteMany: {},
          create: Array.isArray(skills)
            ? skills.map((name) => ({ name }))
            : [],
        },
      },
      include: { skills: true },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existing = await prisma.job.findFirst({
      where: { id: params.id, recruiterId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    await prisma.job.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Job deleted" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
