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

    if (session.user.role !== "JOBSEEKER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const savedJobs = await prisma.savedOpportunity.findMany({
      where: { userId: session.user.id },
      include: { job: true },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json({ savedJobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved jobs" },
      { status: 500 }
    );
  }
}
