import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { experienceSchema } from "@/lib/schemas/profile-schema";

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const validationResult = experienceSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const existing = await prisma.experience.findUnique({
      where: { id: params.id },
      include: { jobSeekerProfile: true },
    });

    if (!existing || existing.jobSeekerProfile.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const experience = await prisma.experience.update({
      where: { id: params.id },
      data: {
        title: data.title,
        company: data.company,
        location: data.location || null,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        current: data.isCurrentPosition,
        description: data.description || null,
      },
    });

    return NextResponse.json({
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.experience.findUnique({
      where: { id: params.id },
      include: { jobSeekerProfile: true },
    });

    if (!existing || existing.jobSeekerProfile.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.experience.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
