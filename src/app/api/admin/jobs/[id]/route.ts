import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.job.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Job removed" });
  } catch (error) {
    console.error("Error removing job:", error);
    return NextResponse.json({ error: "Failed to remove job" }, { status: 500 });
  }
}
