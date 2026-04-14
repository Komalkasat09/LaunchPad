"use client";

import { Card, CardContent } from "@/components/ui/card";

type Education = {
  id: string;
  institution: string;
  degree?: string | null;
};

type EducationSectionProps = {
  educations?: Education[];
};

export function EducationSection({ educations = [] }: EducationSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">Education</h3>
        {educations.length === 0 ? (
          <p className="text-sm text-gray-500">No education entries yet.</p>
        ) : (
          <ul className="text-sm text-gray-700 space-y-2">
            {educations.map((education) => (
              <li key={education.id}>
                {education.institution} {education.degree ? `- ${education.degree}` : ""}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
