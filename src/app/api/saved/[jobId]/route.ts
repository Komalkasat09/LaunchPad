import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(_: Request, { params }: { params: { jobId: string } }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "JOBSEEKER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.savedOpportunity.upsert({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId: params.jobId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        jobId: params.jobId,
      },
    });

    return NextResponse.json({ message: "Saved" }, { status: 201 });
  } catch (error) {
    console.error("Error saving job:", error);
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { jobId: string } }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "JOBSEEKER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.savedOpportunity.delete({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId: params.jobId,
        },
      },
    });

    return NextResponse.json({ message: "Removed" });
  } catch (error) {
    console.error("Error removing saved job:", error);
    return NextResponse.json(
      { error: "Failed to remove saved job" },
      { status: 500 }
    );
  }
}
