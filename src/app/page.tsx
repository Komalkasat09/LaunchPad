import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
const session = await auth();

return (
<div className="flex flex-col min-h-screen">
{/* Header */}
<header className="border-b">
<div className="container mx-auto flex h-16 items-center justify-between px-4">
<Link href="/" className="font-bold text-xl">
JobConnect
</Link>
<nav className="flex gap-6">
<Link href="/jobs" className="hover:text-blue-600 transition">
Browse Jobs
</Link>
<Link href="/companies" className="hover:text-blue-600 transition">
Companies
</Link>
<Link href="/about" className="hover:text-blue-600 transition">
About
</Link>
</nav>
<div className="flex items-center gap-4">
{session ? (
<Button asChild variant="outline">
<Link href="/dashboard">Dashboard</Link>
</Button>
) : (
<>
<Button asChild variant="outline">
<Link href="/auth/signin">Sign In</Link>
</Button>
<Button asChild>
<Link href="/auth/signup">Sign Up</Link>
</Button>
</>
)}
</div>
</div>
</header>
  {/* Hero Section */}
  <section className="flex-grow flex items-center bg-gradient-to-r from-blue-50 to-indigo-50">
    <div className="container mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Find Your Dream Job or Perfect Candidate
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            JobConnect helps job seekers find meaningful employment and 
            assists recruiters in discovering top talent for their organizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="px-8">
              <Link href={session ? "/dashboard" : "/auth/signup"}>
                {session ? "Go to Dashboard" : "Get Started"}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-xs text-gray-500">Open roles</p>
                <p className="text-lg font-semibold">1,240</p>
              </div>
              <div className="rounded-md bg-indigo-50 p-3">
                <p className="text-xs text-gray-500">New this week</p>
                <p className="text-lg font-semibold">86</p>
              </div>
              <div className="rounded-md bg-emerald-50 p-3">
                <p className="text-xs text-gray-500">Remote</p>
                <p className="text-lg font-semibold">42%</p>
              </div>
            </div>
            <div className="rounded-md border border-gray-100 p-4">
              <p className="text-xs uppercase text-gray-400">Featured</p>
              <p className="text-base font-semibold">Frontend Intern</p>
              <p className="text-sm text-gray-500">Remote • LaunchPad Labs</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-gray-100 px-2 py-1">React</span>
                <span className="rounded-full bg-gray-100 px-2 py-1">TypeScript</span>
                <span className="rounded-full bg-gray-100 px-2 py-1">UI</span>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">Data Analyst Intern</p>
                  <p className="text-xs text-gray-500">New York, NY</p>
                </div>
                <span className="text-xs text-gray-400">2d ago</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">Product Design Intern</p>
                  <p className="text-xs text-gray-500">Hybrid</p>
                </div>
                <span className="text-xs text-gray-400">5d ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Features Section */}
  <section className="bg-white py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">
        How JobConnect Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* For Job Seekers */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">For Job Seekers</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="bg-blue-500 text-white rounded-full p-1 mt-1 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>Create a professional profile</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-blue-500 text-white rounded-full p-1 mt-1 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>Discover relevant job opportunities</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-blue-500 text-white rounded-full p-1 mt-1 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>Apply with a single click</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-blue-500 text-white rounded-full p-1 mt-1 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>Track application status</span>
            </li>
          </ul>
        </div>

        {/* For Recruiters */}
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">For Recruiters</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="bg-indigo-500 text-white rounded-full p-1 mt-1 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>Post job openings</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-indigo-500 text-white rounded-full p-1 mt-1 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>Browse qualified candidates</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-indigo-500 text-white rounded-full p-1 mt-1 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>Manage applicants efficiently</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-indigo-500 text-white rounded-full p-1 mt-1 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>Schedule interviews seamlessly</span>
            </li>
          </ul>
        </div>

        {/* For Companies */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">For Companies</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="bg-purple-500 text-white rounded-full p-1 mt-1 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>Build an employer brand</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-purple-500 text-white rounded-full p-1 mt-1 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>Analytics and reporting</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-purple-500 text-white rounded-full p-1 mt-1 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>Team collaboration tools</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-purple-500 text-white rounded-full p-1 mt-1 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>ATS integration</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  {/* Stats Section */}
  <section className="bg-gray-50 py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <p className="text-4xl font-bold text-blue-600">5K+</p>
          <p className="text-gray-600 mt-2">Active Jobs</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-indigo-600">10K+</p>
          <p className="text-gray-600 mt-2">Job Seekers</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-purple-600">1K+</p>
          <p className="text-gray-600 mt-2">Companies</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-green-600">8K+</p>
          <p className="text-gray-600 mt-2">Successful Matches</p>
        </div>
      </div>
    </div>
  </section>

  {/* CTA Section */}
  <section className="bg-blue-600 text-white py-16">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
      <p className="max-w-2xl mx-auto mb-8 text-blue-100">
        Join thousands of job seekers and employers who have found success with JobConnect.
      </p>
      <Button asChild size="lg" variant="secondary" className="px-8">
        <Link href={session ? "/dashboard" : "/auth/signup"}>
        {session ? "Go to Dashboard" : "Sign Up Now"}
      </Link>
    </Button>
  </div>
</section>

{/* Footer */}
<footer className="bg-gray-100 border-t py-8">
  <div className="container mx-auto px-4 text-center text-gray-500">
    <p>© {new Date().getFullYear()} JobConnect. All rights reserved.</p>
    <nav className="mt-4 flex justify-center gap-4">
      <Link href="/terms" className="hover:text-blue-600 transition">
        Terms of Service
      </Link>
      <Link href="/privacy" className="hover:text-blue-600 transition">
        Privacy Policy
      </Link>
      <Link href="/contact" className="hover:text-blue-600 transition">
        Contact Us
      </Link>
    </nav>
  </div>
</footer>
</div>
);
}