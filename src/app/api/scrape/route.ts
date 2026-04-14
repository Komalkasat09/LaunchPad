import { NextResponse } from "next/server";
import axios from "axios";
import { load } from "cheerio";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fallbackInternships = [
  {
    title: "Software Engineering Intern",
    company: "LaunchPad Labs",
    location: "Remote",
    type: "Internship",
    description: "Work with the engineering team on real product features.",
    requirements: ["JavaScript", "React"],
  },
  {
    title: "Data Analyst Intern",
    company: "Insight Analytics",
    location: "New York, NY",
    type: "Internship",
    description: "Support analytics projects and build dashboards.",
    requirements: ["SQL", "Excel"],
  },
];

async function scrapeInternships() {
  try {
    const response = await axios.get<string>("https://internshala.com/internships", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      responseType: "text",
      timeout: 15000,
    });

    const $ = load(response.data);
    const results: typeof fallbackInternships = [];

    $(".individual_internship").each((_, element) => {
      const title = $(element).find(".profile").first().text().trim();
      const company = $(element).find(".company_name").first().text().trim();
      const location = $(element).find(".locations").first().text().trim() || "Remote";
      const description = $(element).find(".internship_meta").text().trim() || "See listing for details.";

      if (title && company) {
        results.push({
          title,
          company,
          location,
          type: "Internship",
          description,
          requirements: [],
        });
      }
    });

    return results.length > 0 ? results : fallbackInternships;
  } catch (error) {
    console.error("Scrape error:", error);
    return fallbackInternships;
  }
}

async function getScraperRecruiterId() {
  const email = "scraper@launchpad.local";
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return existing.id;
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: "LaunchPad Scraper",
      role: "RECRUITER",
    },
  });

  return user.id;
}

export async function GET() {
  const internships = await scrapeInternships();
  return NextResponse.json({ internships });
}

export async function POST() {
  try {
    const internships = await scrapeInternships();
    const recruiterId = await getScraperRecruiterId();
    let created = 0;

    for (const internship of internships) {
      const existing = await prisma.job.findFirst({
        where: {
          recruiterId,
          title: internship.title,
          company: internship.company,
          location: internship.location,
        },
      });

      if (existing) {
        continue;
      }

      await prisma.job.create({
        data: {
          title: internship.title,
          company: internship.company,
          location: internship.location,
          description: internship.description,
          requirements: internship.requirements?.join(", ") || "See listing for details.",
          type: internship.type || "Internship",
          remote: internship.location.toLowerCase().includes("remote"),
          recruiterId,
          skills: {
            create: (internship.requirements || []).map((name) => ({ name })),
          },
        },
      });
      created += 1;
    }

    return NextResponse.json({ created }, { status: 201 });
  } catch (error) {
    console.error("Error importing internships:", error);
    return NextResponse.json(
      { error: "Failed to import internships" },
      { status: 500 }
    );
  }
}
