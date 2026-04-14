import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { jobSeekerProfileSchema } from "@/lib/schemas/profile-schema";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate the data
    const validationResult = jobSeekerProfileSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Get the current profile
    const normalizedSkills = (data.skills || []).map((name: string) => ({ name }));

    const profile = await prisma.jobSeekerProfile.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        title: data.title,
        bio: data.bio,
        location: data.location,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        linkedin: data.linkedin,
        github: data.github,
        twitter: data.twitter,
        website: data.website,
        isProfilePublic: data.isProfilePublic,
        skills: {
          deleteMany: {},
          create: normalizedSkills,
        },
      },
      create: {
        userId: session.user.id,
        title: data.title,
        bio: data.bio,
        location: data.location,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        linkedin: data.linkedin,
        github: data.github,
        twitter: data.twitter,
        website: data.website,
        isProfilePublic: data.isProfilePublic,
        skills: {
          create: normalizedSkills,
        },
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}