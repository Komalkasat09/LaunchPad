import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: "ACTIVE" },
      orderBy: { postedAt: "desc" },
      include: {
        recruiter: { select: { name: true } },
        skills: true,
      },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
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

    if (session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    if (!title || !company || !location || !description || !requirements || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
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
        recruiterId: session.user.id,
        skills: {
          create: Array.isArray(skills)
            ? skills.map((name) => ({ name }))
            : [],
        },
      },
      include: {
        skills: true,
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
