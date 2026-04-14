import { JobForm } from "@/components/jobs/job-form";

export default function CreateJobPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Post a Job</h1>
      <JobForm />
    </div>
  );
}
