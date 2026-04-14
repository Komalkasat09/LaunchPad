//src/app/api/profile/experience/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { experienceSchema } from "@/lib/schemas/profile-schema";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate the data
    const validationResult = experienceSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Get the profile ID
    const profile = await prisma.jobSeekerProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Create the experience
    const experience = await prisma.experience.create({
      data: {
        jobSeekerProfileId: profile.id,
        title: data.title,
        company: data.company,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        current: data.isCurrentPosition,
        description: data.description,
      },
    });

    return NextResponse.json({
      message: "Experience added successfully",
      experience,
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding experience:", error);
    return NextResponse.json(
      { error: "Failed to add experience" },
      { status: 500 }
    );
  }
}